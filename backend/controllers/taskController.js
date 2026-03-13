const Task = require("../models/Task");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user.id }).sort("createdAt");
  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const newTask = await Task.create({
    title: req.body.title,
    status: req.body.status,
    priority: req.body.priority || "medium",
    workspace: req.body.workspace || "Personal",
    user: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: { task: newTask },
  });
});

exports.updateTaskStatus = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { status: req.body.status },
    { new: true, runValidators: true },
  );

  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { task },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!updatedTask) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { task: updatedTask },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
