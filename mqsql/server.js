import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());

/* ================= DATABASE CONNECTION ================= */

const db = mysql.createConnection({

  host: "localhost",

  user: "root",

  password: "mysql",

  database: "maket_db"

});

db.connect((err) => {

  if (err) {

    console.log(
      "Database Connection Failed",
      err
    );

  } else {

    console.log(
      "Connected To MySQL"
    );

  }

});

/* ================= GENERATE ACCOUNT ID ================= */

function generateAccountId() {

  const randomNumber =
    Math.floor(
      100000 + Math.random() * 900000
    );

  return "MK" + randomNumber;
}

/* ================= REGISTER API ================= */

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

    /* ===== CHECK IF EMAIL EXISTS ===== */

    const checkEmailSql =
      "SELECT * FROM users WHERE email = ?";

    db.query(
      checkEmailSql,
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

        /* ===== CREATE UNIQUE ACCOUNT ID ===== */

        const accountId =
          generateAccountId();

        /* ===== INSERT USER ===== */

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

              console.log(
                insertErr
              );

              return res
                .status(500)
                .json({
                  message:
                    "Insert Failed"
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

/* ================= LOGIN API ================= */

app.post(
  "/api/login",
  (req, res) => {

    const {

      email,
      password

    } = req.body;

    const sql =

      `SELECT * FROM users
       WHERE email = ?`;

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

        /* ===== PASSWORD CHECK ===== */

        if (
          user.password !==
          password
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

/* ================= GET USERS API ================= */

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

/* ================= SERVER ================= */

app.listen(
  3000,
  () => {

    console.log(
      "Server Running On http://localhost:3000"
    );

  }
);