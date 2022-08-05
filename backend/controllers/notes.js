const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Notes = mongoose.model('notes');
const Users = mongoose.model('users');

router.get("/", async (req, res) => {
  if (!("id" in req.query)) {
    res.send("Access denied");
    return;
  }
  try {
    const user = await Users.findById(req.query.id);
  }
  catch {
    res.send("User not found");
    return;
  }

  if ("title" in req.query) {
    Notes.find(
      { "title": { "$regex": req.query.title, "$options": "i" }, user_id: req.query.id },
      function (err, docs) {
        res.json(docs)
      }
    );
  }
  else if ("is_pinned" in req.query) {
    Notes.find(
      { "is_pinned": req.query.is_pinned, user_id: req.query.id },
      function (err, docs) {
        res.json(docs)
      }
    );
  }
  else if ("tag" in req.query) {
    Notes.find(
      { "tags": { "$regex": req.query.tag, "$options": "i" }, user_id: req.query.id },
      function (err, docs) {
        res.json(docs)
      }
    );
  }
  else {
    Notes.find({ user_id: req.query.id }, (err, row) => {
      res.json(row);
    });
  }

});

router.get("/:id", async (req, res) => {
  if (!("id" in req.query)) {
    res.send("Access denied");
    return;
  }
  try {
    const user = await Users.findById(req.query.id);
  }
  catch {
    res.send("User not found");
    return;
  }
  
  Notes.find({ user_id: req.query.id, _id: req.params.id }, (err, row) => {
    res.json(row);
  });
});


router.post("/", async (req, res) => {
  if (!("id" in req.query)) {
    res.send("Access denied");
    return;
  }
  try {
    const user = await Users.findById(req.query.id);
  }
  catch {
    res.send("User not found");
    return;
  }

  req.body.user_id = req.query.id;
  Notes.create(req.body, (err, row) => {
    res.json(row); //.json() will send proper headers in response so client knows it's json coming back
  });
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.query.id);
  }
  catch {
    res.send("User not found");
    return;
  }

  Notes.findOneAndDelete({_id: req.params.id, user_id: req.query.id}, (err, row) => {
    res.json(row);
  });
});

router.put("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.query.id);
  }
  catch {
    res.send("User not found");
    return;
  }
  
  Notes.findOneAndUpdate({_id: req.params.id, user_id: req.query.id}, req.body, (err, row) => {
    res.json(row);
  });
});

module.exports = router;
