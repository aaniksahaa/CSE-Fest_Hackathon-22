const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
    title: String,
    text: String,
    tags: String,
    is_pinned: Boolean,
    user_id: String,
});
const Notes = mongoose.model("notes", noteSchema);
module.exports = Notes;
