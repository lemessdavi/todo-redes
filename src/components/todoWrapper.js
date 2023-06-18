import React, { useEffect, useState } from "react";
import { TodoForm } from "./todoForm";
import { v4 as uuidv4 } from 'uuid';
import { Todo } from "./todo";
import { EditTodoForm } from "./editTodoForm";
import axios from "axios";
uuidv4();

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/getTasks');
            setTodos(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const addTodo = async todo => {
        
        // codigo antigo
        setTodos([...todos, {id: uuidv4(), task: todo,
        completed: false, isEditing: false}]);
        console.log(todos);
        
        try {
            const response = await axios.post(`http://localhost:5001/api/addTask/${todo}`);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        
    }

    const toggleComplete = async (id, todo) => {
        //codigo antigo
        setTodos(todos.map(todo => todo.id === id ? {
            ...todo, completed: !todo.completed}
            :
            todo
        ));
        
        try {
            const response = await axios.post(`http://localhost:5001/api/checkTask/${id}/${todo.completed}`);
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    }

    const deleteTodo = async id => {
        // codigo antigo
        setTodos(todos.filter(todo => todo.id !== id ))
        try {
            const response = await axios.delete(`http://localhost:5001/api/deleteTask/${id}/1`);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const editTodo = id => {
        setTodos(todos.map(todo => todo.id === id ? 
            {...todo, isEditing: !todo.isEditing} 
            :
            todo
        ))
    }

    const editTask = (task, id) => {
        setTodos(todos.map(todo => todo.id === id ? {
            ...todo, task, isEditing: !todo.isEditing}
            :
            todo
        ))
    }

    return (
        <div className="TodoWrapper">
            <h1>Tarefas</h1>
            <TodoForm addTodo={addTodo} />
            {todos.map((todo, index) => (
                todo.isEditing ? (
                    <EditTodoForm 
                        editTodo={editTask}
                        task={todo}
                    />
                ) : (
                <Todo task={todo} key={index} 
                    toggleComplete={toggleComplete}
                    deleteTodo={deleteTodo}
                    editTodo={editTodo}
                />
                )
            ))}
        </div>
    )
}