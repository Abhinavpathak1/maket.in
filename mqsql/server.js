// ======================================================
// FILE: server.js
// MARKET.IN COMPLETE MYSQL BACKEND
// NO MONGODB
// ======================================================

// ================= IMPORTS =================

import express from "express";
import cors from "cors";
import mysql from "mysql2";

// ================= APP =================

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

// ======================================================
// MYSQL CONNECTION
// ======================================================

const db = mysql.createConnection({

  host: "localhost",

  user: "root",

  password: "mysql",

  database: "maket_db"

});

// ================= CONNECT MYSQL =================

db.connect((err) => {

  if (err) {

    console.log(
      "MySQL Connection Failed",
      err
    );

  } else {

    console.log(
      "Connected To MySQL"
    );

  }

});

// ======================================================
// CREATE USERS TABLE
// ======================================================

const createUsersTable = `

CREATE TABLE IF NOT EXISTS users (

  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(255),

  email VARCHAR(255) UNIQUE,

  password VARCHAR(255),

  mobile VARCHAR(20),

  date VARCHAR(50),

  gender VARCHAR(50),

  country VARCHAR(100),

  address TEXT,

  security VARCHAR(255),

  securityAnswer VARCHAR(255),

  userType VARCHAR(100),

  prefer VARCHAR(255),

  accountId VARCHAR(100)

)

`;

db.query(
  createUsersTable,
  (err) => {

    if (err) {

      console.log(err);

    } else {

      console.log(
        "Users Table Ready"
      );

    }

  }
);

// ======================================================
// CREATE PRODUCTS TABLE
// ======================================================

const createProductsTable = `

CREATE TABLE IF NOT EXISTS products (

  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(255),

  category VARCHAR(255),

  image TEXT,

  price INT,

  description TEXT

)

`;

db.query(
  createProductsTable,
  (err) => {

    if (err) {

      console.log(err);

    } else {

      console.log(
        "Products Table Ready"
      );

    }

  }
);

// ======================================================
// GENERATE ACCOUNT ID
// ======================================================

function generateAccountId() {

  const randomNumber =

    Math.floor(
      100000 + Math.random() * 900000
    );

  return "MK" + randomNumber;

}

// ======================================================
// REGISTER API
// ======================================================

app.post(
  "/api/register",
  (req, res) => {

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
      securityAnswer,
      userType,
      prefer

    } = req.body;

    // ================= CHECK EMAIL =================

    const checkSql =

      "SELECT * FROM users WHERE email = ?";

    db.query(

      checkSql,

      [email],

      (checkErr, checkResult) => {

        if (checkErr) {

          return res
            .status(500)
            .json({
              message:
                "Database Error"
            });

        }

        if (
          checkResult.length > 0
        ) {

          return res
            .status(400)
            .json({
              message:
                "Email Already Exists"
            });

        }

        // ================= ACCOUNT ID =================

        const accountId =
          generateAccountId();

        // ================= INSERT USER =================

        const insertSql = `

          INSERT INTO users
          (
            name,
            email,
            password,
            mobile,
            date,
            gender,
            country,
            address,
            security,
            securityAnswer,
            userType,
            prefer,
            accountId
          )

          VALUES
          (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )

        `;

        db.query(

          insertSql,

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
            securityAnswer,
            userType,
            prefer,
            accountId

          ],

          (insertErr, result) => {

            if (insertErr) {

              console.log(insertErr);

              return res
                .status(500)
                .json({
                  message:
                    "Registration Failed"
                });

            }

            res.json({

              message:
                "Registration Successful",

              accountId:
                accountId

            });

          }

        );

      }

    );

  }
);

// ======================================================
// LOGIN API
// ======================================================

app.post(
  "/api/login",
  (req, res) => {

    const {
      email,
      password
    } = req.body;

    const sql =

      "SELECT * FROM users WHERE email = ?";

    db.query(

      sql,

      [email],

      (err, result) => {

        if (err) {

          return res
            .status(500)
            .json({
              message:
                "Server Error"
            });

        }

        if (
          result.length === 0
        ) {

          return res
            .status(401)
            .json({
              message:
                "Invalid Email"
            });

        }

        const user =
          result[0];

        // ================= PASSWORD CHECK =================

        if (
          user.password !== password
        ) {

          return res
            .status(401)
            .json({
              message:
                "Wrong Password"
            });

        }

        res.json({

          message:
            "Login Successful",

          user: {

            id:
              user.id,

            name:
              user.name,

            email:
              user.email,

            accountId:
              user.accountId,

            userType:
              user.userType

          }

        });

      }

    );

  }
);

// ======================================================
// GET USERS API
// ======================================================

app.get(
  "/api/users",
  (req, res) => {

    const sql =
      "SELECT * FROM users";

    db.query(

      sql,

      (err, result) => {

        if (err) {

          return res
            .status(500)
            .json({
              message:
                "Error Fetching Users"
            });

        }

        res.json(result);

      }

    );

  }
);

// ======================================================
// ADD PRODUCT API
// ======================================================

app.post(
  "/api/products",
  (req, res) => {

    const {

      name,
      category,
      image,
      price,
      description

    } = req.body;

    const sql = `

      INSERT INTO products
      (
        name,
        category,
        image,
        price,
        description
      )

      VALUES
      (
        ?, ?, ?, ?, ?
      )

    `;

    db.query(

      sql,

      [
        name,
        category,
        image,
        price,
        description
      ],

      (err, result) => {

        if (err) {

          return res
            .status(500)
            .json({
              message:
                "Product Insert Failed"
            });

        }

        res.json({

          message:
            "Product Added Successfully"

        });

      }

    );

  }
);

// ======================================================
// GET PRODUCTS API
// ======================================================

app.get(
  "/api/products",
  (req, res) => {

    const sql =
      "SELECT * FROM products";

    db.query(

      sql,

      (err, result) => {

        if (err) {

          return res
            .status(500)
            .json({
              message:
                "Error Fetching Products"
            });

        }

        res.json(result);

      }

    );

  }
);

// ======================================================
// DELETE PRODUCT API
// ======================================================

app.delete(
  "/api/products/:id",
  (req, res) => {

    const sql =

      "DELETE FROM products WHERE id = ?";

    db.query(

      sql,

      [req.params.id],

      (err, result) => {

        if (err) {

          return res
            .status(500)
            .json({
              message:
                "Delete Failed"
            });

        }

        res.json({

          message:
            "Product Deleted"

        });

      }

    );

  }
);

// ======================================================
// SEED PRODUCTS API
// ======================================================

app.get(
  "/seed",
  (req, res) => {

    const products = [

      [
        "iPhone 15",
        "Mobiles",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        79999,
        "Latest Apple smartphone"
      ],

      [
        "Samsung Galaxy S24",
        "Mobiles",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505",
        74999,
        "Samsung flagship phone"
      ],

      [
        "Gaming Laptop",
        "Electronics",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        65000,
        "High performance gaming laptop"
      ],

      [
        "Nike Shoes",
        "Fashion",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        4999,
        "Comfortable running shoes"
      ],

      [
        "Smart Watch",
        "Electronics",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        6999,
        "Fitness smart watch"
      ]

    ];

    const sql = `

      INSERT INTO products
      (
        name,
        category,
        image,
        price,
        description
      )

      VALUES ?

    `;

    db.query(

      sql,

      [products],

      (err, result) => {

        if (err) {

          console.log(err);

          return res
            .status(500)
            .json({
              message:
                "Seeding Failed"
            });

        }

        res.json({

          message:
            "Products Inserted Successfully"

        });

      }

    );

  }
);

// ======================================================
// ROOT API
// ======================================================

app.get("/", (req, res) => {

  res.send(
    "Market.in Backend Running"
  );

});

// ======================================================
// SERVER
// ======================================================

const PORT = 3000;

app.listen(PORT, () => {

  console.log(

    `Server Running On http://localhost:${PORT}`

  );

});