import { createContext, useContext } from "react";

interface SwitchContextInterface {
    isChecked: boolean;
    toggleSwitch: () => void;
}

export const SwitchContext = createContext<SwitchContextInterface | undefined>(undefined);

export const useSwitch = (): SwitchContextInterface => {
    const context = useContext(SwitchContext);
    if (!context) {
        throw new Error("useSwitchContext must be used within an SwitchProvider");
    }
    return context;
};