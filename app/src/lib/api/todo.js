import axios from 'axios';

const API_URL = 'https://us-central1-test-project-d5bee.cloudfunctions.net/todo';

const extract = async (requestPromise) => {
    try {
        const response = await requestPromise;
        return response.data;
    } catch ( error ) {
        throw error;
    }
};

export const fetchTodosList = () => {
    return extract(axios.get(API_URL + '/todo'));
};

export const fetchTodoById = (id) => {
    return extract(axios.get(API_URL + '/todo/?id=' + id));
};

export const createTodo = (subject) => {
    return extract(axios.post(API_URL + '/todo', { subject }));
};

export const updateTodo = (id, todo) => {
    return extract(axios.patch(API_URL + '/todo?id=' + id, todo));
};

export const deleteTodo = (id) => {
    return extract(axios.delete(API_URL + '/todo?id=' + id));
};
