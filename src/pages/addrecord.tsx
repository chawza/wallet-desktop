import { invoke } from "@tauri-apps/api";
import { useState } from "react"
import { Transaction } from "../models/wallet";

export default function AddRecordPage() {
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState(new Date(Date.now()));

    function add_transaction() {
        const transaction = {id: undefined, title: note, amount, datetime: date.getTime()}
        invoke('add_transaction', transaction)
            .then(tran => console.log("hasabeen added!", tran))
            .catch(() => console.error("add faield"))
    }
    return <div className="container">
        <input id="note" type="text" onChange={event => setNote(event.target.value)}/>
        <input id="amount" type="number" onChange={event => setAmount(event.target.valueAsNumber)} />
        <input id="date" type="date" onChange={event => setDate(event.target.valueAsDate!!)}/>
        <button onClick={add_transaction}>Add Transaction</button>
    </div>
}