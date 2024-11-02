const { Router } = require("express");
const folderController = require("../controllers/folderController");

const router = Router();

router.get('/create', folderController.renderFolderForm);
router.get('/create/:parentId?', folderController.renderFolderForm);
router.post('/create/:parentId?/new', folderController.postFolder);
router.get('/:folderId/open', folderController.getFolderContent)
router.get('/:folderId/update', folderController.renderUpdateForm)
router.post('/:folderId/update', folderController.updateFolder)
router.post('/:folderId/delete', folderController.deleteFolder)

module.exports = router