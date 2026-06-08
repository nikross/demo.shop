# Mock Shop

A simple demo storefront built with **Astro SSR** and React islands. Product data is stored in `data/catalog.json` with images in `public/images/`. No Shopify, Hydrogen, or Oxygen dependencies.

Originally scaffolded from Shopify's [Hydrogen Skeleton](https://github.com/Shopify/hydrogen/tree/main/templates/skeleton) starter (`npm create @shopify/hydrogen`), then adapted into a standalone mock shop.

## Requirements

- Node.js 22 or 24

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) (Astro dev default).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build for production |
| `npm start` | Run production server (after build) |
| `npm run preview` | Preview production build locally |
| `npm run fetch-data` | Re-fetch catalog data from mock.shop |

## Demo credentials

- **Login:** `jon@gmail.com` / `12345`
- **Checkout:** pre-filled mock payment details on the checkout page

Auth, signup, and checkout endpoints accept form data and return success responses without persisting anything.

## Deployment

Deploy with [Railpack](https://railpack.com) (Dokploy, Railway, etc.):

- **Build:** `npm run build` (via Railpack)
- **Start:** `npm run start` → `node ./dist/server/entry.mjs`
- **Node:** 22 (from `engines` / `.node-version`)

`railpack.json` overrides the install step to copy `package.json` / `package-lock.json` and run `npm install` (not `npm ci`) so Linux builds resolve platform-specific optional dependencies correctly.

Set these environment variables on your host:

| Variable | Value |
|----------|-------|
| `HOST` | `0.0.0.0` |
| `PORT` | whatever your platform assigns (e.g. `3000`) |
| `NODE_ENV` | `production` |

Local production test:

```bash
npm run build
HOST=0.0.0.0 PORT=3000 npm start
```

## Data

Catalog data was pulled from [mock.shop](https://mock.shop) and stored locally. To refresh:

```bash
npm run fetch-data
```
