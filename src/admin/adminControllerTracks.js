const { Track } = require("../database/mongodb");

async function adminControllerGetTracks(req, res) {
    const tracks = await Track.find();
    const admin = req.session?.user;
    return res.render("admin_tracks", { tracks, user: admin, error: null, success: null });
}

async function adminControllerDeleteTrack(req, res) {
    const trackId = req.params.id;
    await Track.deleteOne({ _id: trackId });
    return res.render({ tracks: await Track.find(), user: req.session?.user, error: null, success: "Track has been deleted" });
}

async function adminControllerEditTrack(req, res) {
    const trackId = req.params.id;
    let track = null;
    try {
        track = await Track.findById(trackId).exec();
    } catch {
        // pass
    }

    if (!track) {
        const tracks = await Track.find().exec();
        const admin = req.session?.user;
        return res.render("admin_tracks", { tracks, user: admin, error: "Track not found!", success: false });
    }

    return res.render("admin_track_edit", { user: req.session?.user, track });
}

async function adminControllerEditTrackPost(req, res) {
    const trackId = req.params.id;
    const { name, name_ru, description, description_ru, country, country_ru, city, city_ru, length, corners, attitude_difference } =
        req.body;
    const tracks = await Track.find();

    try {
        await Track.findByIdAndUpdate(trackId, {
            name,
            name_ru,
            description,
            description_ru,
            country,
            country_ru,
            city,
            city_ru,
            length,
            corners,
            attitude_difference,
        });
    } catch (error) {
        return res.render("admin_tracks", { user: req.session?.user, error: "Error editing track", success: false });
    }

    return res.render("admin_tracks", { user: req.session?.user, error: null, success: "Track has been updated" });
}

async function adminControllerAddTracks(req, res) {
    let {
        name,
        name_ru,
        description,
        description_ru,
        country,
        country_ru,
        city,
        city_ru,
        length,
        corners,
        attitude_difference,
        link1,
        link2,
        link3,
    } = req.body;
    const tracks = await Track.find();
    try {
        length = parseInt(length);
        corners = parseInt(corners);
        attitude_difference = parseInt(attitude_difference);

        await Track.create({
            name,
            name_ru,
            description,
            description_ru,
            country,
            country_ru,
            city,
            city_ru,
            length,
            corners,
            attitude_difference,
            link1,
            link2,
            link3,
        });
    } catch (error) {
        return res.render("admin_tracks", { user: req.session?.user, tracks, error: "Error adding track", success: false });
    }

    return res.render("admin_tracks", { user: req.session?.user, tracks, error: null, success: "Track has been added" });
}

module.exports = {
    adminControllerGetTracks,
    adminControllerDeleteTrack,
    adminControllerEditTrack,
    adminControllerEditTrackPost,
    adminControllerAddTracks,
};
