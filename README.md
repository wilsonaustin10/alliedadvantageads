# Free Tailwind landing page template

![Simple TailwindCSS template preview](https://github.com/cruip/tailwind-landing-page-template/assets/2683512/f9a98fab-a1bc-4fb5-8572-4de0b6bd932a)

**Simple Light** is a free landing page template built on top of **TailwindCSS** and fully coded in **React** / **Next.js**. Simple light is designed to provide all the basic components a developer need to create a landing page for SaaS products, online services, and more.
Use it for whatever you want, and be sure to reach us out on X if you build anything cool/useful with it.
Created and maintained with ❤️ by [Cruip.com](https://cruip.com/).

_Version 1.3.3 built with Tailwind CSS and React + Vite is available [here](https://github.com/cruip/tailwind-landing-page-template/releases/tag/1.3.3)._

## Live demo

Check the live demo here 👉️ [https://simple.cruip.com/](https://simple.cruip.com/)

## Simple Pro

[![Simple Pro](https://github.com/cruip/tailwind-landing-page-template/assets/2683512/992be2ba-3de7-4838-be41-12e85686c193)](https://cruip.com/)

## Design files

If you need the design files, you can download them from Figma's Community 👉 https://bit.ly/3HOZMpf

## Usage

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Support notes

This template has been developed with the App Router (`app`) and React Server Components. If you’re unfamiliar with these beta features, you can find more information about them on the Next.js beta documentation page. So, please note that any request dealing with React (e.g. extra features, customisations, et cetera) is to be considered out of the support scope.

For more information about what support covers, please see our (FAQs)[https://cruip.com/faq/].

## Optimization Pipeline

The `pipeline/` package runs the four Allied Advantage optimization agents
against a Google Ads account export and emits a prioritized markdown report
under `reports/<account>/<date>.md`.

### Running it

```bash
python -m pipeline.run sample_account \
  --export fixtures/sample_account/export.json \
  --date 2026-05-01
```

### Agents

The pipeline runs these four agents in sequence and merges their output:

1. **KeywordAgent** — flags zero-conversion keywords and high-CPA outliers.
2. **AdCopyAgent** — flags low-CTR ads against the top performer in each ad group.
3. **BudgetAgent** — recommends shifting daily spend from the worst-CPA campaign to the best.
4. **GeoAgent** — flags regions burning budget with no conversions.

Each agent lives in its own module under `pipeline/agents/` and consumes the
typed `AccountExport` defined in `pipeline/contracts.py`.

### Where it slots into the 60-day client onboarding

| Phase | Day range | What happens | Pipeline involvement |
| --- | --- | --- | --- |
| Kickoff | Day 1–7 | Intake form, GHL setup, landing page build, account access granted | none |
| Launch | Day 8–14 | Campaigns built and launched against the agreed keyword set | none — accounts have no data yet |
| Learning | Day 15–29 | Campaigns accumulate clicks, calls, and form fills | none — let data mature |
| **First optimization pass** | **Day 30** | Pull the 30-day Google Ads account export and run `python -m pipeline.run <account_id>`. Review the generated `reports/<account>/<date>.md` with the client. Apply the P1/P2 actions. | **this pipeline** |
| Iterate | Day 31–59 | Apply recommendations, run weekly check-ins, watch for spend creep | re-run pipeline weekly |
| **60-day review** | **Day 60** | Pull a second export and re-run the pipeline. Compare against day-30 report to confirm wasted spend dropped and CPA improved. Use the second report as the deliverable for the 60-day client review. | **this pipeline** |

The pipeline replaces the manual 2–3 hour spreadsheet audit previously done at
day 30 and day 60 of every onboarding.

### Tests

```bash
pytest tests/
```

`tests/test_pipeline_golden.py` diffs the generated report against
`fixtures/sample_account/expected_report.md` with a 5% line-diff tolerance.
Small wording tweaks pass; substantive behavior changes require an intentional
golden-file refresh (`cp` the new report over the expected one and re-run).

## Credits

- [Nucleo](https://nucleoapp.com/)

## Terms and License

- Released under the [GPL](https://www.gnu.org/licenses/gpl-3.0.html).
- Copyright 2024 [Cruip](https://cruip.com/).
- Use it for personal and commercial projects, but please don’t republish, redistribute, or resell the template.
- Attribution is not required, although it is really appreciated.

## About Us

We're an Italian developer/designer duo creating high-quality design/code resources for developers, makers, and startups.

## Stay in the loop

If you would like to know when we release new resources, you can follow [@pacovitiello](https://x.com/pacovitiello) and [@DavidePacilio](https://x.com/DavidePacilio) on X, or you can subscribe to our [newsletter](https://cruip.com/newsletter/).

