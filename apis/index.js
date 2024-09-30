const express = require('express');
const app = express();
require("./database/db")
require("dotenv").config()
const cookieParser = require('cookie-parser');
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");
const path = require("path");
// const aws = require("aws-sdk");
// const multerS3 = require("multer-s3");

// Create an S3 client with AWS SDK v3
const s3 = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
});

// Configure Multer for file uploads (store locally before uploading to S3)
const upload = multer({ dest: 'uploads/' });



// aws.config.update({
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     region: process.env.BUCKET_REGION
// });

// const BUCKET_NAME=process.env.BUCKET_NAME;
// const s3 = new aws.S3();

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.BUCKET_NAME,
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },

//         key: function (req, file, cb) {
//             // cb(null, Date.now() + '-' + file.originalname)
//             cb(null,file.originalname)
//         }
//     })
// })

// app.post("/upload", upload.single("file"), async function(req, res)=> {
//     if (!req.file) {
//         return res.status(400).send("No file uploaded.");
//     }

//     const fileStream = fs.createReadStream(req.file.path);
//     const uploadParams = {
//         Bucket: process.env.BUCKET_NAME,
//         Key: Date.now().toString() + '-' + req.file.originalname, // Set unique file name
//         Body: fileStream,
//         ACL: 'public-read', // Set file permissions, remove if not needed
//     };
//     try {
//         const parallelUploads3 = new Upload({
//             client: s3,
//             params: uploadParams,
//         });

//         const result = await parallelUploads3.done();
//         res.send(`File uploaded successfully: ${result.Location}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Failed to upload file");
//     } finally {
//         fs.unlinkSync(req.file.path); // Remove the file from local server
//     }
    
// })

// Add middleware to parse cookies
app.use(cookieParser());

// const bodyParser = require("body-parser");
app.use(express.json());//use Body-Parsing Middleware:
// Ensure that you're using express.json() middleware to correctly parse incoming JSON data.

app.use(express.urlencoded({ extended: true })); // Use urlencoded to handle form data

const userroute = require("./routes/userroutes");
const productroute = require("./routes/productroutes");
const warehouseroute = require("./routes/warehouseroutes");
app.use("/", userroute);
app.use("/", productroute);
app.use("/", warehouseroute);

const port = 3000;
app.listen(port, () => {
    console.log(`Server Is Running On Port http://localhost:${port}/`);
})

