const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;

const { User, Track, Quiz } = require("./src/database/mongodb");
const { login, signup } = require("./src/auth/auth");
const { ensureAuthenticated, ensureUnauthenticated, ensureAdmin } = require("./src/middleware/middleware");
const {
    adminControllerGetUsers,
    adminControllerDeleteUser,
    adminControllerEditUser,
    adminControllerEditUserPost,
} = require("./src/admin/adminControllerUsers");
const {
    adminControllerAddTracks,
    adminControllerDeleteTrack,
    adminControllerEditTrack,
    adminControllerEditTrackPost,
    adminControllerGetTracks,
} = require("./src/admin/adminControllerTracks");
const { getFormulaOneNews } = require("./src/api/newsapi");
const { getAllDrivers, getAllTeams } = require("./src/api/formulaoneapi");
const { bonusPost, bonusGet } = require("./src/bonus/bonus");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "fernandoalonso", resave: false, saveUninitialized: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const language = req.query.language;
    const user = req.session?.user;
    const tracks = await Track.find();
    res.render("index", { user, tracks, language });
});

app.get("/news", async (req, res) => {
    const language = req.query.language;
    const user = req.session?.user;
    const news = await getFormulaOneNews(language);
    res.render("news", { user, news, language: language ?? "en" });
});

app.get("/drivers", async (req, res) => {
    const user = req.session?.user;
    const drivers = await getAllDrivers();
    res.render("drivers", { user, drivers });
});

app.get("/constructors", async (req, res) => {
    const user = req.session?.user;
    const teams = await getAllTeams();
    res.render("constructors", { user, constructors: teams });
});

app.get("/bonus", ensureAuthenticated, bonusGet);

app.post("/bonus", ensureAuthenticated, bonusPost);

app.get("/login", ensureUnauthenticated, async (req, res) => {
    return res.render("login", { user: null, error: null, success: false });
});

app.get("/signup", ensureUnauthenticated, async (req, res) => {
    return res.render("signup", { user: null, error: null });
});

app.post("/auth/login", ensureUnauthenticated, login);

app.post("/auth/signup", ensureUnauthenticated, signup);

app.get("/logout", ensureAuthenticated, async (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// Admin routes
app.get("/admin", ensureAdmin, (req, res) => {
    res.render("admin", { user: req.session?.user });
});

app.get("/admin/users", ensureAdmin, adminControllerGetUsers);
app.get("/admin/users/delete/:id", ensureAdmin, adminControllerDeleteUser);
app.get("/admin/users/edit/:id", ensureAdmin, adminControllerEditUser);
app.post("/admin/users/edit/:id", ensureAdmin, adminControllerEditUserPost);

app.get("/admin/tracks", ensureAdmin, adminControllerGetTracks);
app.get("/admin/tracks/delete/:id", ensureAdmin, adminControllerDeleteTrack);
app.get("/admin/tracks/edit/:id", ensureAdmin, adminControllerEditTrack);
app.post("/admin/tracks/edit/:id", ensureAdmin, adminControllerEditTrackPost);
app.post("/admin/tracks/add", ensureAdmin, adminControllerAddTracks);

app.listen(port, "0.0.0.0", () => {
    console.log("Server is running on port 3000");
});
