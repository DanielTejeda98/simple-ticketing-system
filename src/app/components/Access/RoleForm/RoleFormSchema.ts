import { actions, subjects } from '@/app/lib/appAbility';
import { z, ZodBoolean, ZodObject, ZodString, ZodUnion } from 'zod';

type Subject = typeof subjects[number];
type Action = typeof actions[number];

type PermissionSchema = ZodUnion<[ZodString, ZodBoolean]>;

const generatePermissionsObject = () => {
    const subjectObj: Record<Subject, ZodObject<Record<Action, PermissionSchema>>> = {} as Record<Subject, ZodObject<Record<Action, PermissionSchema>>>;

    subjects.forEach(subject => {
        const generateActions = () => {
            const abilityObj: Record<Action, PermissionSchema> = {} as Record<Action, PermissionSchema>;

            actions.forEach((action) => {
                abilityObj[action] = z.string().or(z.boolean());
            })

            return abilityObj;
        } 
        subjectObj[subject] = z.object({
            ...generateActions()
        })

    })
    return subjectObj;
}

const RoleFormSchema = z.object({
    creator: z.string().optional(),
    updator: z.string().optional(),
    name: z.string().min(1, {
        message: "Role name must contain at least 1 character"
    }),
    ...generatePermissionsObject()
})

export default RoleFormSchema;