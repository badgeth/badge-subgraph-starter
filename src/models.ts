import { ethereum } from "@graphprotocol/graph-ts";
import {
  BadgeAward,
  BadgeDefinition,
  DataItem,
  Protocol,
  Winner,
} from "../generated/schema";

const PROTOCOL_NAME = "Your Protocol";
const BADGE_NAME = "Your Badge";
const BADGE_DESCRIPTION = "Your Badge Description";
const BADGE_ROLE = "Some Protocol Role";

export function awardBadge(
  winnerAddress: string,
  event: ethereum.Event
): BadgeAward {
  // Only 1 TestnetWandererBadge per User Allowed
  let badgeAward = BadgeAward.load(winnerAddress);

  if (badgeAward == null) {
    let winner = provideWinner(winnerAddress);
    winner.badgeCount = winner.badgeCount + 1;
    winner.save();

    let badgeDefinition = provideBadgeDefinition();

    badgeDefinition.badgeCount = badgeDefinition.badgeCount + 1;
    badgeDefinition.save();

    let blockAwarded = event.block.number;
    let timestampAwarded = event.block.timestamp;
    let transactionHash = event.transaction.hash.toHexString();

    badgeAward = new BadgeAward(winnerAddress);
    badgeAward.winner = winnerAddress;
    badgeAward.definition = badgeDefinition.id;
    badgeAward.blockAwarded = blockAwarded;
    badgeAward.timestampAwarded = timestampAwarded;
    badgeAward.globalBadgeNumber = badgeDefinition.badgeCount;
    badgeAward.winnerBadgeNumber = 1;
    badgeAward.transactionHash = transactionHash;
    badgeAward.save();
  }
  return badgeAward as BadgeAward;
}

export function provideWinner(address: string): Winner {
  let winner = Winner.load(address);

  if (winner == null) {
    winner = new Winner(address);
    winner.badgeCount = 0;
    winner.save();
  }

  return winner as Winner;
}

export function provideBadgeDefinition(): BadgeDefinition {
  let badgeDefinition = BadgeDefinition.load(BADGE_NAME);

  if (badgeDefinition == null) {
    let protocol = provideProtocol();

    badgeDefinition = new BadgeDefinition(BADGE_NAME);
    badgeDefinition.protocol = protocol.id;
    badgeDefinition.description = BADGE_DESCRIPTION;
    badgeDefinition.protocolRole = BADGE_ROLE;

    badgeDefinition.image = "TBD";
    badgeDefinition.artist = "TBD";
    badgeDefinition.badgeCount = 0;

    badgeDefinition.save();
  }

  return badgeDefinition as BadgeDefinition;
}

export function provideProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_NAME);

  if (protocol == null) {
    protocol = new Protocol(PROTOCOL_NAME);
    protocol.save();
  }

  return protocol as Protocol;
}

export function addBadgeAwardDataItem(
  badgeAward: BadgeAward,
  key: string,
  value: string
): DataItem {
  let id = badgeAward.id.concat("-").concat(key);

  let dataItem = new DataItem(id);
  dataItem.badgeAward = badgeAward.id;
  dataItem.key = key;
  dataItem.value = value;
  dataItem.save();
  return dataItem as DataItem;
}

export function addBadgeDefinitionDataItem(
  badgeDefinition: BadgeDefinition,
  key: string,
  value: string
): DataItem {
  let id = badgeDefinition.id.concat("-").concat(key);

  let dataItem = new DataItem(id);
  dataItem.badgeDefinition = badgeDefinition.id;
  dataItem.key = key;
  dataItem.value = value;
  dataItem.save();
  return dataItem as DataItem;
}
