const { User } = require("../database/mongodb");
const bcrypt = require("bcrypt");

async function login(req, res) {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username: username });

    if (!userExists) {
        return res.render("login", { user: null, error: "User does not exist!" });
    }

    const match = await bcrypt.compare(password, userExists.hashed_password);

    if (!match) {
        return res.render("login", { user: null, error: "Incorrect login or password!" });
    }

    req.session.user = userExists;

    res.redirect("/");
}

async function signup(req, res) {
    const { username, email, repeat_password, password } = req.body;

    if (password !== repeat_password) {
        return res.render("signup", { user: null, error: "Passwords do not match!" });
    }

    if (password.length < 8) {
        return res.render("signup", { user: null, error: "Password is too short!" });
    }

    const userExists = await User.findOne({ username: username });

    if (userExists) {
        return res.render("signup", { user: null, error: "User already exists!" });
    }

    const hashed_password = await bcrypt.hash(password, 11);

    let user = null;
    try {
        user = await User.create({ username, email, hashed_password });
    } catch (exception) {
        return res.render("signup", { user: null, error: `${exception}` });
    }

    user.save();

    res.render("login", { user, error: null, success: true });
}

module.exports = { login, signup };
