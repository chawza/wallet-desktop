import { dialog, invoke } from "@tauri-apps/api";
import { useContext, useState } from "react"
import { WalletContext } from "../contexts/wallet";
import { Page } from "../constants";
import "../styles/AddRecord.css";

enum FormType {
    TRANSACTION,
    TRANSFER,
}

export default function AddRecordPage() {
    const {setAppPage} = useContext(WalletContext);
    const [form, setForm] = useState(FormType.TRANSACTION)

    function redirectToHome() {
        setAppPage(Page.WALLET_HOME)
    }

    function AddTransactionForm() {
        const [note, setNote] = useState('');
        const [amount, setAmount] = useState(0);
        const [date, setDate] = useState(new Date(Date.now()));

        async function handleAddTransaction() {
            const transaction = {id: undefined, title: note, amount, datetime: date.getTime()}
            invoke('add_transaction', transaction)
                .then(async _ => {
                    await dialog.message("Record has been added!")
                    redirectToHome()
                })
                .catch(async err => await dialog.message(err))
        }

        return <form>
            <input id="note" type="text" onChange={event => setNote(event.target.value)}/>
            <input id="amount" type="number" onChange={event => setAmount(event.target.valueAsNumber)} />
            <input id="date" type="date" onChange={event => setDate(event.target.valueAsDate!!)}/>
            <button onClick={handleAddTransaction}>Add Transaction</button>
        </form>
    }

    function AddTransferForm() {

        const [note, setNote] = useState('')
        const [amount, setAmount] = useState(0)
        const [date, setDate] = useState(new Date(Date.now()))

        function handleAddTransfer() {

        }

        return <form>
            <input id="note" type="text" onChange={event => setNote(event.target.value)}/>
            <input id="amount" type="number" onChange={event => setAmount(event.target.valueAsNumber)} />
            <input id="date" type="date" onChange={event => setDate(event.target.valueAsDate!!)}/>
            <input id="account-source" type="select"/>
            <input id="account-target" type="select"/>
            <button onClick={handleAddTransfer}>Add Transaction</button>
        </form>
    }

    return <div className="page">
        <div>
            <button onClick={() => setForm(FormType.TRANSACTION)}>Tranasction</button>
            <button onClick={() => setForm(FormType.TRANSFER)}>Transfer</button>
        </div>
        {
            form == FormType.TRANSACTION
            ? <AddTransactionForm/>
            : <AddTransferForm/> 
        }
    </div>
}