import { useEffect, useState } from "react";
import { Page } from "./constants";
import WalletHome from "./pages/wallethome";
import { WalletContext } from "./contexts/wallet";
import AddRecordPage from "./pages/addrecord";

import './App.css'

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
    throw Error(`Not Implementm page ${page}`)
  }

  return (
    <WalletContext.Provider value={{setAppPage}}>
      <div className="app-container">
        <div className="nav">
          <h1 onClick={() => setAppPage(Page.WALLET_HOME)}>Wallet</h1>
          <h2>User</h2>
        </div>
        {page && render_page()}
      </div>
    </WalletContext.Provider>
  );
}

export default App;
