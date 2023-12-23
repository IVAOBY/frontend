import {PropsWithChildren} from "react";

export const GeneralLayout: PropsWithChildren<any> = ({children}) => {
    return <div className="container py-16">{children}</div>;
};