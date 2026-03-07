const { YoutubeTranscript } = require("youtube-transcript")

module.exports = async function(videoUrl){

    const id = videoUrl.split("v=")[1]

    const transcript = await YoutubeTranscript.fetchTranscript(id)

    return transcript.map(t=>t.text).join(" ")
}