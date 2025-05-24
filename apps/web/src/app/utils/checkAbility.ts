import { RawRuleOf } from "@casl/ability";
import { actions, AppAbility, createAbility, subjects } from "../lib/appAbility";
import { handleUnathorized } from "./redirectHandlers";

export type PickActionsWithAny<T extends readonly string[]> = T extends readonly (infer U)[] 
  ? U extends `${string}-any` 
    ? U 
    : never
  : never;

export type PickActionsSingular<T extends readonly string[]> = T extends readonly (infer U)[] 
  ? U extends `${string}-any` 
    ? never 
    : U
  : never;

export function checkAnyAccessAbility (ability: AppAbility, any: PickActionsWithAny<typeof actions>, resource: typeof subjects[number]) {
  return ability.can(any, resource);
}

export function checkAbility (ability: AppAbility, any: PickActionsWithAny<typeof actions>, singular: PickActionsSingular<typeof actions>, resource: typeof subjects[number]) {
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
