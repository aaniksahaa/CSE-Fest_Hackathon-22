const mongoose = require("mongoose");
const submissionsSchema = new mongoose.Schema({
   exam: String,
   question: String,
   ans: String,
   user_id: String
});
const Submissions = mongoose.model("submissions", submissionsSchema);
module.exports = Submissions;
