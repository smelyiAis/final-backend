const { Quiz, User } = require("../database/mongodb");

async function bonusPost(req, res) {
    try {
        const responses = req.body.answers;
        const timeLimitInSeconds = 300;
        let submittedTimeInSeconds = req.body.submittedTime;

        submittedTimeInSeconds = parseInt(submittedTimeInSeconds, 10);
        const passedWithinTime = timeLimitInSeconds - (submittedTimeInSeconds ?? 300) > 0;
        let score = 0;

        const scorePromises = Object.entries(responses).map(async ([key, answer]) => {
            const match = key.match(/^question_(.+)/);
            if (!match) return;

            const questionId = match[1];
            const question = await Quiz.findById(questionId);
            if (question && question.correctAnswer === answer) {
                return 1;
            }
            return 0;
        });

        const results = await Promise.all(scorePromises);
        score = results.reduce((acc, curr) => acc + curr, 0);
        const user = req.session?.user;

        res.render("quiz_results", { score, user, totalQuestions: results.length, submittedTimeInSeconds, timeLimitInSeconds, passedWithinTime });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}

async function bonusGet(req, res) {
    const user = req.session?.user;
    const quiz = await Quiz.find();
    res.render("bonus", { user, questions: quiz });
}

module.exports = { bonusPost, bonusGet };
