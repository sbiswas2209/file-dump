import { Router, Request, Response } from "express";
import * as path from "path";
import multer from "multer";
import * as fs from "fs";
import * as mime from "mime";
import LoggerInstance from "../../loaders/logger";
const fileRouter = Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, encodeURI(file.originalname) + path.extname(file.originalname)) //Appending extension
    }
  })
const upload = multer({storage: storage})

fileRouter.post("/upload", upload.array("files"),handleUpload)
fileRouter.get("/download", handleDownload)

async function handleDownload(req: Request, res: Response) {
    LoggerInstance.info(encodeURI(req.query.v.toString()))
    if(req.query.v === undefined){
        res.status(400).json({
            "message": "Invalid Request"
        })
    }
    if(fs.existsSync(`uploads/${encodeURI(req.query.v.toString())}`)){
        const stat = fs.statSync(`uploads/${encodeURI(req.query.v.toString())}`);
        res.writeHead(200, "File Found", {
            "Content-Type": mime.getType(`uploads/${encodeURI(req.query.v.toString())}`),
            "Content-Length": stat.size
        })
        const readStream = fs.createReadStream(`uploads/${encodeURI(req.query.v.toString())}`);
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
    const files = req.files as Express.Multer.File[]
    res.status(200).json({
        "message": "File Uploaded",
        "links": files?.map(e => `http://localhost:5050/api/files/download?v=${encodeURI(e?.originalname) + path.extname(e?.originalname)}`)
    })
}
export default fileRouter