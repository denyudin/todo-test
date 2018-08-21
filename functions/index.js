const admin = require('firebase-admin');
const functions = require('firebase-functions');
const pick = require('lodash').pick;
const cors = require('cors')({ origin: true });

// Load credentials
const serviceAccount = require("./test-project-d5bee-2e759682c29c.json");

// App init
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Get db instance
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

// Get collection instance
const todoCollection = db.collection('todos');

// Handle http methods
module.exports.todo = functions.https.onRequest(
    (request, response) =>
        cors(request, response, () => {
            switch ( request.method ) {
                case 'GET': {
                    return getTodo(request, response);
                }

                case 'POST': {
                    return createTodo(request, response);
                }

                case 'PATCH': {
                    return updateTodo(request, response);
                }

                case 'DELETE': {
                    return deleteTodo(request, response);
                }

                default: {
                    return response.status(500).send({
                        status: 'fatal_error',
                        message: 'Method not found.'
                    });
                }
            }
        })
);

// Get single todoItem or todoItems list
const getTodo = async (request, response) => {
    const { query: { id } } = request;

    // In case id was specified return single todoItem
    // Otherwise return all todos collection (without pagination)
    if ( id ) {
        const todoItem = await todoCollection.doc(id).get();
        if ( todoItem.exists ) {
            response.send({ status: 'success', item: todoItem.data() });
        } else {
            response.status(404).send({ status: 'error', message: 'Not Found.' });
        }
    } else {
        try {
            const todoItemsList = [];
            const result = await todoCollection.orderBy('created_at', 'desc').get();
            result.forEach(item => todoItemsList.push({ ...item.data(), id: item.id }));
            response.send({ status: 'success', items: todoItemsList });
        } catch ( error ) {
            response.status(500).send({ status: 'error', error });

        }
    }
};

// Create todoItem
const createTodo = async (request, response) => {
    // Extract (whitelist) params
    const { body: { subject } } = request;

    // Validate required field
    if ( !subject ) {
        return response.status(422).send({
            status: 'validation_error',
            message: 'Subject is required'
        });
    }

    // Add new todoItem
    try {
        const result = await todoCollection.add({
            subject,
            completed: false,
            created_at: Date.now()
        });
        const item = await todoCollection.doc(result.id).get();
        response.send({ status: 'success', item: { id: item.id, ...item.data() } });
    } catch ( error ) {
        response.status(500).send(error);
    }
};

// Update todoItem
const updateTodo = async (request, response) => {
    // Extract (whitelist) params
    const { query: { id }, body } = request;
    const data = pick(body, [ 'subject', 'completed' ]);

    if ( !id ) {
        return response.status(422).send({
            status: 'validation_error',
            message: 'ID is required.'
        });
    }

    // Update todoItem
    try {
        const todoItem = todoCollection.doc(id);
        await todoItem.update(data);
        response.send({ status: 'success', id });
    } catch ( error ) {
        response.status(500).send(error);
    }
};

// Delete todoItem
const deleteTodo = async (request, response) => {
    const { query: { id } } = request;

    // Validate required field
    if ( !id ) {
        return response.status(422).send({
            status: 'validation_error',
            message: 'ID is required.'
        });
    }

    // Remove todoItem
    try {
        await todoCollection.doc(id).delete();
        response.send({ status: 'success', id });
    } catch ( error ) {
        response.status(500).send(error);
    }
};
