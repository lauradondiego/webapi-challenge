const router = require("express").Router();
const express = require("express");
const dbAction = require("../data/helpers/actionModel");
const dbMappers = require("../data/helpers/mappers");
const dbProject = require("../data/helpers/projectModel");
router.use(express.json());
// server.use(validateUserId); dont forget to add in what youre using
router.use(validateActionPost);
// server.use(validatePost);

router.get("/", (req, res) => {
  res.status(200).json({ api: "API is up and running!" });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  dbAction
    .get(id)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(error => next(error));
});

router.post("/", validateActionPost, (req, res) => {
  const actionData = req.body;
  dbAction
    .insert(actionData)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error saving the user to the database"
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  const update = req.body;

  dbAction
    .update(id, update)
    .then(updated => {
      res.status(200).json({ api: "update is working", updated });
    })
    .catch(error => {
      res.send(500).json({
        error: "The user information could not be modified."
      });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  dbAction
    .remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ api: "delete request working", deleted });
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.send(500).json({
        error: "The post could not be removed"
      });
    });
});

// custom middelware functions //
function validateUserId(req, res, next) {
  if (Object.keys(req.body) < 1) {
    res.status(400).json({ message: "missing update data" });
  } else if (!req.body.project_id) {
    res.status(400).json({ message: "null" });
  }
  //   dbAction.getById(id).then(userid => {
  //     if (userid) {
  //       req.user = req.body;
  //     } else {
  //       res.status(400).json({
  //         message: "invalid user id"
  //       });
  //     }
  //   });
  next();
}

function validateActionPost(req, res, next) {
  if (Object.keys(req.body) < 1) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.project_id) {
    res.status(400).json({ message: "missing required project ID field" });
  } else if (!req.body.description) {
    // or if it is > 128 characters
    res.status(400).json({ message: "missing required description field" });
  } else if (!req.body.notes) {
    res.status(400).json({ message: "missing required notes field" });
  }
  next();
}

module.exports = router;
