const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Register route - Save user info
app.post('/register', (req, res) => {
  const { firstName, surname, gender, age, email, username, password } = req.body;

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read users.txt:', err);
      return res.status(500).send('Error reading data.');
    }

    const lines = data.split('\n').filter(Boolean);
    const userExists = lines.some(line => {
      const parts = line.split(',');
      const storedEmail = parts[4];
      const storedUsername = parts[5];
      return storedEmail === email || storedUsername === username;
    });

    if (userExists) {
      console.log("❌ Duplicate email or username found.");
      return res.status(409).send('Email or username already exists.');
    }

    // If not exists, save new user
    const line = `${firstName},${surname},${gender},${age},${email},${username},${password}\n`;

    fs.appendFile('users.txt', line, (err) => {
      if (err) {
        console.error('Failed to save user:', err);
        return res.status(500).send('Error saving data.');
      }
      console.log("✅ User registered:", username);
      res.sendStatus(200);
    });
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
      const [ , , , , , storedUsername, storedPassword ] = line.trim().split(',');
      console.log("→ CHECKING: ", storedUsername, storedPassword);
      return storedUsername.trim() === username.trim() && storedPassword.trim() === password.trim();
    });

    if (isValid) {
      res.sendStatus(200);
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

// Update user profile after questionnaire
app.post('/updateProfile', (req, res) => {
  const { username, weight, height, goal, diet } = req.body;

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users.txt:', err);
      return res.status(500).send('Server error');
    }

    const lines = data.split('\n').filter(Boolean);
    const updatedLines = lines.map(line => {
      const parts = line.split(',');
      if (parts[5] === username) { // Username is at index 5
        while (parts.length < 11) {
          parts.push('');
        }
        parts[7] = weight;
        parts[8] = height;
        parts[9] = goal;
        parts[10] = diet;
        return parts.join(',');
      }
      return line;
    });

    fs.writeFile('users.txt', updatedLines.join('\n') + '\n', (err) => {
      if (err) {
        console.error('Error updating users.txt:', err);
        return res.status(500).send('Server error');
      }
      res.sendStatus(200);
    });
  });
});

// Profile route - Fetch profile data
app.post('/profile', (req, res) => {
  const { username } = req.body;

  console.log("📥 Fetching profile for username:", username);

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading users.txt:', err);
      return res.status(500).send('Server error');
    }

    const lines = data.split('\n').filter(Boolean);
    const userLine = lines.find(line => {
      const parts = line.split(',');
      const storedUsername = parts[5]; // Username is at index 5
      return storedUsername.trim() === username.trim();
    });

    if (!userLine) {
      console.log("❌ User not found for:", username);
      return res.status(404).send('User not found');
    }

    const parts = userLine.split(',');

    const firstName = parts[0];
    const surname = parts[1];
    const gender = parts[2];
    const age = parts[3];
    const email = parts[4];
    const storedUsername = parts[5];
    const password = parts[6];
    const weight = parts[7] || '';
    const height = parts[8] || '';
    const goal = parts[9] || '';
    const diet = parts[10] || '';

    res.json({
      fullName: `${firstName} ${surname}`,
      email,
      weight,
      height,
      age,
      goal
    });
  });
});

// Catch all unmatched routes
app.use((req, res, next) => {
  console.log(`🔥 Unhandled request → ${req.method} ${req.url}`);
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/login.html`);
});