const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const usersFilePath = path.join(__dirname, '../data/users.json');


function loadUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to load users:', error);
        return {};
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to save users:', error);
    }
}

let users = loadUsers();
let currentId = Object.keys(users).reduce((maxId, id) => Math.max(maxId, parseInt(id, 10)), 0);

app.get('/users', (req, res) => {
    res.json(Object.values(users));  
});

app.get('/users/:id', (req, res) => {
    const user = users[req.params.id];
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    const newId = ++currentId;  
    users[newId] = newUser;
    saveUsers(users);
    res.status(201).json({id: newId, ...newUser});
});

app.put('/users/:id', (req, res) => {
    if (users.hasOwnProperty(req.params.id)) {
        users[req.params.id] = req.body;
        saveUsers(users);
        res.json(users[req.params.id]);
    } else {
        res.status(404).send('User not found');
    }
});

app.delete('/users/:id', (req, res) => {
    if (users.hasOwnProperty(req.params.id)) {
        delete users[req.params.id];
        saveUsers(users);
        res.status(204).send();
    } else {
        res.status(404).send('User not found');
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Users APIRest!');
});

app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});
