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
            const jsonArray = response.data;
            const mappedTodos = jsonArray.map(([id, task, completed, isDeleted]) => {
                return {
                    id,
                    task,
                    completed,
                    isDeleted
                };
            });
    
            setTodos(mappedTodos);
            console.log(mappedTodos);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
    
    

    const addTodo = async todo => {
        console.log(todo);
        try {
            const response = await axios.post(`http://localhost:5001/api/addTask/${todo}`);
            setTodos([...todos, {id: response.data, task: todo,
                completed: false, isDeleted: false}]);
            console.log(todos);
        } catch (error) {
            console.log(error);
        }
        
    }

    const toggleComplete = async (id, todo) => {
        try {
            if(todo.completed){
                todo.completed = 1;
            }else{
                todo.completed =0;
            }
            
            const response = await axios.post(`http://localhost:5001/api/checkTask/${id}/${todo.completed}`);
            console.log(response);
            setTodos(todos.map(todo => todo.id === id ? {
                ...todo, completed: !todo.completed}
                :
                todo
            ));
        } catch (error) {
            console.log(error);
        }

    }

    const deleteTodo = async id => {
        // codigo antigo
        setTodos(todos.filter(todo => todo.id !== id ))
        try {
            const response = await axios.post(`http://localhost:5001/api/deleteTask/${id}/1`);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    // const editTodo = id => {
    //     setTodos(todos.map(todo => todo.id === id ? 
    //         {...todo, isEditing: !todo.isEditing} 
    //         :
    //         todo
    //     ))
    // }

    // const editTask = (task, id) => {
    //     setTodos(todos.map(todo => todo.id === id ? {
    //         ...todo, task, isEditing: !todo.isEditing}
    //         :
    //         todo
    //     ))
    // }

    return (
        <div className="TodoWrapper">
            <h1>Tarefas</h1>
            <TodoForm addTodo={addTodo} />
            {todos.map((todo, index) => {
                if (!todo.isDeleted) {
                    return (
                    <Todo
                        task={todo}
                        key={index}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                    />
                    );
                }
                return null; // Ignora o todo se o isDeleted for true
                })}
        </div>
    )
}