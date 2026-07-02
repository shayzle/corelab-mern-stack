const express = require("express");
const router = express.Router();

const {getPendingUsers, approveUser, rejectUser} = require("../controllers/admin.controller");
const {protect, isAdmin} = require("../middleware/auth.middleware");


router.get("/pending-users", protect, isAdmin, getPendingUsers);

router.patch("/approve/:id", protect, isAdmin, approveUser);

router.patch("/reject/:id", protect, isAdmin, rejectUser);


module.exports = router;