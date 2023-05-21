const express = require("express");
const {
  allUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const { verifyToken, verifyAdmin ,  verifySelf} = require("../utils/authentication");

const router = express.Router();

router.route("/allUsers").get(verifyToken, verifyAdmin, allUsers);
router
  .route("/:id")
  .get(verifyToken, getUser)
  .put(verifyToken, verifySelf ,updateUser)
  .delete(verifyToken, verifySelf,deleteUser);

router.route("/admin/:id").delete(verifyToken, verifyAdmin, deleteUser);

module.exports = router;
