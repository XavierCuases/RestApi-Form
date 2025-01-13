const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
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
        throw error;
    }
}

let users = loadUsers();


app.get('/users', (req, res) => {
    const usersWithIds = Object.keys(users).map(id => ({
        id,
        ...users[id],
    }));
    res.json(usersWithIds);
});


app.get('/users/:id', (req, res) => {
    const user = users[req.params.id];
    if (user) {
        res.json({ id: req.params.id, ...user });
    } else {
        res.status(404).send('User not found');
    }
});


app.post('/users', (req, res) => {
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).send('Name and age are required');
    }
    const newId = Date.now().toString();
    users[newId] = { name, age };
    try {
        saveUsers(users);
        res.status(201).json({ id: newId, ...users[newId] });
    } catch (error) {
        res.status(500).send('Error saving user');
    }
});


app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).send('Name and age are required');
    }
    if (users.hasOwnProperty(id)) {
        users[id] = { name, age };
        try {
            saveUsers(users);
            res.json({ id, ...users[id] });
        } catch (error) {
            res.status(500).send('Error updating user');
        }
    } else {
        res.status(404).send('User not found');
    }
});


app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    if (users.hasOwnProperty(id)) {
        delete users[id];
        try {
            saveUsers(users);
            res.status(204).send();
        } catch (error) {
            res.status(500).send('Error deleting user');
        }
    } else {
        res.status(404).send('User not found');
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the Users API!');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
