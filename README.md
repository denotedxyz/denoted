# denoted

**A knowledge management editor that visualizes on-chain data**

Denoted is a knowledge management editor that builds on decentralized storage allowing users to own their data and respect their privacy.
Through open integrations users will be able to collate & visualize information from a wide variety of sources.

The vision is to create a platform that prioritizes user-focused data sovereignty, openness, interactivity, and composability, fundamentally transforming how we manage and share knowledge.

- 🚀 Clean and easy WYSIWYG-editor
- ✨ Support for multiple API integrations including Covalent, Subgraph, and Lens, etc.
- 💾 Saved and retrieved on ComposeDB through your decentralized identity (DID)

## About

We built a WYSIWYG-editor with a clean and simple design to use immediately for any user. You start by connecting to the app through Web3Auth. When you’re connected, you’ll be able to start creating. Whenever you’re making that slash, you’re fetching from one of our many integrations. We have integrations built for Covalent, Subgraph, Tally, Dune, and Lens, etc. Lastly, the data is saved and retrieved in ComposeDB through your decentralized identifier.

**Live on [https://denoted.xyz/](https://denoted.xyz/)**

## Contribution

### Custom Command

If you want to add a custom command, see _Adding a command_ in [web/README](https://github.com/ericzakariasson/denoted/blob/main/apps/web/README.md).

## Architecture

<img width="1760" alt="denoted architecture" src="https://user-images.githubusercontent.com/25622412/222936136-07acfc97-d4ee-42a2-8677-22fe0ed90b38.png">

## Tech stack

- Package-Manager: `yarn`
- Monorepo Tooling: `turborepo`
- Frontend: `next`
  - Contract Interactions: `wagmi`, `rainbowkit`, `web3auth`
  - Styling: `tailwind`
- Miscellaneous:
  - Linting & Formatting: `eslint`, `prettier`
