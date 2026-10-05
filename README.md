# Zenxity Website

The main website for Zenxity, built with Next.js, Prisma, and TailwindCSS.

## Overview

The primary web presence for Zenxity, featuring product information, user authentication, and a modern responsive design. Part of the Zenxity product suite.

## Features

- **Next.js** App Router with TypeScript
- **Prisma** ORM with PostgreSQL
- **TailwindCSS** for styling
- **Dark mode** support
- **Nix shell** for development environment

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Styling:** TailwindCSS
- **Dev environment:** Nix shell

## Getting Started

```bash
npm install
npm run dev
```

Or with Nix:

```bash
nix develop
npm run dev
```

## Project Structure

```
├── app/                     # Next.js App Router pages
├── components/              # React components
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── shell.nix                # Nix development shell
```

## License

MIT
