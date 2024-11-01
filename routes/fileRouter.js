const { Router } = require("express");
const fileController = require('../controllers/fileController');
const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const router = Router();

router.get('/upload/:folderId?', fileController.renderUploadPage);
router.post('/upload/:folderId?/new', upload.single('file'), fileController.postFile);
router.get('/:fileId/open', fileController.getFile);

module.exports = router;