import React, {ReactNode} from 'react';

export const GeneralLayout: React.FC<{ children: ReactNode }> = ({
                                                                     children,
                                                                 }) => {
    return <div className="container max-w-screen-lg py-16">{children}</div>;
};
