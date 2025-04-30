const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Register route
app.post('/register', (req, res) => {
  const { firstName, surname, gender, age, email, username, password } = req.body;

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading data.');

    const lines = data.split('\n').filter(Boolean);
    const userExists = lines.some(line => {
      const parts = line.split(',');
      return parts[4] === email || parts[5] === username;
    });

    if (userExists) return res.status(409).send('Email or username already exists.');

    const line = `${firstName},${surname},${gender},${age},${email},${username},${password},,,0,0`;

    fs.appendFile('users.txt', line + '\n', err => {
      if (err) return res.status(500).send('Error saving data.');
      console.log("✅ Registered:", username);
      res.sendStatus(200);
    });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send("Server error");

    const isValid = data.split('\n').some(line => {
      const parts = line.split(',');
      return parts[5]?.trim() === username.trim() && parts[6]?.trim() === password.trim();
    });

    return isValid ? res.sendStatus(200) : res.status(401).send("Invalid credentials");
  });
});

// Update profile
app.post('/updateProfile', (req, res) => {
  const { username, firstName, surname, age, email, weight, height, goal, diet, caloriesIn, caloriesOut } = req.body;

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Server error');

    const lines = data.split('\n').filter(Boolean);
    const updatedLines = lines.map(line => {
      const parts = line.split(',');

      if (parts[5]?.trim() === username.trim()) {
        while (parts.length < 13) parts.push('');

        parts[0] = (firstName || parts[0]).trim();
        parts[1] = (surname || parts[1]).trim();
        parts[3] = (age || parts[3]).trim();
        parts[4] = (email || parts[4]).trim();
        parts[7] = (weight || parts[7]).trim();
        parts[8] = (height || parts[8]).trim();
        parts[9] = (goal || parts[9]).trim();
        parts[10] = (diet || parts[10]).trim();
        parts[11] = (caloriesIn || parts[11]).trim();
        parts[12] = (caloriesOut || parts[12]).trim();

        console.log("✅ Updated line for:", username);
        console.log("🔁 Writing values:", {
          firstName: parts[0],
          surname: parts[1],
          age: parts[3],
          email: parts[4],
          weight: parts[7],
          height: parts[8],
          goal: parts[9],
          diet: parts[10],
          caloriesIn: parts[11],
          caloriesOut: parts[12]
        });

        return parts.slice(0, 13).join(',');
      }

      return line;
    });

    fs.writeFile('users.txt', updatedLines.join('\n') + '\n', err => {
      if (err) return res.status(500).send('Server error');
      console.log(`✅ Profile updated for ${username}`);
      res.sendStatus(200);
    });
  });
});

// Fetch profile
app.post('/profile', (req, res) => {
  const { username } = req.body;

  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Server error');

    const line = data.split('\n').find(line => {
      const parts = line.split(',');
      return parts[5]?.trim() === username.trim();
    });

    if (!line) return res.status(404).send('User not found');

    const [firstName, surname, gender, age, email, storedUsername, password, weight, height, goal, diet, caloriesIn, caloriesOut] = line.split(',');

    res.json({
      fullName: `${firstName} ${surname}`,
      email,
      weight,
      height,
      age,
      goal,
      caloriesIn,
      caloriesOut
    });
  });
});
// Log daily calorie intake and burned
app.post('/logCalories', (req, res) => {
  const { username, caloriesIn, caloriesOut, date } = req.body;
  const logDate = date || new Date().toISOString().slice(0, 10);

  fs.readFile('calorie-history.json', 'utf8', (err, data) => {
    let history = {};
    if (!err && data) {
      try {
        history = JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse calorie-history.json:", e);
      }
    }

    if (!history[username]) history[username] = [];

    const existingIndex = history[username].findIndex(entry => entry.date === logDate);
    if (existingIndex >= 0) {
      history[username][existingIndex] = { date: logDate, in: caloriesIn, out: caloriesOut };
    } else {
      history[username].push({ date: logDate, in: caloriesIn, out: caloriesOut });
    }

    fs.writeFile('calorie-history.json', JSON.stringify(history, null, 2), err => {
      if (err) return res.status(500).send("Error writing history");
      res.sendStatus(200);
    });
  });
});

// Fetch historical calorie data for graphing
app.post('/getCalorieHistory', (req, res) => {
  const { username } = req.body;

  fs.readFile('calorie-history.json', 'utf8', (err, data) => {
    if (err || !data) return res.json([]);
    
    try {
      const history = JSON.parse(data);
      const userData = history[username] || [];
      res.json(userData);
    } catch (e) {
      console.error("Error parsing calorie-history.json:", e);
      res.json([]);
    }
  });
});

// Catch-all
app.use((req, res, next) => {
  console.log(`🔥 Unhandled request → ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/login.html`);
});