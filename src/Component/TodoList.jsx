import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from "./app.module.css";
import ProgressChart from "./ProgressChart"
import { Container, Row, Col, Nav, Navbar, FormControl, InputGroup, Button } from "react-bootstrap"


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
        if (!window.localStorage.getItem("token")) {
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
        for (let i = 0; i < deletedTask.length; i++) {
            if (deletedTask[i].isCompleted) {
                setCompletedCount((completedCount) => completedCount - 1)
            }
            else {
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
    const handleRemoveToken = () => {
        if (!window.localStorage.removeItem("token")) {
            history.push("/")
        }
    }

    let chartDatasets = [
        {
            data: [
                todoCount,
                completedCount
            ],
            backgroundColor: [
                '#FDBF00',
                '#FA4570',
            ]
        }
    ]

    console.log(todoCount, completedCount);

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Todos</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link onClick={handleRemoveToken} >Logout</Nav.Link>
                </Nav>
            </Navbar>
            <Container fluid>
                <Row>
                    <Col style={{ margin: "auto" }} lg={6}>
                        <div >
                            <div >
                                <div>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            type="text" onChange={handleTaskName} value={taskName} placeholder="Add todo...."
                                            aria-label="Recipient's username"
                                            aria-describedby="basic-addon2"
                                        />
                                        <InputGroup.Append>
                                            {
                                                activeTaskIdEdit === null ?
                                                    <Button variant="outline-secondary" onClick={handleAddTaskSubmit}>Add Todo</Button>
                                                    :
                                                    <Button variant="outline-secondary" onClick={handleEditTaskSubmit}>Edit Todo</Button>
                                            }
                                        </InputGroup.Append>
                                    </InputGroup>
                                </div>
                                {
                                    taskList?.map(task => {
                                        return (
                                            <div key={task.id}>
                                                <div style={{ background: "#C0C0C0" }}>
                                                    <p >{task.name} <EditIcon style={{ marginLeft: "400px" }} onClick={() => handleEditTask(task.id)} />
                                                        <DeleteIcon onClick={() => handleDeleteTask(task.id)} />
                                                        <button className={styles.button} onClick={() => handleSubTaskFlag(task.id)}>Add Sub Task</button>
                                                    </p>
                                                </div>

                                                <div><br />
                                                    {
                                                        activeTaskIdSubtask === task.id ?
                                                            <div >
                                                                {
                                                                    activeSubtaskIdEdit === null ?
                                                                        <form onSubmit={handleAddSubtask}>
                                                                            <input type="text" onChange={handleSubtaskName} value={subTaskName} placeholder="Add subtask...." style={{ width: "620px" }} />
                                                                        </form>
                                                                        :
                                                                        <form onSubmit={handleEditSubtask}>
                                                                            <input type="text" onChange={handleSubtaskName} value={subTaskName} placeholder="Add subtask...." style={{ width: "620px" }} />
                                                                        </form>
                                                                }
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    <div ><br />
                                                        {
                                                            task.subtask?.map(_subtask => {
                                                                if (_subtask.isCompleted) {
                                                                    return (
                                                                        <div key={_subtask.id}>
                                                                            <div style={{ background: "grey", color: "white" }}>
                                                                                <p>{_subtask.name}</p>
                                                                            </div>
                                                                            <div>
                                                                                <button className={styles.button1} onClick={() => handleSubtaskEdit(_subtask.id, task.id)}>Edit</button>
                                                                                <button className={styles.button3} onClick={() => handleSubtaskDelete(_subtask.id, task.id)}>Delete</button>
                                                                                <button className={styles.button2} onClick={() => handleSubtaskMark(_subtask.id, task.id)}>Mark as Incomplete</button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                else {
                                                                    return (
                                                                        <div key={_subtask.id}>
                                                                            <div style={{ background: "grey", color: "white" }}>
                                                                                <p>{_subtask.name}</p>
                                                                            </div>
                                                                            <div>
                                                                                <button className={styles.button1} onClick={() => handleSubtaskEdit(_subtask.id, task.id)}>Edit</button>
                                                                                <button className={styles.button3} onClick={() => handleSubtaskDelete(_subtask.id, task.id)}>Delete</button>
                                                                                <button className={styles.button2} onClick={() => handleSubtaskMark(_subtask.id, task.id)}>Mark as Complete</button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        {
                            <div className="">
                                <ProgressChart todo={todoCount} completed={completedCount} />
                            </div>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}