const express = require("express");
const router = express.Router();
const multer = require("multer");
const { importUsers, getUsers, getUser, deleteUser, updateUser, updatePassword, getApprovedStudents, firstLoginFalse } = require("../controllers/user.controller");
const { protect, isAdmin } = require("../middleware/auth.middleware");  //Middleware

const upload = multer({ storage: multer.memoryStorage() });


router.post("/import", protect, isAdmin, upload.single("file"), importUsers);
router.get("/", protect, isAdmin, getUsers);
router.get("/students", protect, getApprovedStudents);
router.get("/:id", protect, getUser);
router.delete("/:id", protect, isAdmin, deleteUser);
router.patch("/:id", protect, isAdmin, updateUser);
router.patch("/:id/password", protect, updatePassword);
router.patch("/:id/firstlogin", protect, isAdmin, firstLoginFalse);

module.exports = router;