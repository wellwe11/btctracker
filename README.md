# btctracker

Dashboard that displays active prices for different bitcoins.

## Tech Stack

- Next.js 15 <br/>
  Allows me to utilize the App Router and Server Components for fast component mounting.

- Redux Toolkit <br/>
  To handle the wallet balance, trade history, and minor calculations.

- Jotai <br />
  Create local single-atomed states for each graph on the dashboard. Each atom is related to an atom-family.
  Once user interacts with the dash-board, the atom-family updates and updates the correct child-atom. It then finds the related component, and updates only this component.

- TanStack Query v5 <br/>
  By using Hydration Boundaries, the app pre-fetches data to ensure accurate rendering of BTC information. This allows precise data to be handed to the client, with 5-second interval polling to keep the dashboard live.

- Tailwind CSS <br/>
  For fast, readable, and minimalist design.

- TypeScript <br/>
  To prevent unpredictable behavior during runtime and ensure the safety of accurate, real-time data.
  - Zod <br/>
    For security during runtime, since we are working with real-time data, and simulating an exchange of coins.

- D3.js <br/>
  For clean and accurate data visualization.

## Getting Started

```bash
git clone https://github.com/wellwe11/btctracker

npm install

npm run dev
```

## Project Context

Real-time data handling to paint accurate graphs that displays live BTC data. A project that lets me combine a set of tools to work together and simulate a usable, real-world project.
