import { useState } from "react";
import { Page } from "./constants";
import WalletHome from "./pages/HomePage";
import { WalletContext } from "./contexts/wallet";
import AddRecordPage from "./pages/AddRecordPage";
import AccountPage from "./pages/AccountPage";

import './App.css'
import AddAccountPage from "./pages/AddAccountPage";

function App() {
  let [page, setPage] = useState(Page.WALLET_HOME);

  function setAppPage(page: Page) {
    if (!Object.keys(Page).includes(page.toString())) {
      throw Error(`Unrecognized map ${page}`)
    }
    setPage(page)
  }

  function render_page() {
    if (page == Page.WALLET_HOME) {
      return <WalletHome />
    }
    else if (page == Page.ADD_RECORD) {
      return <AddRecordPage />
    }
    else if (page == Page.ACCOUNTS_PAGE) {
      return <AccountPage/>
    }
    else if (page == Page.ADD_ACCOUNT) {
      return <AddAccountPage/>
    }
    throw Error(`Not Implemented Page page ${page}`)
  }

  return (
    <WalletContext.Provider value={{setAppPage}}>
      <div className="app-container">
        <div className="nav">
          <nav>
            <h1 onClick={() => setAppPage(Page.WALLET_HOME)}>Wallet</h1>
            <h1 onClick={() => setAppPage(Page.ACCOUNTS_PAGE)}>Accounts</h1>
          </nav>
          <h2>User</h2>
        </div>
        {page && render_page()}
      </div>
    </WalletContext.Provider>
  );
}

export default App;
