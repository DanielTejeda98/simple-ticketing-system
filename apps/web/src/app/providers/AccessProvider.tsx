"use client"

import { createContext, ReactNode } from 'react';
import { createContextualCan } from '@casl/react';
import { AppAbility, createAbility } from '../lib/appAbility';
import { defineAbility, RawRuleOf } from '@casl/ability';

export const AbilityContext = createContext<AppAbility>(defineAbility(() => {}));
export const Can = createContextualCan(AbilityContext.Consumer);

export default function AccessProvider ({permissions, children}: {permissions: RawRuleOf<AppAbility>[], children: ReactNode}) {
    const ability = createAbility(permissions);
    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    )
}
