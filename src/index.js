const express = require('express');
const app = express();
app.use(express.json()); 

let users = {
    1: { name: "Alice", age: 25 },
    2: { name: "Bob", age: 30 }
};

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
    res.status(201).json(users[newId]);
});


app.put('/users/:id', (req, res) => {
    if (!users[req.params.id]) {
        return res.status(404).send('User not found');
    }
    users[req.params.id] = req.body;
    res.json(users[req.params.id]);
});

app.delete('/users/:id', (req, res) => {
    if (!users[req.params.id]) {
        return res.status(404).send('User not found');
    }
    delete users[req.params.id];
    res.status(204).send();
});



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
