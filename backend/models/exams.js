const mongoose = require("mongoose");
const examSchema = new mongoose.Schema({
    name: String,
    tags: Array,
    start: Number,
    end: Number,
    type: String,
    duration: Number,
});
const Exams = mongoose.model("exams", examSchema);
module.exports = Exams;
