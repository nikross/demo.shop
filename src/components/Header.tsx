import type {Cart, Menu} from '~/lib/types';
import {useAside} from '~/components/Aside';

const headerNavLinkClassName =
  'text-black no-underline transition hover:no-underline hover:opacity-80';

const headerNavButtonClassName =
  'cursor-pointer border-0 bg-transparent p-0 text-base font-normal text-black no-underline transition hover:no-underline hover:opacity-80';

export function Header({
  menu,
  cart,
  isLoggedIn,
  currentPath,
}: {
  menu: Menu;
  cart: Cart | null;
  isLoggedIn: boolean;
  currentPath: string;
}) {
  return (
    <header className="header">
      <a href="/" className={headerNavLinkClassName}>
        <strong>Mock Shop</strong>
      </a>
      <HeaderMenu menu={menu} viewport="desktop" currentPath={currentPath} />
      <nav className="header-ctas" role="navigation">
        <HeaderMenuMobileToggle />
        {isLoggedIn ? (
          <span className="text-sm text-neutral-600">Signed in</span>
        ) : (
          <a href="/login" className={headerNavLinkClassName}>Sign in</a>
        )}
        <SearchToggle />
        <CartBadge count={cart?.totalQuantity ?? 0} />
      </nav>
    </header>
  );
}

export function HeaderMenu({
  menu,
  viewport,
  currentPath,
}: {
  menu: Menu;
  viewport: 'desktop' | 'mobile';
  currentPath: string;
}) {
  const {close} = useAside();
  const className = `header-menu-${viewport}`;

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <a href="/" onClick={close} className={headerNavLinkClassName}>Home</a>
      )}
      {menu.items
        .filter((item) => item.title.toLowerCase() !== 'news')
        .map((item) => {
          if (!item.url) return null;
          const url = item.url.startsWith('http')
            ? new URL(item.url).pathname
            : item.url;
          const isActive = currentPath === url;
          return (
            <a
              key={item.id}
              href={url}
              onClick={close}
              className={`header-menu-item ${headerNavLinkClassName}${isActive ? ' font-bold' : ''}`}
            >
              {item.title}
            </a>
          );
        })}
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button className="header-menu-mobile-toggle reset" onClick={() => open('mobile')}>
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button type="button" className={headerNavButtonClassName} onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
      onClick={() => open('cart')}
    >
      Cart ({count})
    </button>
  );
}
