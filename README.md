# Next.js + Convex App

This is a full-stack application built with [Next.js](https://nextjs.org) for the frontend and [Convex](https://convex.dev) for the backend. The project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, start the Convex development server:

```bash
npx convex dev
```

Then, in a new terminal, run the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the frontend by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Backend functions can be edited in the `convex/` directory. The functions auto-sync with your development deployment as you edit them.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font for Vercel.

## Learn More

To learn more about Next.js and Convex, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Convex Documentation](https://docs.convex.dev) - learn about Convex features and API
- [Next.js + Convex Guide](https://docs.convex.dev/quickstart/nextjs) - learn how to build full-stack apps with Next.js and Convex
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Deployment

### Frontend (Next.js)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Backend (Convex)

Your Convex backend is automatically deployed when you push your code. You can manage your deployments through the [Convex Dashboard](https://dashboard.convex.dev).

Check out the [Convex deployment documentation](https://docs.convex.dev/production/deployment) for more details.
