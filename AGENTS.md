# Repository Working Rules

## Frontend Architecture

Follow this structure for all new frontend work and for refactors of existing code:

```text
src/
├── assets/
├── components/   # Shared, reusable UI used by multiple features
├── config/       # App-level constants and configuration
├── context/      # Global React context only when truly cross-app
├── features/     # Feature-first modules; this is the primary place for business logic
│   └── <feature>/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
├── hooks/        # Shared hooks reused across features
├── layouts/      # Route/layout shells
├── lib/          # Thin wrappers around third-party libs or legacy adapters
├── pages/        # Route-level page entry points only
├── routes/       # Router composition and route declarations
├── stores/       # Global state stores
├── types/        # Shared cross-feature types
└── utils/        # Pure helper utilities
```

## Non-Negotiable Rules

1. Components must be split clearly and designed for reuse.
2. Business logic must live inside `features/<feature>`, not inside pages.
3. Pages should stay thin and mainly compose feature exports.
4. Shared UI belongs in `src/components`, feature-only UI belongs in `src/features/<feature>/components`.
5. If a legacy file cannot be moved immediately, create a thin adapter and keep new work on the target architecture.

## Current User Preference

- Keep the dashboard architecture aligned with the reference image and a feature-first structure.
- Keep the mock teacher account visible in the dashboard sidebar at the bottom-left.
