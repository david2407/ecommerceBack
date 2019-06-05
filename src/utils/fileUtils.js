require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const compose = require('composable-middleware');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');

const errors = require('./errors');

const s3Config = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET_NAME
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(errors.NOT_IMAGE_FILE, false);
  }
};

const multerS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.S3_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
  shouldTransform: (req, file, cb) => {
    cb(null, /^image/i.test(file.mimetype));
  },
  transforms: [
    {
      id: 'small',
      key: (req, file, cb) => {
        cb(null, `small-${Date.now()}-${path.parse(file.originalname).name}.png`.replace(/\s/g, ''));
      },
      transform: (req, file, cb) => {
        cb(
          null,
          sharp()
            .resize(300)
            .png()
        );
      }
    },
    {
      id: 'medium',
      key: (req, file, cb) => {
        cb(null, `medium-${Date.now()}-${path.parse(file.originalname).name}.png`.replace(/\s/g, ''));
      },
      transform: (req, file, cb) => {
        cb(
          null,
          sharp()
            .resize(600)
            .png()
        );
      }
    },
    {
      id: 'large',
      key: (req, file, cb) => {
        cb(null, `large-${Date.now()}-${path.parse(file.originalname).name}.png`.replace(/\s/g, ''));
      },
      transform: (req, file, cb) => {
        cb(
          null,
          sharp()
            .resize(1000)
            .png()
        );
      }
    },
    {
      id: 'x-large',
      key: (req, file, cb) => {
        cb(null, `x-large-${Date.now()}-${path.parse(file.originalname).name}.png`.replace(/\s/g, ''));
      },
      transform: (req, file, cb) => {
        cb(
          null,
          sharp()
            .resize(1500)
            .png()
        );
      }
    },
    {
      id: 'super-large',
      key: (req, file, cb) => {
        cb(null, `super-${Date.now()}-${path.parse(file.originalname).name}.png`.replace(/\s/g, ''));
      },
      transform: (req, file, cb) => {
        cb(
          null,
          sharp()
            .resize(2000)
            .png()
        );
      }
    }
  ]
});

const removeFile = file => {
  var params = { Bucket: file.bucket, Key: file.key };
  s3Config.deleteObject(params, (err, data) => {
    if (err) {
      throw err;
    }
    return data;
  });
};

const uploadImageMulter = () => {
  return multer({
    storage: multerS3Config,
    fileFilter: imageFilter,
    limits: {
      fieldSize: 25 * 1024 * 1024,
      fileSize: 1024 * 1024 * 2 // we are allowing only 2 MB files
    }
  });
};
const uploadFileMulter = () => {
  return multer({
    storage: multerS3Config,
    limits: {
      fieldSize: 25 * 1024 * 1024,
      fileSize: 1024 * 1024 * 30 // we are allowing only 30 MB files
    }
  });
};
const uploadFile = property => {
  return compose().use((req, res, next) => {
    const uploadFile = uploadFileMulter().single(property);
    return uploadFile(req, res, err => {
      if (err) {
        console.log(err);
        next({ message: err });
      }
      next();
    });
  });
};

const uploadImage = property => {
  return compose().use((req, res, next) => {
    const uploadImage = uploadImageMulter().single(property);
    return uploadImage(req, res, err => {
      if (err) {
        console.log(err);
        next({ message: err });
      }
      next();
    });
  });
};

const uploadImages = images => {
  return compose().use((req, res, next) => {
    console.log(images);
    const uploadImage = uploadImageMulter().fields(images);
    return uploadImage(req, res, err => {
      if (err) {
        console.log(err);
        next({ message: err });
      }
      next();
    });
  });
};

exports.uploadFile = uploadFile;
exports.uploadImage = uploadImage;
exports.uploadImages = uploadImages;
exports.removeFile = removeFile;
