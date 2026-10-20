import {Menu as MenuIcon, Search, ShoppingCart} from 'lucide-react';
import type {Cart, Menu} from '~/lib/types';
import {useAside} from '~/components/Aside';
import {useSignedInEmail} from '~/lib/session';

const headerNavLinkClassName =
  'text-black no-underline transition hover:no-underline hover:opacity-80';

const headerNavButtonClassName =
  'cursor-pointer border-0 bg-transparent p-0 text-base font-normal text-black no-underline transition hover:no-underline hover:opacity-80';

export function Header({
  menu,
  cart,
  currentPath,
}: {
  menu: Menu;
  cart: Cart | null;
  currentPath: string;
}) {
  const signedInEmail = useSignedInEmail();

  return (
    <header className="header">
      <HeaderMenuMobileToggle />
      <ShopBrand />
      <HeaderMenu menu={menu} viewport="desktop" currentPath={currentPath} />
      <nav className="header-ctas" role="navigation">
        {signedInEmail ? (
          <a href="/profile" title={signedInEmail} className={headerNavLinkClassName}>Profile</a>
        ) : (
          <a href="/login" className={headerNavLinkClassName}>Sign in</a>
        )}
        <SearchToggle />
        <CartBadge count={cart?.totalQuantity ?? 0} />
      </nav>
    </header>
  );
}

/** The "DD Shop" home link, shared by the top nav and the menu drawer. */
export function ShopBrand() {
  return (
    <a href="/" className={headerNavLinkClassName}>
      <strong className="font-brand text-[1.25rem] font-normal">DD Shop</strong>
    </a>
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
    <button
      type="button"
      aria-label="Open menu"
      className="header-menu-mobile-toggle reset cursor-pointer text-black"
      onClick={() => open('mobile')}
    >
      <MenuIcon aria-hidden="true" className="size-[1.5rem]" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button type="button" aria-label="Search" className={headerNavButtonClassName} onClick={() => open('search')}>
      <Search aria-hidden="true" className="size-5" />
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
      <ShoppingCart aria-hidden="true" className="size-4" />
      {count === 0 ? 'Cart' : `${count} ${count === 1 ? 'item' : 'items'}`}
    </button>
  );
}
