import {useId, useRef, useState} from 'react';
import {inputClassName, primaryButtonClassName} from '~/lib/form-classes';
import {useAside} from '~/components/Aside';
import type {ProductSummary, Collection, Page, Article} from '~/lib/types';
import {EurMoney} from '~/components/EurMoney';

type PredictiveResult = {
  total: number;
  items: {
    products: ProductSummary[];
    collections: Collection[];
    pages: Page[];
    articles: Array<Article & {blogHandle: string}>;
    queries: Array<{text: string; styledText: string}>;
  };
};

export function SearchAside() {
  const queriesDatalistId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const {close} = useAside();
  const [term, setTerm] = useState('');
  const [result, setResult] = useState<PredictiveResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchResults(value: string) {
    setTerm(value);
    if (!value.trim()) {
      setResult(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=5`);
      const data = await res.json();
      setResult(data.result);
    } finally {
      setLoading(false);
    }
  }

  function goToSearch() {
    const q = inputRef.current?.value;
    window.location.href = '/search' + (q ? `?q=${encodeURIComponent(q)}` : '');
    close();
  }

  const items = result?.items;
  const total = result?.total ?? 0;

  return (
    <div className="predictive-search">
      <div className="predictive-search-form flex w-full items-center gap-2">
        <input
          ref={inputRef}
          name="q"
          type="search"
          list={queriesDatalistId}
          placeholder="Search…"
          className={`${inputClassName} m-0 min-w-0 flex-1`}
          onChange={(e) => fetchResults(e.target.value)}
          onFocus={(e) => fetchResults(e.target.value)}
        />
        <button type="button" onClick={goToSearch} className={`${primaryButtonClassName} shrink-0`}>
          Search
        </button>
      </div>

      {loading && term ? <div>Loading...</div> : null}
      {!loading && term && !total ? (
        <p>No results for <q>{term}</q></p>
      ) : null}

      {items && total > 0 ? (
        <>
          <datalist id={queriesDatalistId}>
            {items.queries.map((q) => (
              <option key={q.text} value={q.text} />
            ))}
          </datalist>
          {items.products.length > 0 && (
            <div className="predictive-search-result">
              <h5>Products</h5>
              <ul>
                {items.products.map((p) => (
                  <li key={p.id}>
                    <a href={`/products/${p.handle}`} onClick={close}>
                      {p.title} — <EurMoney amount={p.priceRange.minVariantPrice.amount} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {items.collections.length > 0 && (
            <div className="predictive-search-result">
              <h5>Collections</h5>
              <ul>
                {items.collections.map((c) => (
                  <li key={c.id}>
                    <a href={`/collections/${c.handle}`} onClick={close}>{c.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {term ? (
            <a href={`/search?q=${encodeURIComponent(term)}`} onClick={close}>
              <p>View all results for <q>{term}</q> →</p>
            </a>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
