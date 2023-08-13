import { tauri } from "@tauri-apps/api"
import { Task } from "../models/todo"
import { useEffect, useState } from "react"
import "../styles/task.css"

function TaskRow(param: {task: Task}) {
    const { task } = param
    let datetime = new Date(task.datetime)
    return <div className="row">
        <div>{task.title}</div>
        <div>{datetime.toLocaleDateString()}</div>
        <div>{task.amount}</div>
    </div>
}

export function Index() {
    const [tasks, setTasks] = useState<Array<Task>>([])

    useEffect(() => {
        tauri.invoke('get_transaction').then(response => {
            console.log(response)
            setTasks(response as Task[])
        })
    }, [])

    return <div className="container">
        {tasks ? tasks.map(task => <TaskRow task={task}/>) : <div>No Task!</div>}
    </div>
}