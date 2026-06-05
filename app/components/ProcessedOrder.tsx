import {Link} from 'react-router';

type ProcessedOrderProps = {
  orderId?: string;
  subtitle?: string;
};

export function ProcessedOrder({
  orderId = `ORD-${Date.now().toString(36).toUpperCase()}`,
  subtitle = 'Your request has been received and is being processed.',
}: ProcessedOrderProps) {
  const processedAt = new Date().toLocaleString();

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium uppercase tracking-wide text-green-700">
          Processed
        </p>
        <h2 className="text-2xl font-bold text-neutral-900">Order confirmed</h2>
        <p className="text-sm text-neutral-600">{subtitle}</p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-neutral-500">Order number</dt>
          <dd className="font-medium text-neutral-900">{orderId}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Processed at</dt>
          <dd className="font-medium text-neutral-900">{processedAt}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Status</dt>
          <dd className="font-medium text-green-700">Processed</dd>
        </div>
      </dl>

      <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
        <li className="flex justify-between px-4 py-3 text-sm">
          <span className="text-neutral-700">Account verification</span>
          <span className="font-medium text-neutral-900">Complete</span>
        </li>
        <li className="flex justify-between px-4 py-3 text-sm">
          <span className="text-neutral-700">Fulfillment queue</span>
          <span className="font-medium text-neutral-900">Scheduled</span>
        </li>
      </ul>

      <Link
        to="/collections"
        className="text-sm font-medium text-neutral-900 underline underline-offset-2"
      >
        Continue shopping
      </Link>
    </div>
  );
}
