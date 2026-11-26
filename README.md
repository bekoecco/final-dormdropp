# DormDropp

Student furniture marketplace. Students moving out pass furniture to students moving in. DormDropp checks quality, then handles pickup, storage, delivery and the payout, with add-ons like packing, loading and short moves.

Live demo: https://bekoecco.github.io/final-dormdropp/

This is an early demo with sample data. No real pickups, deliveries, deposits or payouts. Everything is stored in the browser.

## What's in the demo

- **Buy**: pick pieces, choose delivery campus/date and add-ons, compare seller offers, place a deposit
- **Sell**: list pieces with condition and photo, choose pickup, see the estimated payout
- **Room sets**: sell or buy a whole room as one discounted set
- **My orders**: order tracker with the next action for buyer or seller
- **Admin**: the platform side (quality check, renegotiation, scheduling, delivery)

## Run locally

```
npm install
npm run dev
npm run build
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/pages.yml`.
