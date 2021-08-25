# Badge Subgraph Starter

Here are some helpful instructions for starting your own Badgeth badge subgraph!

## Installation

These instructions are taken in part from [The Graph docs](https://thegraph.com/docs/developer/define-subgraph-hosted).

Our first step is to setup our local graph-node.

- Clone graph-node

  ```bash
  git clone https://github.com/graphprotocol/graph-node
  ```

  - Sign up for [Alchemy](https://alchemy.com) and create your own Ethereum node. You can alternatively use your own Ethereum node if you have the hardware.

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

  - Start your docker processes

  ```bash
  docker-compose up
  ```

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

Once scaffolding is finished, `cd` into your newly created project and add the following entities to your `schema.graphql` file.

```graphql
"""
Singleton entity that tracks numbers and stats
"""
type EntityStats @entity {
  "ID is set to 1"
  id: ID!
  "Number of badges awarded"
  totalBadgesAwarded: Int!
}

"""
Winners of the badge
"""
type Winner @entity {
  "ETH address of the winner"
  id: ID!
  "Number of badges won"
  badgeCount: Int!
  "Badges awarded to address"
  badgesAwarded: [BadgeAward!]! @derivedFrom(field: "winner")
}

"""
The badge that is awarded to winner
"""
type BadgeAward @entity {
  "{badgeName}-{winner}"
  id: ID!
  "Address of the winner"
  winner: Winner!
  "Block number in which badge was awarded"
  blockAwarded: BigInt!
  "Additional details about the badge"
  definition: BadgeDefinition!
  "Number in which the badge was awarded"
  badgeNumber: Int!
}

"""
Additional details related to the badge
"""
type BadgeDefinition @entity {
  "Name of the badge"
  id: ID!
  "Description of the badge"
  description: String!
  "IFTP link to the NFT badge"
  image: String!
  "Name of the artist responsible for NFT badge"
  artist: String!
  "Optional link to the artist's portfolio"
  artistWebsite: String
  "Total count of badges"
  badgeCount: Int!
  "URL slug for the frontend"
  urlHandle: String!
  "Associated protocol for the badge"
  protocol: Protocol!
}

"""
Protocols indexed by this subgraph
"""
type Protocol @entity {
  "Name of the protocol"
  id: ID!
  "Description for the protocol"
  description: String!
  "Website for the protocol"
  website: String!
}
```

Then, run your `npm run codegen` command to generate the type definitions for your newly added models in your `generated` folder!

## Helper Functions

We've found that creating a suite of helper functions that will create or load your models is a beneficial pattern. Feel free to copy the following methods into a `models.ts` file.

```typescript
export function createOrLoadEntityStats(): EntityStats {
  let entityStats = EntityStats.load("1");

  if (entityStats == null) {
    entityStats = new EntityStats("1");
    entityStats.totalBadgesAwarded = 0;
    entityStats.save();
  }

  return entityStats as EntityStats;
}

export function createOrLoadWinner(address: string): Winner {
  let winner = Winner.load(address);

  if (winner == null) {
    winner = new Winner(address);
    winner.badgeCount = 0;

    winner.save();
  }

  return winner as Winner;
}

export function createBadgeAward(
  badgeDefinition: BadgeDefinition,
  winnerAddress: string,
  blockNumber: BigInt
): void {
  // increment badgeCount
  let winner = createOrLoadWinner(winnerAddress);
  winner.badgeCount = winner.badgeCount + 1;
  winner.save();

  let entityStats = createOrLoadEntityStats();
  entityStats.totalBadgesAwarded = entityStats.totalBadgesAwarded + 1;
  entityStats.save();

  badgeDefinition.badgeCount = badgeDefinition.badgeCount + 1;
  badgeDefinition.save();

  let badgeNumberString = BigInt.fromI32(badgeDefinition.badgeCount).toString();

  // award badge
  let badgeId = badgeDefinition.id.concat("-").concat(badgeNumberString);
  let badgeAward = BadgeAward.load(badgeId);
  if (badgeAward == null) {
    badgeAward = new BadgeAward(badgeId);
    badgeAward.winner = winner.id;
    badgeAward.definition = badgeDefinition.id;
    badgeAward.blockAwarded = blockNumber;
    badgeAward.badgeNumber = badgeDefinition.badgeCount;
    badgeAward.save();
  }
}

export function createOrLoadBadgeDefinition(
  name: string,
  urlHandle: string,
  description: string,
  image: string,
  artist: string,
  protocolName: string
): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(name);

  if (badgeDefinition == null) {
    badgeDefinition = new BadgeDefinition(name);
    badgeDefinition.protocol = protocolName;
    badgeDefinition.description = description;
    badgeDefinition.image = image;
    badgeDefinition.artist = artist;
    badgeDefinition.urlHandle = urlHandle;
    badgeDefinition.badgeCount = 0;

    badgeDefinition.save();
  }

  return badgeDefinition as BadgeDefinition;
}

export function createProtocol(
  name: string,
  description: string,
  website: string
): Protocol {
  let protocol = new Protocol(name);
  protocol.description = description;
  protocol.website = website;
  protocol.save();

  return protocol as Protocol;
}
```

## Deploying Locally

Double check that your graph-node processes are running! Then, run the following commands:

```bash
npm run codegen
npm run build
npm run create-local
npm run deploy-local
```

## Deploying to Production

To deploy your subgraph, we recommend reading the relevant [The Graph's docs](https://thegraph.com/docs/developer/deploy-subgraph-studio).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
