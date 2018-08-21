import React from 'react';

import { Checkbox, Button, Row, Col } from 'antd';

const TodoItem = (props) => {
    return (
        <Row style={ { marginBottom: 10 } }>
            <Col span={ 23 }>
                <Checkbox
                    checked={ props.item.completed }
                    onChange={ () => props.toggleCompleted(props.item) }>
                    { props.item.subject }
                </Checkbox>
            </Col>
            <Col span={ 1 }>
                <Button
                    style={ { border: 'none', right: 0 } }
                    type={ 'dashed' }
                    shape={ 'circle' }
                    icon={ 'close' }
                    size={ "small" }
                    onClick={ () => props.removeTodo(props.item.id) }
                />
            </Col>
        </Row>
    );
};

export default TodoItem;