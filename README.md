# Green Corner

Green Corner is a premium plant ecommerce website. This repository is the application foundation: routing, shared providers, an HTTP client, design tokens, and tooling. Product catalog, cart, checkout, and account features are not part of this setup.

## Technology stack

- React with TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Zustand
- Tailwind CSS v4
- ESLint
- Prettier

Zustand is installed for future client-only state, such as a cart. It has no store yet. Server state belongs in TanStack Query.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Format

```bash
npm run format
```

Check formatting without writing files:

```bash
npm run format:check
```

## Environment variables

Copy `.env.example` to `.env` for local development.

| Variable            | Purpose                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Base URL for the shared Axios client in `src/core/api/axiosClient.ts` |

Do not commit `.env`. `.env.example` is the tracked template and contains no secrets. The API client does not call any endpoint yet.

## Folder structure

```text
src/
├── app/          Application composition, providers, and routing
├── assets/       Static images and animation files
├── core/         Shared infrastructure and business-agnostic utilities
├── features/     Business features, added when each feature is built
├── layout/       Application layouts, added with the page shells
├── App.tsx
├── index.css
└── main.tsx
```

Boundaries:

- `app/` owns providers and the router. It does not own feature logic.
- `assets/` owns static files. `logo.png` is not included until a real Green Corner logo is provided. Place it at `src/assets/logo.png`.
- `core/` owns shared infrastructure. Feature-specific components, hooks, services, and types stay inside `src/features`.
- `features/` is reserved. Do not put business screens in `core/` or `app/`.
- `layout/` is reserved for application-level layouts such as the navbar and footer.

`src/core/i18n/` is reserved for Arabic (`ar`, RTL) and English (`en`, LTR). The document defaults to English in `index.html`. No localization library is installed yet.
