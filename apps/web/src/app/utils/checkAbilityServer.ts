import { getUserPermissions } from "../controllers/userController";
import { actions, createAbility, subjects } from "../lib/appAbility";
import { checkAbility } from "./checkAbility";

export async function checkAbilityServer (user: string, any: typeof actions[number], singular: typeof actions[number], resource: typeof subjects[number]) {
    const rules = await getUserPermissions(user);
    const ability = createAbility(rules);
  
    return checkAbility(ability, any, singular, resource);
  }