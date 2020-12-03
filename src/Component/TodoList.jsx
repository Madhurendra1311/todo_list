import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from "./app.module.css";


export default function Todolist() {
    const history = useHistory()
    const [taskList, setTaskList] = useState([])
    const [taskName, setTaskName] = useState('')
    const [subTaskName, setSubTaskName] = useState('')
    const [activeTaskIdEdit, setActiveTaskIdEdit] = useState(null)
    const [activeTaskIdSubtask, setActiveTaskIdSubtask] = useState(null)
    const [activeSubtaskIdEdit, setActiveSubtaskIdEdit] = useState(null)
    const [todoCount, setTodoCount] = useState(0)
    const [completedCount, setCompletedCount] = useState(0)

    useEffect(() => {
        if(!window.localStorage.getItem("token")){
            history.push("/")
        }
    }, [])

    const handleTaskName = (e) => {
        setTaskName(e.target.value)
    }

    const handleAddTaskSubmit = () => {
        if (taskName.length > 0) {
            let taskObj = {}
            taskObj['id'] = new Date().getTime()
            taskObj['name'] = taskName
            taskObj['subtask'] = []
            setTaskList([...taskList, taskObj])
            setTaskName('')
        }
    }

    const handleEditTask = (id) => {
        let filteredName = taskList.filter(item => item.id === id)[0].name
        setActiveTaskIdEdit(id)
        setTaskName(filteredName)
    }

    const handleEditTaskSubmit = () => {
        let task = taskList.find(item => item.id === activeTaskIdEdit)
        task.name = taskName
        setTaskName('')
        setActiveTaskIdEdit(null)
    }

    const handleDeleteTask = (id) => {
        let filteredTask = taskList.filter(item => item.id !== id)
        let deletedTask = taskList.filter(item => item.id === id)[0].subtask
        for(let i = 0; i < deletedTask.length; i++){
            if(deletedTask[i].isCompleted){
                setCompletedCount((completedCount) => completedCount - 1)
            }
            else{
                setTodoCount((todoCount) => todoCount - 1)
            }
        }
        setTaskList(filteredTask)
    }

    const handleSubTaskFlag = (id) => {
        setActiveTaskIdSubtask(id)
    }

    const handleSubtaskName = (e) => {
        setSubTaskName(e.target.value)
    }

    const handleAddSubtask = (e) => {
        e.preventDefault()
        let task = taskList.find(item => item.id === activeTaskIdSubtask)
        let subTaskObj = {}
        subTaskObj['id'] = new Date().getTime()
        subTaskObj['name'] = subTaskName
        subTaskObj['isCompleted'] = false
        task.subtask = [...task.subtask, subTaskObj]
        setTodoCount((todoCount) => todoCount + 1)
        setSubTaskName('')
    }

    const handleSubtaskEdit = (subtaskId, taskId) => {
        let subtask = taskList.filter(itemTask => itemTask.id === taskId)[0]?.subtask.filter(itemSubtask => itemSubtask.id === subtaskId)[0]
        console.log(subtask);
        setSubTaskName(subtask.name)
        setActiveSubtaskIdEdit(subtaskId)
        setActiveTaskIdSubtask(taskId)
    }

    const handleEditSubtask = (e) => {
        e.preventDefault()
        let filterdSubtask = taskList.find(itemTask => itemTask.id === activeTaskIdSubtask)?.subtask.find(itemSubtask => itemSubtask.id === activeSubtaskIdEdit)
        console.log(filterdSubtask, activeTaskIdSubtask, activeSubtaskIdEdit);
        filterdSubtask.name = subTaskName
        setSubTaskName('')
        setActiveSubtaskIdEdit(null)
        setActiveTaskIdSubtask(null)
    }

    const handleSubtaskDelete = (subtaskId, taskId) => {
        let tempTaskList = [...taskList]
        let filterdTaskIndex = tempTaskList.findIndex(itemTask => itemTask.id === taskId)
        let filterdTask = tempTaskList.filter(itemTask => itemTask.id === taskId)[0]
        let filteredSubtask = filterdTask.subtask?.filter(itemSubtask => itemSubtask.id !== subtaskId)
        tempTaskList.splice(filterdTaskIndex, 1)
        filterdTask.subtask = filteredSubtask
        tempTaskList.splice(filterdTaskIndex, 0, filterdTask)
        if (todoCount > 0) {
            setTodoCount((todoCount) => todoCount - 1)
        }
        setTaskList(tempTaskList)
    }

    const handleSubtaskMark = (subtaskId, taskId) => {
        let tempTaskList = [...taskList]
        let filterdTask = tempTaskList.find(itemTask => itemTask.id === taskId)
        let filterdSubtask = filterdTask.subtask?.find(itemSubtask => itemSubtask.id === subtaskId)
        filterdSubtask.isCompleted = !filterdSubtask.isCompleted
        if (filterdSubtask.isCompleted) {
            setTodoCount((todoCount) => todoCount - 1)
            setCompletedCount((completedCount) => completedCount + 1)
        }
        else {
            setTodoCount((todoCount) => todoCount + 1)
            setCompletedCount((completedCount) => completedCount - 1)
        }
        setTaskList(tempTaskList)
    }

    console.log(todoCount, completedCount);

    return (
        <>
        <div style={{background:'black', width:'100%', height:'100vh', paddingTop:'3%'}}>

      
        <div style={{margin:'auto', border:'1px solid black', height:'45vh', width:'35%', textAlign:'center',padding:'40px 20px', borderRadius:'15px',background:'#FF9100', color:'black'}}>
        <h1>Todos</h1>
        <div style={{display:"flex",width: "35px", height:"35px", paddingLeft:"100px"}}>
            <input type="text" onChange={handleTaskName} value={taskName} placeholder="Add todo...."  />
            
            {
                activeTaskIdEdit === null ?
                    <div >
                        <button className={styles.button} onClick={handleAddTaskSubmit}>Add Todo</button>
                    </div>
                    :
                    <div>
                        <button className={styles.button} onClick={handleEditTaskSubmit}>Edit Todo</button>
                    </div>
            }
</div>
            {
                taskList?.map(task => {
                    return (
                        <div key={task.id}>
                            <div style={{height: "70px", width: "170px", paddingBottom: "30px", background:'white', marginLeft:'160px', borderRadius:'5px'}}> <br/>
                                <p style={{textAlign:'left',paddingLeft:'5px'}}>{task.name} <EditIcon style={{marginLeft:'58px',paddingTop:'5px'}} onClick={() => handleEditTask(task.id)}/> <DeleteIcon onClick={() => handleDeleteTask(task.id)}/></p>
                            </div>
                            
                            <button style={{width: "100px", height:"30px"}} className={styles.button} onClick={() => handleSubTaskFlag(task.id)}>Add Sub Task</button>
                            {
                                activeTaskIdSubtask === task.id ?
                                    <div>
                                        {
                                            activeSubtaskIdEdit === null ?
                                                <form onSubmit={handleAddSubtask}>
                                                    <input type="text" onChange={handleSubtaskName} value={subTaskName} />
                                                </form>
                                                :
                                                <form onSubmit={handleEditSubtask}>
                                                    <input type="text" onChange={handleSubtaskName} value={subTaskName} />
                                                </form>
                                        }
                                    </div>
                                    :
                                    null
                            }
                            {
                                task.subtask?.map(_subtask => {
                                    if (_subtask.isCompleted) {
                                        return (
                                            <div key={_subtask.id}>
                                                <h4>{_subtask.name}</h4>
                                                <button onClick={() => handleSubtaskEdit(_subtask.id, task.id)}>Edit</button>
                                                <button onClick={() => handleSubtaskDelete(_subtask.id, task.id)}>Delete</button>
                                                <button onClick={() => handleSubtaskMark(_subtask.id, task.id)}>Mark as Incomplete</button>
                                            </div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div key={_subtask.id}>
                                                <h4>{_subtask.name}</h4>
                                                <button onClick={() => handleSubtaskEdit(_subtask.id, task.id)}>Edit</button>
                                                <button onClick={() => handleSubtaskDelete(_subtask.id, task.id)}>Delete</button>
                                                <button onClick={() => handleSubtaskMark(_subtask.id, task.id)}>Mark as Complete</button>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
        </div>
        </>
    )
}