import { getUserPermissions } from "../controllers/userController";
import { actions, createAbility, subjects } from "../lib/appAbility";
import { checkAbility, checkAnyAccessAbility, PickActionsSingular, PickActionsWithAny } from "./checkAbility";

export async function checkAbilityServer (user: string, any: PickActionsWithAny<typeof actions>, singular: PickActionsSingular<typeof actions>, resource: typeof subjects[number]) {
    const rules = await getUserPermissions(user);
    const ability = createAbility(rules);
  
    return checkAbility(ability, any, singular, resource);
  }

export async function checkAnyAbilityServer (user: string, any: PickActionsWithAny<typeof actions>, resource: typeof subjects[number]) {
  const rules = await getUserPermissions(user);
  const ability = createAbility(rules);

  return checkAnyAccessAbility(ability, any, resource);
}