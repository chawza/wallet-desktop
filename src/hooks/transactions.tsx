import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react"
import { Records } from "../models/wallet";

type RecordArrray = Array<Records>

export default function useRecords() {
    let [records, setRecords] = useState<Array<Records>>([]);

    async function fetchAllRecords() {
        const result = await invoke<RecordArrray>('get_transaction');
        setRecords(result)
    }

    useEffect(() => {
        fetchAllRecords()
    }, [])

    function setQuery() {}

    return {records, setQuery}
}