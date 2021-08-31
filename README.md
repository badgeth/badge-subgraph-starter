# Devs <> Badgeth

Developers, we are currently writing subgraphs for new protocols; this is your opportunity to define the on-chain behavior that you want to see rewarded. Devs who volunteer for the cause will receive an “O.G. Dev” NFT badge for bragging rights.

Read on if you'd like to setup a Badgeth subgraph for an existing or new protocol!

## Graph Node Setup

All subgraphs depend on graph-node running in the background. We've adapted the instructions from from [The Graph docs](https://thegraph.com/docs/developer/define-subgraph-hosted), and added a few recommendations of our own to expedite the process.

Here are the steps:

- Clone graph-node

  ```bash
  git clone https://github.com/graphprotocol/graph-node
  ```

  - Get access to an Ethereum node. We personally recommend the Free Tier of [Alchemy](https://alchemy.com) for developers who aren't interested in managing their own Ethereum node.

  - Edit your graph-node/docker/docker-compose.yml file. Change the "ethereum" environment variable to point to your Ethereum node. If you are using Alchemy, be sure to update <YOUR_API_KEY> and change <YOUR_NETWORK> to "mainnet" or "rinkeby".

  ```bash
  ...
  ...
  graph-node:
  ...
  ...
   environment:
     ...
     ...
     # ethereum: 'mainnet:http://host.docker.internal:8545'
     ethereum: "<YOUR_NETWORK>:https://eth-rinkeby.alchemyapi.io/v2/<YOUR_API_KEY>"
     ...
     ...
  ...
  ...
  ```

  - Finally, fire up docker-compose and see the magic happen!

  ```bash
  docker-compose up
  ```

## Graph CLI Scaffolding

The next step is to install the Graph CLI via yarn or npm.

```bash
yarn global add @graphprotocol/graph-cli
```

```bash
npm install -g @graphprotocol/graph-cli
```

We then run graph-cli's scaffolding command. From The Graph docs:

> The following command creates a subgraph that indexes all events of an existing contract. It attempts to fetch the contract ABI from Etherscan and falls back to requesting a local file path. If any of the optional arguments are missing, it takes you through an interactive form.

```bash
graph init \
  --product subgraph-studio
  --from-contract <CONTRACT_ADDRESS> \
  [--network <ETHEREUM_NETWORK>] \
  [--abi <FILE>] \
  <SUBGRAPH_SLUG> [<DIRECTORY>]
```

## Add Badgeth Entities & Helper Functions

To ensure that subgraphs can be queried with a consistent format, we ask that you include all of the entities from the schema.graphql file in this repo: Winner, BadgeAward, BadgeDefinition, Protocol, and DataItem.

We've also provided some helper functions in the src/models.ts file for your convenience. The helper functions are designed for subgraphs that return a single badge for a single protocol that can be awarded to users a single time. Feel free to edit these helper functions if your subgraph awards multiple badges or allows users to earn multiples of the same badge.

## Deploy on The Graph Studio

The easiest way to deploy your Badgeth badge subgraph is to use the [The Graph CLI](https://github.com/graphprotocol/graph-cli) and [The Graph Studio](https://thegraph.com/studio/). First, download The Graph CLI:

```bash
npm install -g @graphprotocol/graph-cli
```

Next, create an account and new subgraph on [The Graph Studio](https://thegraph.com/studio/). Go to your subgraph page, click the "Details" tab, scroll down to the "AUTH & DEPLOY" section, and find your auth token. Then, authenticate within the CLI:

```bash
graph auth  --studio <STUDIO_AUTH_TOKEN>
```

Finally, you can build and deploy your subgraph:

```bash
npm run codegen
npm run build
npm run deploy
```

## Learn More

To learn more about Badgeth and The Graph, take a look at the following resources:

- [The Graph Documentation](https://thegraph.org/docs) - learn about The Graph protocol and subgraph development
- [Badgeth Subgraph Starter](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

For questions and additional details, join our [Discord Channel](https://discord.com/invite/464p6GzrWq).
