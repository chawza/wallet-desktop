import { useContext, useState } from "react"
import "../styles/AddAccountStyles.css"
import { dialog, invoke } from "@tauri-apps/api"
import { WalletContext } from "../contexts/wallet"
import { Page } from "../constants"


export default function AddAccountPage() {
    const [name, setName] = useState('')
    const {setAppPage} = useContext(WalletContext)

    async function handleAddAccount() {
        const account = {id: undefined, name: name }
        invoke('add_account', { record: account })
            .then(async _ => {
                await dialog.message("Record has been added!")
                setAppPage(Page.ACCOUNTS_PAGE)
            })
            .catch(async err => await dialog.message(err))
    }

    return <div className="page">
        <form>
            <h2>Add Account</h2>
            <input type="text" placeholder="Name" onChange={e => setName(e.target.value)}/>
            <button onClick={e => {
                e.preventDefault()
                handleAddAccount()
            }}>Add Account</button>
        </form>
    </div>
}