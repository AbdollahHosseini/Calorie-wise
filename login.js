// login.js

// Simulated user data (in real applications, this would be fetched from a server or a file)

const form = document.getElementById("form");

const users = [
    { username: "admin", password: "admin123" },
    { username: "user1", password: "password1" }
];

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageBox = document.getElementById('message');
    
    // Find the user in the simulated data
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        alert("Login successful!");
        messageBox.textContent = 'Login successful!';
        messageBox.style.color = 'green';
        messageBox.style.display = 'block';
        // Redirect to a new page or do other actions after successful login
        //window.location.href = "dashboard.html"; // Example redirect
    } else {
        // Show error message
        messageBox.style.color = "red";
        messageBox.style.display = "block";
    }
});