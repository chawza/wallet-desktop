import { useEffect, useState } from "react"
import { Account } from "../models/wallet"
import { invoke } from "@tauri-apps/api"

type AccountArray = Array<Account>

export default function useAccounts() {
    const [accounts, setAccounts] = useState<AccountArray>([])

    async function fetchAccounts() {
        try {
            const fetchedAccounts = await invoke<AccountArray>('get_all_accounts');
            setAccounts(fetchedAccounts)
        }
        catch {
            console.error("Falied to query accounts") 
        }
    }

    useEffect(() => {
        fetchAccounts()
    }, [])

    return {accounts, refresh: fetchAccounts}
}