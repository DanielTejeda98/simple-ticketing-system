import { createMongoAbility, MongoAbility, RawRuleOf, ForcedSubject } from '@casl/ability';

export const actions = ['create', 'create-any', 'read', 'read-any', 'update', 'update-any', 'delete', 'delete-any'] as const;
export const subjects = ['tickets', 'projects', 'projects/costs', 'users', 'audit', 'permissions', 'system', 'all'] as const;
// Defines the conditions to be met for the ability to be granted.
export const conditions = {
    "users": {
        "update": {
            _id: '{{self}}'
        }
    },
    "projects": {
        "read": {
            members: {
                $in: ['{{self}}']
            }
        },
        "update": {
            members: {
                $in: ['{{self}}']
            }
        },
        "delete": {
            owningClient: '{{self}}'
        }
    }
}
export type Abilities = [
    typeof actions[number],
    typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];

export type AppAbility = MongoAbility<Abilities>;
export const createAbility = (rules: RawRuleOf<AppAbility>[]) => createMongoAbility<AppAbility>(rules);