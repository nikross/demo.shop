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

Build and run with any Node.js host (Dokploy, Railway, Fly.io, etc.):

```bash
npm run build
NODE_ENV=production npm start
```

Set `PORT` if your host requires a specific port. Docker:

```bash
docker build -t mock-shop .
docker run -p 3000:3000 mock-shop
```

## Data

Catalog data was pulled from [mock.shop](https://mock.shop) and stored locally. To refresh:

```bash
npm run fetch-data
```
