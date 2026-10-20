import type {Cart, Menu} from '~/lib/types';
import {Aside} from '~/components/Aside';
import {Header, HeaderMenu, ShopBrand} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {useLiveCart} from '~/components/CartForm';
import {SearchAside} from '~/components/SearchAside';

export function PageShell({
  headerMenu,
  footerMenu,
  cart,
  currentPath,
  children,
}: {
  headerMenu: Menu;
  footerMenu: Menu;
  cart: Cart | null;
  currentPath: string;
  children: React.ReactNode;
}) {
  const liveCart = useLiveCart(cart);

  return (
    <Aside.Provider>
      <Aside type="cart" heading="CART">
        <CartMain cart={liveCart} layout="aside" />
      </Aside>
      <Aside type="search" heading="SEARCH" hideHeader>
        <SearchAside />
      </Aside>
      <Aside type="mobile" heading={<ShopBrand />} side="left" hideCloseButton>
        <HeaderMenu menu={headerMenu} viewport="mobile" currentPath={currentPath} />
      </Aside>

      <Header
        menu={headerMenu}
        cart={liveCart}
        currentPath={currentPath}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer menu={footerMenu} currentPath={currentPath} />
    </Aside.Provider>
  );
}

function Footer({menu, currentPath}: {menu: Menu; currentPath: string}) {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-100">
      <nav className="flex flex-wrap justify-center gap-4 px-4 py-4" role="navigation">
        {menu.items.map((item) => {
          if (!item.url) return null;
          const url = item.url.startsWith('http')
            ? new URL(item.url).pathname
            : item.url;
          const isActive = currentPath === url;
          return (
            <a
              key={item.id}
              href={url}
              className={`text-sm transition hover:text-neutral-900 ${isActive ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}
            >
              {item.title}
            </a>
          );
        })}
      </nav>
    </footer>
  );
}
