const zlib = require("zlib")

async function compressPDF(buffer) {

    return new Promise((resolve, reject) => {

        zlib.gzip(buffer, (err, compressed) => {

            if(err){
                reject(err)
            } else{
                resolve(compressed)
            }

        })

    })

}

module.exports = { compressPDF }