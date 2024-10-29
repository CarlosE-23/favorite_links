import passport from "passport";
import { Strategy } from "passport-local";
import { pool } from "../database.js";
import { helpers } from "./helpers.js";

passport.use(
  "local.signin",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      console.log("Login", req.body);
      try {
        const rows = await pool.query(
          "SELECT * FROM users WHERE username = ?",
          [username]
        );
        console.log(rows);
        if (rows.length > 0) {
          const user = rows[0];
          const validPassword = await helpers.matchPassword(
            password,
            user.password
          );
          if (validPassword) {
            done(null, user, req.flash("success", "Welcome" + user.username));
          } else {
            done(null, false, req.flash("message", "Incorrect Password"));
          }
        } else {
          return done(
            null,
            false,
            req.flash("message", "The Username does not exists")
          );
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "local.signup",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      console.log(req.body);
      try {
        const { fullname } = req.body;

        const newUser = {
          username,
          password: await helpers.encrypPassword(password),
          fullname,
        };

        const result = await pool.query("INSERT INTO users SET ?", [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});
