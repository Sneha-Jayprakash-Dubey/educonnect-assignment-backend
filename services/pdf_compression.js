const { PDFDocument } = require("pdf-lib")

async function compressPDF(buffer){

    const pdfDoc = await PDFDocument.load(buffer)

    const compressedPdf = await pdfDoc.save({
        useObjectStreams:true
    })

    return Buffer.from(compressedPdf)
}

module.exports = { compressPDF }