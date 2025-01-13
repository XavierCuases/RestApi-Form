function getAllUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = ''; 
            Object.keys(data).forEach(key => {
                const user = data[key];
                const li = document.createElement('li');
                li.textContent = `ID: ${key}, Nombre: ${user.name}, Edad: ${user.age}`;
                usersList.appendChild(li);
            });
        });
}


function createUser() {
    const name = document.getElementById('createName').value;
    const age = document.getElementById('createAge').value;
    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age })
    }).then(response => response.json())
      .then(data => {
          console.log(data);
          getAllUsers(); 
      });
}

function updateUser() {
    const id = document.getElementById('updateId').value;
    const name = document.getElementById('updateName').value;
    const age = document.getElementById('updateAge').value;
    fetch(`/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age })
    }).then(response => response.json())
      .then(data => {
          console.log(data);
          getAllUsers(); 
      });
}

function deleteUser() {
    const id = document.getElementById('deleteId').value;
    fetch(`/users/${id}`, {
        method: 'DELETE'
    }).then(() => {
        getAllUsers();
    });
}

function getUser() {
    const id = document.getElementById('getId').value;
    fetch(`/users/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontró el usuario');
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

