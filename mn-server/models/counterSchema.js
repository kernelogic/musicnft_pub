/**
 * Maintain user ID auto increment
 * 
 * Please insert one doc first before using, or Counter.findOneAndUpdate will be null
 * 
 * {
 *      _id: 'userId',
 *      sequence_value: 1000001
 * }
 */
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    _id: String,
    sequence_value: Number
})

module.exports = mongoose.model("counter", userSchema, "counters")