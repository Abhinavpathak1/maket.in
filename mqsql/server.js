import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';


const app = express();

app.use(cors());
app.use(express.json());

// 🔗 MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql', // your MySQL password
  database: 'maket_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// 📌 API: Register user
app.post('/api/register', (req, res) => {
    const {
  name,
  email,
  password,
  mobile,
  date,
  gender,
  country,
  address,
  security,
  securityAnswer
   } = req.body;

      const sql = `
      INSERT INTO users
      (name, email, password, mobile, date, gender, country, address, security, securityAnswer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

  db.query(
  sql,
  [
    name,
    email,
    password,
    mobile,
    date,
    gender,
    country,
    address,
    security,
    securityAnswer
  ],
  (err, result) =>  {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: 'User registered successfully' });
  });
});

// 📌 API: Get users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length > 0) {
      res.json({ message: 'Login successful', user: result[0] });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});