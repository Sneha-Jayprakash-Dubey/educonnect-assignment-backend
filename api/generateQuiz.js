const transcript = require("../services/youtubeTranscript")
const aiQuiz = require("../services/aiQuizGenerator")

module.exports = async (req,res)=>{

    const videoUrl = req.body.videoUrl

    const text = await transcript(videoUrl)

    const quiz = await aiQuiz(text)

    res.json({
        questions: quiz
    })
}