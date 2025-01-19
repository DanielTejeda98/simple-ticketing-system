import { RawRuleOf } from "@casl/ability";
import { actions, AppAbility, createAbility, subjects } from "../lib/appAbility";
import handleUnathorized from "./unauthorized";

export function checkAbility (ability: AppAbility, any: typeof actions[number], singular: typeof actions[number], resource: typeof subjects[number]) {
    return ability.can(any, resource) || ability.can(singular, resource);
}

export function checkRouteAccess (permissions: RawRuleOf<AppAbility>[], resource: typeof subjects[number]) {
    const ability = createAbility(permissions);
    if(!checkAbility(ability, "read-any", "read", resource)) {
      handleUnathorized();
    }
    return;
}

export function checkCreateAccess (permissions: RawRuleOf<AppAbility>[], resource: typeof subjects[number]) {
  const ability = createAbility(permissions);
  if(!checkAbility(ability, "create-any", "create", resource)) {
    handleUnathorized();
  }
  return;
}

export function checkCreateAccessWithAbility (ability: AppAbility, resource: typeof subjects[number]) {
  if(!checkAbility(ability, "create-any", "create", resource)) {
    handleUnathorized();
  }
  return;
}

export function checkUpdateAccess (permissions: RawRuleOf<AppAbility>[], resource: typeof subjects[number]) {
  const ability = createAbility(permissions);
  if(!checkAbility(ability, "update-any", "update", resource)) {
    handleUnathorized();
  }
  return;
}

export function checkUpdateAccessWithAbility (ability: AppAbility, resource: typeof subjects[number]) {
  if(!checkAbility(ability, "update-any", "update", resource)) {
    handleUnathorized();
  }
  return;
}
