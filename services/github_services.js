const axios = require("axios")

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Sneha-Jayprakash-dubey/educonnect-assignments"

async function uploadToGithub(fileBuffer, fileName) {

    const path = `assignments/${Date.now()}_${fileName}`

    const base64File = fileBuffer.toString("base64")

    const response = await axios.put(
        `https://api.github.com/repos/${REPO}/contents/${path}`,
        {
            message: "Upload assignment",
            content: base64File
        },
        {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    )

    return response.data.content.download_url
}

module.exports = {
    uploadToGithub
}