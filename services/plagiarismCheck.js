const pdfParse = require("pdf-parse")
const generateHash = require("../utils/hashGenerator")

const previousAssignments = []

module.exports = async function plagiarismCheck(buffer){

    const data = await pdfParse(buffer)
    const text = data.text

    const newHash = generateHash(text)

    let similarity = 0

    previousAssignments.forEach(old => {
        if(old === newHash) similarity += 100
    })

    previousAssignments.push(newHash)

    return similarity
}