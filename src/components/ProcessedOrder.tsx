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
        <p className="text-sm font-medium uppercase tracking-wide text-green-700">Processed</p>
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
      </dl>
      <a href="/collections" className="text-sm font-medium text-neutral-900 underline">
        Continue shopping
      </a>
    </div>
  );
}
