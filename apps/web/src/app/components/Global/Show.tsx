import React from "react";
import { ReactNode } from "react";

export default function ShowWhen ({children, condition}: {children: ReactNode, condition: boolean}) {
    const childrenArray = React.Children.toArray(children);

    const hasElseBlock = childrenArray.filter(child => React.isValidElement(child) && child.type === Else).length > 0;
    const ifChildren = childrenArray.filter(child => React.isValidElement(child) && child.type !== Else);
    const elseChildren = childrenArray.filter(child => React.isValidElement(child) && child.type === Else);

    return condition ? (
        <>{ifChildren}</>
      ) : hasElseBlock ? (
        <>{elseChildren}</>
      ) : null;
}

export const Else = ({children}: {children: ReactNode}) => {
    return <>{children}</>
}