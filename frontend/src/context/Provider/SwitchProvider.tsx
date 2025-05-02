import { ReactNode, useState } from "react";
import { SwitchContext } from "../useSwitch";

interface SwitchProviderProps {
    children: ReactNode;
}

export const SwitchProvider: React.FC<SwitchProviderProps> = ({ children }) => {
    const [isChecked, setisChecked] = useState(false);

    return (
        <SwitchContext.Provider value={{ isChecked, setisChecked }}>
            {children}
        </SwitchContext.Provider>
    );
};