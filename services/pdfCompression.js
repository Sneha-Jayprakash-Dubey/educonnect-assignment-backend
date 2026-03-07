// const zlib = require("zlib")

// async function compressPDF(buffer) {

//     return new Promise((resolve, reject) => {

//         zlib.gzip(buffer, (err, compressed) => {

//             if(err){
//                 reject(err)
//             } else{
//                 resolve(compressed)
//             }

//         })

//     })

// }

// module.exports = { compressPDF }
const { PDFDocument } = require("pdf-lib")

module.exports = async function compressPDF(buffer){

    const pdf = await PDFDocument.load(buffer)

    const compressed = await pdf.save({
        useObjectStreams:true
    })

    return Buffer.from(compressed)
}