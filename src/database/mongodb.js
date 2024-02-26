const mongoose = require("mongoose");

mongoose
    .connect("mongodb+srv://Aisultan:generationZ1!@zhanaadamdar.1kcqxos.mongodb.net/formula1")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error while connecting to MongoDB: ", err);
    });

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_admin: { type: Boolean, default: false },
});

const trackSchema = new Schema({
    name: { type: String, required: true, unique: true },
    name_ru: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    description_ru: { type: String, required: true },
    country: { type: String, required: true },
    country_ru: { type: String, required: true },
    city: { type: String, required: true },
    city_ru: { type: String, required: true },
    length: { type: Number, required: true },
    corners: { type: Number, required: true },
    attitude_difference: { type: Number, required: true },
    link1: { type: String, required: true },
    link2: { type: String, required: true },
    link3: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const quizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Track = mongoose.model("Track", trackSchema);
const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = { User, Track, Quiz };
