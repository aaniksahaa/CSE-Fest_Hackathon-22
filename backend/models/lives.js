const mongoose = require("mongoose");
const livesSchema = new mongoose.Schema({
   exam: String,
   user_id: String,
   start: Number,
   end: Number,
});
const Lives = mongoose.model("lives", livesSchema);
module.exports = Lives;

