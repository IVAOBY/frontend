import React, { PropsWithChildren, ReactNode } from "react";

export const GeneralLayout: React.FC<PropsWithChildren<ReactNode>> = ({ children }) => {
    return <div className="container max-w-screen-lg py-16">{children}</div>;
};