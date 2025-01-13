const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const usersFilePath = path.join(__dirname, 'data', 'users.json');

let users = {};
function loadUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Failed to load users:', error);
        users = {}; // 
    }
}

function saveUsers() {
    try {
        const data = JSON.stringify(users, null, 2); 
        fs.writeFileSync(usersFilePath, data);
    } catch (error) {
        console.error('Failed to save users:', error);
    }
}

loadUsers();

app.get('/', (req, res) => {
    res.send('Welcome to the Users API!');
});


app.get('/users', (req, res) => {
    res.json(users);
});


app.get('/users/:id', (req, res) => {
    const user = users[req.params.id];
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json(user);
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    const newId = Date.now().toString();  
    users[newId] = newUser;
    saveUsers(); 
    res.status(201).json(users[newId]);
});

app.put('/users/:id', (req, res) => {
    if (!users[req.params.id]) {
        return res.status(404).send('User not found');
    }
    users[req.params.id] = req.body;
    saveUsers(); // 
    res.json(users[req.params.id]);
});

app.delete('/users/:id', (req, res) => {
    if (!users[req.params.id]) {
        return res.status(404).send('User not found');
    }
    delete users[req.params.id];
    saveUsers(); 
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
