import { useContext, useState } from "react"
import { WalletContext } from "../contexts/wallet"
import "../styles/wallethome.css"
import { Page } from "../constants";
import useRecords from "../hooks/transactions";
import { Records } from "../models/wallet";

function pretty_date(date: Date) {
    const formater = new Intl.DateTimeFormat("en-US")
    return formater.format(date)
}

function renderRow(record: Records) {
    return <tr key={record.id}>
        <td>{record.title}</td>
        <td>{pretty_date(record.datetime)}</td>
        <td>{record.amount}</td>
    </tr>
}

export default function WalletHome(props = {}) {
    const { setAppPage } = useContext(WalletContext);
    const { records } = useRecords();

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
                        {records.map(record => renderRow(record))}
                    </tbody>
                </table>
                : <>Not Transactions!</>
            }
        </div>
    </div>
}