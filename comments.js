// Create web server

// All routes in this file start with /comments
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { Comment, User } = require("../models");
const { asyncHandler } = require("../utils");

// Get all comments
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const comments = await Comment.findAll({
      include: User,
    });
    res.json(comments);
  })
);

// Get a specific comment
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id, {
      include: User,
    });
    res.json(comment);
  })
);

// Create a comment
router.post(
  "/",
  [
    check("body").exists({ checkFalsy: true }).withMessage("Please provide a value for the comment body"),
    check("userId").exists({ checkFalsy: true }).withMessage("Please provide a value for the user ID"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Map over the errors array and return a new array of error messages
      const errorMessages = errors.array().map((error) => error.msg);
      // Return the validation errors to the client
      res.status(400).json({ errors: errorMessages });
    } else {
      const comment = await Comment.create(req.body);
      res.status(201).json(comment);
    }
  })
);

// Update a comment
router.put(
  "/:id",
  [
    check("body").exists({ checkFalsy: true }).withMessage("Please provide a value for the comment body"),
    check("userId").exists({ checkFalsy: true }).withMessage("Please provide a value for the user ID"),
  ],
  asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    if (comment) {
      await comment.update(req.body);
      res.status(204).end();
    } else {
      const err = new Error("Comment not found");
      err.status = 404;
      err.message = "Comment not found";
      throw err;
    }
  })
);

// Delete a comment
router.delete(
  "/:id",
