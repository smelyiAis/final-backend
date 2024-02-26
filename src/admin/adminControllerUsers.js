const { User } = require("../database/mongodb");

async function adminControllerGetUsers(req, res) {
    const users = await User.find();
    const admin = req.session?.user;
    return res.render("admin_users", { users, user: admin, error: null, success: null });
}

async function adminControllerDeleteUser(req, res) {
    const userId = req.params.id;
    await User.deleteOne({ _id: userId });
    return res.redirect("/admin/users");
}

async function adminControllerEditUser(req, res) {
    try {
        const userId = req.params.id;
        let us = null;

        try {
            us = await User.findById(userId).exec();
        } catch {
            // pass
        }

        if (!us) {
            const users = await User.find().exec();
            const admin = req.session?.user;
            return res.render("admin_users", { users, user: admin, error: "User not found!", success: false });
        }
        return res.render("admin_user_edit", { user: req.session?.user, us: us });
    } catch (error) {
        // console.error("Error fetching user:", error);
    }
}

async function adminControllerEditUserPost(req, res) {
    const userId = req.params.id;
    const { username, email } = req.body;
    try {
        await User.findByIdAndUpdate(userId, { username, email });
    } catch (error) {
        res.render("admin_users", { user: req.session?.user, error: "Error editing user", success: false });
    }

    const users = await User.find();
    res.render("admin_users", { users, user: req.session?.user, error: null, success: "User has been updated" });
}

module.exports = { adminControllerGetUsers, adminControllerDeleteUser, adminControllerEditUser, adminControllerEditUserPost };
