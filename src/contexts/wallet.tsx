import { createContext } from "react";
import { Page } from "../constants";

export const WalletContext = createContext({
    setAppPage: (page: Page) => {}
})