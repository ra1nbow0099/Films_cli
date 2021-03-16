const {Schema, model} = require('mongoose')

const FilmSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        default: 2000,
        required: true
    },
    format: {
        type: String,
        default: 'DVD',
        required: true
    },
    actors: {
        type: Array,
        required: true
    },
})

module.exports = model('Film', FilmSchema)