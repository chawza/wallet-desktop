import { dialog, invoke } from "@tauri-apps/api";
import { useContext, useState } from "react"
import { WalletContext } from "../contexts/wallet";
import { Page } from "../constants";

export default function AddRecordPage() {
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState(new Date(Date.now()));

    const {setAppPage} = useContext(WalletContext);

    function add_transaction() {
        const transaction = {id: undefined, title: note, amount, datetime: date.getTime()}
        invoke('add_transaction', transaction)
            .then(async _ => {
                await dialog.message("Record has been added!")
                setAppPage(Page.WALLET_HOME)
            })
            .catch(async err => await dialog.message(err))
    }
    return <div className="container">
        <input id="note" type="text" onChange={event => setNote(event.target.value)}/>
        <input id="amount" type="number" onChange={event => setAmount(event.target.valueAsNumber)} />
        <input id="date" type="date" onChange={event => setDate(event.target.valueAsDate!!)}/>
        <button onClick={add_transaction}>Add Transaction</button>
    </div>
}