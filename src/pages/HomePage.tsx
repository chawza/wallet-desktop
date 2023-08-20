import { useContext } from "react"
import { WalletContext } from "../contexts/wallet"
import "../styles/HomeStyles.css"
import { Page } from "../constants";
import useRecords from "../hooks/transactions";
import { Records } from "../models/wallet";
import { dialog, invoke } from "@tauri-apps/api";

function pretty_date(date: Date) {
    const formater = new Intl.DateTimeFormat("en-US")
    return formater.format(date)
}

type RowParam = {
    record: Records,
    handleDelete: (id: number) => void 
}

function Row(props: RowParam) {
    const { record, handleDelete } = props

    return <tr className="record-row" key={record.id}>
        <td>
            <div>
            <button className="del" onClick={() => handleDelete(record.id!!)}>del</button>
            {record.title}
            </div>
        </td>
        <td>{pretty_date(record.datetime)}</td>
        <td>{record.amount}</td>
    </tr>
}

export default function WalletHome(props = {}) {
    const { setAppPage } = useContext(WalletContext);
    const { records, refresh } = useRecords();


    async function handleDelete(id: number) {
        const record = records.find(value => value.id == id);
        if (record == undefined) {
            dialog.message("Invalid record id")
            return
        }

        if (await dialog.confirm(`Delete record "${record.title}"`)) {
            invoke('delete_transaction', {id: record.id})
                .then(async () => {
                    await dialog.message("Record Deleted!")
                    refresh()
                })
                .catch(async (msg) => await dialog.message(msg))
        }
    }

    return <div className="container">
        <div className="menu">
            <button onClick={() => setAppPage(Page.ADD_RECORD)}>Add</button>
        </div>
        <div className="records">
            {records.length > 0
                ? <table className="record-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(record => <Row record={record} handleDelete={handleDelete} />)}
                    </tbody>
                </table>
                : <>Not Transactions!</>
            }
        </div>
    </div>
}