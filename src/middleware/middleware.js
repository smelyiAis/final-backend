async function ensureAuthenticated(req, res, next) {
    if (req.session?.user) {
        return next();
    }
    res.redirect("/login");
}

async function ensureUnauthenticated(req, res, next) {
    if (!req.session?.user) {
        return next();
    }
    res.redirect("/");
}

async function ensureAdmin(req, res, next) {
    if (req.session?.user?.is_admin) {
        return next();
    }
    res.redirect("/");
}

module.exports = { ensureAuthenticated, ensureUnauthenticated, ensureAdmin };
