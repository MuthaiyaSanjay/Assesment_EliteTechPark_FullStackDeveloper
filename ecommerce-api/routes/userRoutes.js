const express = require("express"); 
const { getUsers, getUserById, updateUser, deleteUser, getUsersByRole } = require("../controllers/userController"); 
const authMiddleware = require("../middlewares/authMiddleware"); 
const roleMiddleware = require("../middlewares/roleMiddleware"); 
const router = express.Router();  

router.get("/", authMiddleware, roleMiddleware(["admin"]), getUsers);
router.get("/roles", authMiddleware, roleMiddleware(["admin"]), getUsersByRole);
router.get("/:id", authMiddleware, roleMiddleware(["admin", "self"]), getUserById);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "self"]), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

module.exports = router;
