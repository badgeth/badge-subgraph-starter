import { addBadgeAwardDataItem, awardBadge } from "./models";

export function handleExampleEvent(event): void {
  let badgeAward = awardBadge(
    event.params.graphAccount.toHexString(),
    event.block.number,
    event.transaction.hash.toHexString()
  );
  addBadgeAwardDataItem(badgeAward, "role", "Some Role");
  addBadgeAwardDataItem(badgeAward, "action", "Some Action");
}
