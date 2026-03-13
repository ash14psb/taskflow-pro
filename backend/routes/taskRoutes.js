const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

// Handle specific task updates and deletions
router
  .route("/:id")
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

// We keep this specific one for the quick drag-and-drop
router.route("/:id/status").patch(taskController.updateTaskStatus);

module.exports = router;
