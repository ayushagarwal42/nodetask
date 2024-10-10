//apis\index.js
require("dotenv").config()
require("./database/db")

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");


aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION
});

const BUCKET_NAME=process.env.BUCKET_NAME;
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        // acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },

        key: function (req, file, cb) {
            // cb(null, Date.now() + '-' + file.originalname)
            cb(null,file.originalname)
        }
    })
})

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully at '+req.file.location+' location!');
});

app.get('/list', async (req, res) => {
    try {
        let r=await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
        let x=r.Contents.map((i)=>i.Key);
        res.send(x);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

app.get("/download/:filename", async (req, res) => {
    const filename = req.params.filename;
    try {
        let x = await s3.getObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
        res.send(x.Body);
    } catch (error) {
        console.error(error);
        res.status(404).send("File Not Found");
    }
});

app.delete("/delete/:filename", async (req, res) => {
    const filename = req.params.filename;
    try {
        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
        res.send("File Deleted Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Configure Multer for file uploads (store locally before uploading to S3)
// const upload = multer({ dest: 'uploads/' });

// Add middleware to parse cookies
app.use(cookieParser());
// const bodyParser = require("body-parser");
app.use(express.json());//use Body-Parsing Middleware:
// Ensure that you're using express.json() middleware to correctly parse incoming JSON data.
app.use(express.urlencoded({ extended: true })); // Use urlencoded to handle form data
app.use(passport.initialize()); // Initialize Passport middleware


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