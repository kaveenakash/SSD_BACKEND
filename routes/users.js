const router = require("express").Router();
// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser,
  testInAuthUtils,
} = require("../utils/Auth");

const { tokenVerify } = require("../utils/TokenVerification.js");

const {
  saveMessage,
  saveMessageAndFile,
} = require("../controllers/MessageController");
const fileUpload = require("../middlewares/file-upload");

// Users Login Route
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

// Users Registeration Route
router.post(
  "/register-user",
  tokenVerify,
  checkRole(["admin"]),
  async (req, res) => {
    await userRegister(req.body, "user", res);
  }
);


// Super Admin Registration Route
router.post(
  "/register-super-admin",
  tokenVerify,
  checkRole(["admin"]),
  async (req, res) => {
    await userRegister(req.body, "superadmin", res);
  }
  );
  
  // Admin Registration Route
  router.post("/register-admin", async (req, res) => {
    await userRegister(req.body, "admin", res);
  });

// Users Protected Route
router.post(
  "/save-message",
  tokenVerify,
  checkRole(["user", "admin"]),
  saveMessage
);

// Super Admin Protected Route
router.post(
  "/save-message-file",
  tokenVerify,
  fileUpload.single("document"),
  checkRole(["superadmin", "admin"]),
  saveMessageAndFile
);

module.exports = router;
