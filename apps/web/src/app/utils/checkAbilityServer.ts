import { getUserPermissions } from "../controllers/userController";
import { actions, createAbility, subjects } from "../lib/appAbility";
import { checkAbility, checkAnyAccessAbility, PickActionsSingular, PickActionsWithAny } from "./checkAbility";

export async function checkAbilityServer (any: PickActionsWithAny<typeof actions>, singular: PickActionsSingular<typeof actions>, resource: typeof subjects[number]) {
    const rules = await getUserPermissions();
    const ability = createAbility(rules);
  
    return checkAbility(ability, any, singular, resource);
  }

export async function checkAnyAbilityServer (any: PickActionsWithAny<typeof actions>, resource: typeof subjects[number]) {
  const rules = await getUserPermissions();
  const ability = createAbility(rules);

  return checkAnyAccessAbility(ability, any, resource);
}