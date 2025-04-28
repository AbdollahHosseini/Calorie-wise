console.log("✅ THIS IS THE CORRECT SERVER FILE RUNNING");

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Register route - Save user info
app.post('/register', (req, res) => {
  const user = req.body;
  const line = `${user.firstName},${user.surname},${user.gender},${user.age},${user.username},${user.password}\n`;

  fs.appendFile('users.txt', line, (err) => {
    if (err) {
      console.error('Failed to save user:', err);
      res.status(500).send('Error saving data.');
    } else {
      res.redirect('/questionnaire-page.html');
    }
  });
});

// Login route - Check user credentials
app.post('/login', (req, res) => {
  console.log("LOGIN ROUTE HIT");

  const { username, password } = req.body;
  console.log("LOGIN ATTEMPT →", username, password);

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading users.txt:", err);
      return res.status(500).send("Server error");
    }

    const lines = data.split('\n');
    const isValid = lines.some(line => {
      if (!line.trim()) return false;
      const [ , , , , storedUsername, storedPassword ] = line.trim().split(',');
      console.log("→ CHECKING: ", storedUsername, storedPassword);
      return storedUsername.trim() === username.trim() && storedPassword.trim() === password.trim();
    });

    if (isValid) {
      res.sendStatus(200); // Login success
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

// Catch all unmatched routes for debugging
app.use((req, res, next) => {
  console.log(`🔥 Unhandled request → ${req.method} ${req.url}`);
  next();
});

// Print available routes
if (app._router && app._router.stack) {
  app._router.stack
    .filter(r => r.route)
    .forEach(r => {
      console.log(`➡ Route registered: ${r.route.path}`);
    });
} else {
  console.log('⚠ No routes registered yet');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});