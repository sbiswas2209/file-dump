"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path = __importStar(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const mime = __importStar(require("mime"));
const fileRouter = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    }
});
const upload = (0, multer_1.default)({ storage: storage });
fileRouter.post("/upload", upload.array("files"), handleUpload);
fileRouter.get("/download", handleDownload);
async function handleDownload(req, res) {
    if (req.query.v === undefined) {
        res.status(400).json({
            "message": "Invalid Request"
        });
    }
    if (fs.existsSync(`uploads/${req.query.v}`)) {
        const stat = fs.statSync(`uploads/${req.query.v}`);
        res.writeHead(200, "File Found", {
            "Content-Type": mime.getType(`uploads/${req.query.v}`),
            "Content-Length": stat.size
        });
        const readStream = fs.createReadStream(`uploads/${req.query.v}`);
        readStream.pipe(res);
    }
    else {
        res.status(404).json({
            "message": "File Not Found"
        });
    }
}
async function handleUpload(req, res) {
    console.log(req.files);
    res.status(200).json({
        "message": "File Uploaded"
    });
}
exports.default = fileRouter;
//# sourceMappingURL=router.js.map