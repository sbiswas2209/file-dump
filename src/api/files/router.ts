import { Router, Request, Response } from "express";
import * as path from "path";
import multer from "multer";
import * as fs from "fs";
import * as mime from "mime";
const fileRouter = Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
const upload = multer({storage: storage})

fileRouter.post("/upload", upload.array("files"),handleUpload)
fileRouter.get("/download", handleDownload)

async function handleDownload(req: Request, res: Response) {
    if(req.query.v === undefined){
        res.status(400).json({
            "message": "Invalid Request"
        })
    }
    if(fs.existsSync(`uploads/${req.query.v}`)){
        const stat = fs.statSync(`uploads/${req.query.v}`);
        res.writeHead(200, "File Found", {
            "Content-Type": mime.getType(`uploads/${req.query.v}`),
            "Content-Length": stat.size
        })
        const readStream = fs.createReadStream(`uploads/${req.query.v}`);
        readStream.pipe(res);
    }
    else {
        res.status(404).json({
            "message": "File Not Found"
        })
    }
}

async function handleUpload(req: Request, res: Response) {
    console.log(req.files)
    res.status(200).json({
        "message": "File Uploaded"
    })
}
export default fileRouter