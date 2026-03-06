const Busboy = require("busboy")
// const { compressPDF } = require("../services/pdf_compression.js")
// const { scanFile } = require("../services/fileSecurity")
const { uploadToGithub } = require("../services/githubService")
const { scanFile } = require("../services/fileScanner")
// const { uploadToGithub } = require("../services/githubService")
const { compressPDF } = require("../services/pdfCompression")
const cors = require("cors")

module.exports = async (req, res) => {

    cors()(req,res,()=>{})

    if (req.method !== "POST") {
        return res.status(405).json({error:"Method not allowed"})
    }

    const busboy = Busboy({ headers: req.headers })

    let fileBuffer = Buffer.from("")
    let fileName = ""

    busboy.on("file", (fieldname, file, filename) => {

        fileName = filename

        file.on("data", (data)=>{
            fileBuffer = Buffer.concat([fileBuffer,data])
        })

    })

    busboy.on("finish", async ()=>{

        try {

            // Security scan
            const safe = await scanFile(fileBuffer)

            if(!safe){
                return res.status(400).json({
                    error:"File rejected by security scan"
                })
            }

            // Compress PDF
            const compressed = await compressPDF(fileBuffer)

            // Upload to GitHub
            const url = await uploadToGithub(
                compressed,
                fileName
            )

            return res.status(200).json({
                success:true,
                fileUrl:url
            })

        } catch(error){

            return res.status(500).json({
                error:error.message
            })
        }

    })

    req.pipe(busboy)
}