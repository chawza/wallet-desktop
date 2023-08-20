import { Account } from "../models/wallet"
import useAccounts from "../hooks/accounts"
import { WalletContext } from "../contexts/wallet"
import { useContext } from "react"
import { Page } from "../constants"
import "../styles/AccountsStyles.css"
import { dialog, invoke } from "@tauri-apps/api"

type AccountRowProps = {
    account: Account,
    refresh: Function
}

function AccountRow(props: AccountRowProps) {
    const { account, refresh } = props
    function handleDeleteAccount() {
        invoke('delete_account_by_id', {id: account.id})
            .then(() => {
                dialog.message("Account Deleted!") 
                refresh()
            })
            .catch(msg => {
                dialog.message(msg)
            })
    }
    return <div key={account.id} className="row">
        <div className="name">{account.name}</div>
        <button onClick={() => handleDeleteAccount()}>delete</button>
    </div>
}

export default function AccountPage() {
    const { accounts, refresh } = useAccounts()
    const { setAppPage } = useContext(WalletContext)

    return <div className="page">
        <div className="actions">
            <button onClick={() => setAppPage(Page.ADD_ACCOUNT)}>Add Account</button>
        </div>
        <div className="account-list">
            {accounts
                ? accounts.map(account => <AccountRow account={account} refresh={refresh}/>)
                : <div>No Accounts!</div> 
            }
        </div>

    </div>
}