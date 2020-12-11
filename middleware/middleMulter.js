const multer = require('multer');
const fs = require('fs');
const path = require('path');

const funcMulter = (storage) => {
  try {
    fs.readdirSync(`public/uploads/${storage}`);
  } catch (error) {
    console.error('storage 폴더를 생성합니다');
    fs.mkdirSync(`public/uploads/${storage}`);
  }

  return multer({
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, `public/uploads/${storage}/`);
      },
      filename(req, file, done) {
        const ext = path.extname(file.originalname);
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
};

module.exports = funcMulter;
