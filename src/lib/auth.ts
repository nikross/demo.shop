/**
 * Mock auth for demo login/signup flows.
 * Does not persist users; the signed-in state lives in sessionStorage
 * (see ~/lib/session).
 */

import type {IncomingMessage} from 'node:http';
import {
  DataDome,
  LoginEvent,
  RegistrationEvent,
  ResponseAction,
  ResponseStatus,
  type DataDomeEvent,
} from '@datadome/fraud-sdk-node';
import {waitUntil} from '@vercel/functions';
import {EMAIL_PATTERN, MIN_PASSWORD_LENGTH} from '~/lib/credentials';

/** DataDome decision details, returned to the browser for demo debugging. */
export type DataDomeInfo = {
  operation: 'validate' | 'collect' | 'skipped';
  action?: string;
  status?: string;
  reasons?: string[];
  score?: number;
  eventId?: string;
  message?: string;
  durationMs?: number;
};

export type AuthResult = (
  | {ok: true; message: string}
  | {ok: false; error: string}
) & {dataDome?: DataDomeInfo};

export async function parseAuthFormData(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as {email?: string; password?: string};
    return {
      email: String(body.email ?? '').trim(),
      password: String(body.password ?? ''),
    };
  }

  const formData = await request.formData();
  return {
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
  };
}

/** Any valid email signs in, as long as the password is long enough. */
export function authenticateLogin(email: string, password: string): AuthResult {
  if (EMAIL_PATTERN.test(email) && password.length >= MIN_PASSWORD_LENGTH) {
    return {ok: true, message: 'Login successful. Welcome back!'};
  }
  return {ok: false, error: 'Invalid login'};
}

let dataDomeClient: DataDome | null | undefined;

function getDataDomeClient(): DataDome | null {
  if (dataDomeClient === undefined) {
    const key = process.env.DATADOME_FRAUD_API_KEY;
    if (!key) {
      console.warn(
        'DATADOME_FRAUD_API_KEY is not set; skipping Account Protect.',
      );
    }
    dataDomeClient = key ? new DataDome(key, {timeout: 1500}) : null;
  }
  return dataDomeClient;
}

/**
 * The DataDome SDK reads headers, method, URL and socket info from a Node
 * IncomingMessage; Astro hands us a Web Request, so expose the same shape.
 */
function toIncomingMessage(request: Request): IncomingMessage {
  const url = new URL(request.url);
  return {
    headers: Object.fromEntries(request.headers),
    method: request.method,
    url: url.pathname + url.search,
    socket: {encrypted: url.protocol === 'https:'},
  } as unknown as IncomingMessage;
}

type Label = 'Login' | 'Sign up';

const SKIPPED: DataDomeInfo = {
  operation: 'skipped',
  message: 'DATADOME_FRAUD_API_KEY is not set',
};

/**
 * Sends the event to `validate` and logs the decision server-side. Anything
 * but `allow` becomes an obvious block notice for the demo UI, e.g.
 * "Login blocked by DataDome for security reasons. [deny]". Timeouts and API
 * errors come back from the SDK as `allow`, flagged by `status`.
 */
async function validateWithDataDome(
  client: DataDome,
  label: Label,
  email: string,
  request: Request,
  clientAddress: string,
  event: DataDomeEvent,
): Promise<AuthResult> {
  const start = performance.now();
  const response = await client.validate(toIncomingMessage(request), event, {
    addr: clientAddress,
  });
  const dataDome: DataDomeInfo = {
    operation: 'validate',
    action: response.action,
    status: response.status,
    reasons: response.reasons,
    score: response.score,
    eventId: response.eventId,
    message: 'message' in response ? response.message : undefined,
    durationMs: Math.round(performance.now() - start),
  };
  const summary = `[DataDome] ${label} validate for ${email}: action=${dataDome.action} status=${dataDome.status} (${dataDome.durationMs} ms)`;

  if (response.action !== ResponseAction.ALLOW) {
    console.warn(`${summary} → BLOCKED`, dataDome);
    return {
      ok: false,
      error: `${label} blocked by DataDome for security reasons. [${response.action}]`,
      dataDome,
    };
  }
  if (response.status !== ResponseStatus.OK) {
    console.warn(`${summary} → allowed by fallback`, dataDome);
  } else {
    console.info(`${summary} → allowed`, dataDome);
  }
  return {ok: true, message: `${label} allowed by DataDome.`, dataDome};
}

/**
 * Validates a login attempt against DataDome Account Protect.
 * Successful logins are sent to `validate` and must be blocked unless the
 * recommended action is `allow`. Failed logins are only reported to
 * `collect`, in the background, so the response doesn't wait on it.
 * https://docs.datadome.co/docs/account-protect-login
 */
export async function validateLogin(
  request: Request,
  clientAddress: string,
  email: string,
  succeeded: boolean,
): Promise<AuthResult> {
  const client = getDataDomeClient();
  if (!client) return {ok: true, message: 'Login allowed.', dataDome: SKIPPED};

  if (!succeeded) {
    const start = performance.now();
    waitUntil(
      client
        .collect(
          toIncomingMessage(request),
          new LoginEvent({
            account: email,
            status: 'failed',
            failReason: 'wrongPassword',
          }),
          {addr: clientAddress},
        )
        .then((response) => {
          const durationMs = Math.round(performance.now() - start);
          const log =
            response.status === ResponseStatus.OK ? console.info : console.warn;
          log(
            `[DataDome] Login collect for ${email}: status=${response.status} (${durationMs} ms)`,
            response,
          );
        }),
    );
    return {
      ok: true,
      message: 'Failed login reported to DataDome.',
      dataDome: {operation: 'collect', status: 'sent in background'},
    };
  }

  return validateWithDataDome(
    client,
    'Login',
    email,
    request,
    clientAddress,
    new LoginEvent({
      account: email,
      status: 'succeeded',
      user: {id: email},
      authentication: {type: 'local', mode: 'password'},
    }),
  );
}

/**
 * Validates the signup form, then the registration against DataDome Account
 * Protect. Only `allow` lets the account through; timeouts and API errors
 * resolve to `allow`.
 * https://docs.datadome.co/docs/account-protect-registration
 */
export async function validateSignup(
  request: Request,
  clientAddress: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!EMAIL_PATTERN.test(email)) {
    return {ok: false, error: 'Please enter a valid email address.'};
  }
  if (!password.trim()) {
    return {ok: false, error: 'Password is required.'};
  }

  const client = getDataDomeClient();
  const check = client
    ? await validateWithDataDome(
        client,
        'Sign up',
        email,
        request,
        clientAddress,
        new RegistrationEvent({
          account: email,
          status: 'attempted',
          user: {id: email, email},
          authentication: {type: 'local', mode: 'password'},
        }),
      )
    : {ok: true as const, dataDome: SKIPPED};
  if (!check.ok) return check;

  return {
    ok: true,
    message: 'Sign up successful! (Demo only — no account was created.)',
    dataDome: check.dataDome,
  };
}
