const express = require('express');
const app = express();
app.use(express.json());


loadUsers();

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    const newId = Date.now().toString();
    users[newId] = newUser;
    saveUsers();  
    res.status(201).json(users[newId]);
});

app.put('/users/:id', (req, res) => {
    if (users[req.params.id]) {
        users[req.params.id] = req.body;
        saveUsers(); 
        res.json(users[req.params.id]);
    } else {
        res.status(404).send('User not found');
    }
});

app.delete('/users/:id', (req, res) => {
    if (users[req.params.id]) {
        delete users[req.params.id];
        saveUsers();  
        res.status(204).send();
    } else {
        res.status(404).send('User not found');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
