// const Busboy = require("busboy")
// // const { compressPDF } = require("../services/pdf_compression.js")
// // const { scanFile } = require("../services/fileSecurity")
// const { uploadToGithub } = require("../services/githubServices")
// const { scanFile } = require("../services/fileSecurity")
// // const { uploadToGithub } = require("../services/githubService")
// const { compressPDF } = require("../services/pdfCompression")
// const cors = require("cors")

// module.exports = async (req, res) => {

//     cors()(req,res,()=>{})

//     if (req.method !== "POST") {
//         return res.status(405).json({error:"Method not allowed"})
//     }

//     const busboy = Busboy({ headers: req.headers })

//     let fileBuffer = Buffer.from("")
//     let fileName = ""

//     busboy.on("file", (fieldname, file, filename) => {

//         fileName = filename

//         file.on("data", (data)=>{
//             fileBuffer = Buffer.concat([fileBuffer,data])
//         })

//     })

//     busboy.on("finish", async ()=>{

//         try {

//             // Security scan
//             const safe = await scanFile(fileBuffer)

//             if(!safe){
//                 return res.status(400).json({
//                     error:"File rejected by security scan"
//                 })
//             }

//             // Compress PDF
//             const compressed = await compressPDF(fileBuffer)

//             // Upload to GitHub
//             const url = await uploadToGithub(
//                 compressed,
//                 fileName
//             )

//             return res.status(200).json({
//                 success:true,
//                 fileUrl:url
//             })

//         } catch(error){

//             return res.status(500).json({
//                 error:error.message
//             })
//         }

//     })

//     req.pipe(busboy)
// }
const multer = require("multer")
const generateHash = require("../utils/hashGenerator")
const uploadToGithub = require("../services/githubUploader")
const compressPDF = require("../services/pdfCompressor")
const plagiarismCheck = require("../services/plagiarismCheck")
const admin = require("firebase-admin")

const db = admin.firestore()

const upload = multer()

module.exports = async (req,res)=>{

    upload.single("file")(req,res, async err=>{

        if(err) return res.status(500).send(err)

        const buffer = req.file.buffer
        const title = req.body.title
        const teacherId = req.body.teacherId

        const fileHash = generateHash(buffer)

        // check duplicate assignment
        const existing = await db.collection("assignments")
            .where("fileHash","==",fileHash)
            .get()

        if(!existing.empty){
            return res.json({
                assignmentId: existing.docs[0].id,
                pdfUrl: existing.docs[0].data().pdfUrl
            })
        }

        // compress pdf
        const compressed = await compressPDF(buffer)

        // plagiarism detection
        const plagiarismScore = await plagiarismCheck(compressed)

        if(plagiarismScore > 70){
            return res.status(400).json({
                error:"Assignment plagiarism too high"
            })
        }

        // upload to github
        const githubUrl = await uploadToGithub(compressed)

        const doc = await db.collection("assignments").add({
            title,
            pdfUrl: githubUrl,
            fileHash,
            plagiarismScore,
            uploadedBy: teacherId,
            createdAt: new Date()
        })

        res.json({
            assignmentId: doc.id,
            pdfUrl: githubUrl
        })

    })
}