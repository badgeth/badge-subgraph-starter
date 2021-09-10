import { addBadgeAwardDataItem, awardBadge } from "./models";

export function handleExampleEvent(event): void {
  let badgeAward = awardBadge(event.params.graphAccount.toHexString(), event);
  addBadgeAwardDataItem(badgeAward, "action", "Some Action");
}
