import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import config from '../config';
import path from 'path';

/*
multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
})
*/

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    let xdate = Date.now().toString();
    const fileName = (xdate + file.originalname).toLowerCase().split(' ').join('-');
    //let fileName = xdate + path.basename(file);
    console.log("FILENAME " + fileName);
    //cb(null, `${Date.now()+path.basename(filename)}.jpg`);
    // let fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  console.log("SENDING " + req.file.path);
  res.send('http://starshout.net/' + req.file.path);
})

aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: 'amazona-bucket',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadS3 = multer({ storage: storageS3 });
router.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location);
});
export default router;
