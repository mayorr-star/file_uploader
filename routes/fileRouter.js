const { Router } = require("express");
const fileController = require('../controllers/fileController');
const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const router = Router();

router.get('/upload', fileController.renderUploadPage);
router.post('/upload/new', upload.single('file'), fileController.postFile)

module.exports = router;