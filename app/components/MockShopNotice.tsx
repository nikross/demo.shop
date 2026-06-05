export function MockShopNotice() {
  return (
    <section
      className="overflow-hidden rounded-lg border border-neutral-900 border-l-4 bg-white"
      aria-labelledby="mock-shop-notice-heading"
    >
      <div className="px-4 py-3.5">
        <h2
          id="mock-shop-notice-heading"
          className="text-xl font-bold leading-snug text-neutral-900"
        >
          Welcome to Hydrogen!
        </h2>
        <p className="mt-2 text-base leading-snug text-neutral-700">
          You&rsquo;re seeing mocked products because no store is connected to
          this project yet.
        </p>
        <p className="mt-2 text-base leading-snug text-neutral-700">
          Link a store by running{' '}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">
            npx shopify hydrogen link
          </code>{' '}
          in your terminal.
        </p>
      </div>
    </section>
  );
}
