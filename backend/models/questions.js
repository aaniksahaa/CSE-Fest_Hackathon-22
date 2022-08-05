const mongoose = require("mongoose");
const questionScheme = new mongoose.Schema({
    text: String,
    image: String,
    options: Array,
    answer: Array,
    solution: Array,
    exam: String,
    tags: Array,
    tag: String,
    type: String,
});
const Questions = mongoose.model("questions", questionScheme);
module.exports = Questions;
