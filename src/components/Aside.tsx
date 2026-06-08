import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useId} from 'react';

export type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

const ASIDE_OPEN_EVENT = 'mock-shop:aside-open';
const ASIDE_CLOSE_EVENT = 'mock-shop:aside-close';

function dispatchAsideOpen(type: AsideType) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ASIDE_OPEN_EVENT, {detail: type}));
  }
}

function dispatchAsideClose() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ASIDE_CLOSE_EVENT));
  }
}

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();
  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
      aria-labelledby={id}
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
          <h3 id={id}>{heading}</h3>
          <button className="close reset" onClick={close} aria-label="Close">
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  useEffect(() => {
    const onOpen = (event: Event) => {
      setType((event as CustomEvent<AsideType>).detail);
    };
    const onClose = () => setType('closed');

    window.addEventListener(ASIDE_OPEN_EVENT, onOpen);
    window.addEventListener(ASIDE_CLOSE_EVENT, onClose);
    return () => {
      window.removeEventListener(ASIDE_OPEN_EVENT, onOpen);
      window.removeEventListener(ASIDE_CLOSE_EVENT, onClose);
    };
  }, []);

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (aside) return aside;

  return {
    type: 'closed' as AsideType,
    open: dispatchAsideOpen,
    close: dispatchAsideClose,
  };
}
