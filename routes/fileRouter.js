const { Router } = require("express");
const fileController = require("../controllers/fileController");

const router = Router();

router.get("/upload/:folderId?", fileController.renderUploadPage);
router.post(
  "/upload/:folderId?/new",
  fileController.postFileToMulter,
  fileController.postFileToCloudinary,
  fileController.postFile
);
router.get("/:fileId/open", fileController.getFile);
router.get("/:fileId/download", fileController.downloadFile);
router.post(
  "/:fileId/delete",
  fileController.deleteFileFromCloudinary,
  fileController.deleteFile
);

module.exports = router;
