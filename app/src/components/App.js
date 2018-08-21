import React, { Component } from 'react';
import * as todoApi from '../lib/api/todo';
import { Row, Col, Divider } from 'antd';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

class App extends Component {
    state = {
        todos: []
    };

    addTodo = async (subject) => {
        const data = await todoApi.createTodo(subject);
        this.setState((state) => ({
            ...state,
            todos: [ data.item, ...state.todos ]
        }));
    };

    removeTodo = async (id) => {
        this.setState(state => ({
            todos: state.todos.filter(item => item.id !== id)
        }));

        await todoApi.deleteTodo(id);
    };

    fetchTodos = async () => {
        const todos = await todoApi.fetchTodosList();
        this.setState({ todos: todos.items });
    };

    toggleCompleted = async (item) => {
        this.setState(state => ({
            ...state,
            todos: state.todos.map(todo => item.id !== todo.id ? todo : { ...todo, completed: !todo.completed })
        }));
        todoApi.updateTodo(item.id, { completed: !item.completed });
    };

    componentDidMount() {
        this.fetchTodos();
    };

    render() {
        return (
            <Row style={{paddingTop: 20}}>
                <Col offset={ 4 } span={ 18 }>
                    <TodoForm addTodo={ this.addTodo }/>
                    <Divider/>
                    { this.state.todos && this.state.todos.map(item =>
                        <TodoItem
                            key={ item.id }
                            item={ item }
                            toggleCompleted={ this.toggleCompleted }
                            removeTodo={ this.removeTodo }
                        />) }
                </Col>
            </Row>
        );
    }
}

export default App;
