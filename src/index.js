const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

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

app.get('/users', (req, res) => {
    res.json(users);
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
    const newId = Date.now().toString();
    users[newId] = newUser;
    saveUsers(users);
    res.status(201).json(users[newId]);
});

app.put('/users/:id', (req, res) => {
    if (users[req.params.id]) {
        users[req.params.id] = req.body;
        saveUsers(users);
        res.json(users[req.params.id]);
    } else {
        res.status(404).send('User not found');
    }
});
app.delete('/users/:id', (req, res) => {
    if (users[req.params.id]) {
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
