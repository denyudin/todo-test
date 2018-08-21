import React from 'react';
import { Input } from 'antd';

class TodoForm extends React.Component {
    state = {
        search: ''
    };

    addTodo = (subject) => {
        this.props.addTodo(subject);
        this.setState({ search: '' });
    };

    render() {
        return (
            <Input.Search
                value={ this.state.search }
                placeholder={ 'Add todo' }
                enterButton={ 'Add' }
                size={ 'large' }
                onChange={ (event) => this.setState({ search: event.target.value }) }
                onSearch={ this.addTodo }
                onPressEnter={ (event) => this.addTodo(event.target.value) }
            />
        );
    }
}

export default TodoForm;