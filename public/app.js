function getAllUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            data.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `ID: ${user.id}, Nombre: ${user.name}, Edad: ${user.age}`;
                usersList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

function createUser() {
    const name = document.getElementById('createName').value;
    const age = document.getElementById('createAge').value;
    fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('User created:', data);
            getAllUsers();
        })
        .catch(error => console.error('Error creating user:', error));
}

function updateUser() {
    const id = document.getElementById('updateId').value;
    const name = document.getElementById('updateName').value;
    const age = document.getElementById('updateAge').value;
    fetch(`/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('User updated:', data);
            getAllUsers();
        })
        .catch(error => console.error('Error updating user:', error));
}

function deleteUser() {
    const id = document.getElementById('deleteId').value;
    fetch(`/users/${id}`, {
        method: 'DELETE',
    })
        .then(() => {
            console.log('User deleted');
            getAllUsers();
        })
        .catch(error => console.error('Error deleting user:', error));
}

function getUser() {
    const id = document.getElementById('getId').value;
    fetch(`/users/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            const result = document.getElementById('getUserResult');
            result.textContent = `Nombre: ${data.name}, Edad: ${data.age}`;
        })
        .catch(error => {
            const result = document.getElementById('getUserResult');
            result.textContent = error.message;
        });
}
