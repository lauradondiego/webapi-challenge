const router = require("express").Router();
const express = require("express");
const dbAction = require("../data/helpers/actionModel");
const dbMappers = require("../data/helpers/mappers");
const dbProject = require("../data/helpers/projectModel");
router.use(express.json());
// router.use(validateProjectId);
// router.use(validateProjectPost);
// dont use this bc it makes every route need

router.get("/", (req, res) => {
  res.status(200).json({ api: "API is up and running!" });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  dbProject
    .getProjectActions(id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => next(error));
});

router.post("/", validateProjectPost, (req, res) => {
  const projectData = req.body;
  dbProject
    .insert(projectData)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error saving the project to the database"
      });
    });
  // why does it return actions:[] (an empty array value for action key)
});

router.put("/:id", validateProjectId, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name && !description) {
    return res.status(400).json({ error: "Requires some changes" });
  }
  dbProject
    .update(id, { name, description })
    .then(updated => {
      if (updated) {
        dbProject
          .get(id)
          .then(project => res.status(200).json(project))
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Error getting project" });
          });
      } else {
        res.status(404).json({ error: `Project with id ${id} not found` });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error updating project" });
    });
  // this needs to be condensed to use custom middleware
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  dbProject
    .remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ api: "delete request working", deleted });
      } else {
        res.status(404).json({
          message: "The project with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.send(500).json({
        error: "The project could not be removed"
      });
    });
});

// custom middelware functions //
function validateProjectPost(req, res, next) {
  if (Object.keys(req.body) < 1) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else if (!req.body.description) {
    res.status(400).json({ message: "missing required description field" });
  }
  next();
}

function validateProjectId(req, res, next) {
  const id = req.params.id;
  dbProject.get(id).then(userid => {
    if (userid) {
      req.user = req.body;
    } else {
      res.status(400).json({
        message: "invalid user id"
      });
    }
  });
  next();
}
module.exports = router;
