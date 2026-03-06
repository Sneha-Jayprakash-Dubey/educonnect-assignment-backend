async function scanFile(buffer) {

    const fileHeader = buffer.slice(0, 5).toString()

    // Check if file is PDF
    if (fileHeader !== "%PDF-") {
        return false
    }

    // Limit file size to 10MB
    if (buffer.length > 10 * 1024 * 1024) {
        return false
    }

    const content = buffer.toString()

    // Block embedded JavaScript inside PDF
    if (content.includes("/JavaScript")) {
        return false
    }

    return true
}

module.exports = {
    scanFile
}