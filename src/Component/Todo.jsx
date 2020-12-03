import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
      justifyContent: "center"
    },
  },
}));

export default function Todolist() {
    const classes = useStyles();
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
    <form className={classes.root} noValidate autoComplete="off">
      <FormControl variant="outlined">
        <InputLabel htmlFor="component-outlined">Add Todo</InputLabel>
        <OutlinedInput id="component-outlined" value={taskName} onChange={handleTaskName} label="Name" />
        {
                activeTaskIdEdit === null ?
                    <div>
                        <Button variant="contained" color="secondary" onClick={handleAddTaskSubmit}>Add Todo</Button>
                    </div>
                    :
                    <div>
                        <button onClick={handleEditTaskSubmit}>Edit Todo</button>
                    </div>
        }
        {
                taskList?.map(task => {
                    return (
                        <div key={task.id}>
                            <h2>{task.name}</h2>
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                            <button onClick={() => handleEditTask(task.id)}>Edit</button>
                            <button onClick={() => handleSubTaskFlag(task.id)}>Add Sub Task</button>
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
      </FormControl>
    </form>
  );
}