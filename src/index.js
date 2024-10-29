import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import path from "node:path";
import hbsHelpers from "./lib/handdlebars.js";
import router from "./routes/index.js";
import linkRoute from "./routes/links.js";
import authenticationRoute from "./routes/authentication.js";
import flash from "connect-flash";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import { database } from "./keys.js";
import passport from "passport";
import "./lib/passport.js";

// Inicializaciones
const app = express();

// Configuraciones
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: hbsHelpers,
  })
);
app.set("view engine", ".hbs");

// Middleware
const MySQLStoreInstance = MySQLStore(session);
const sessionStore = new MySQLStoreInstance(database);

app.use(
  session({
    secret: "linksmysqlsessions",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});

// Rutas
app.use(router);
app.use(authenticationRoute);
app.use("/links", linkRoute);

// Public
app.use(express.static(path.join(__dirname, "public")));

// Iniciar el servidor
app.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
