const Joi = require('Joi')

//adding film validation
const addingFilmSchema = Joi.object({
    name: Joi.string().min(1).required().max(100).normalize(),
    year: Joi.number().integer().min(1850).max(2020).required(),
    format: Joi.string().min(3).required(),
    actors: Joi.string().required().min(2).max(100)
})

module.exports = addingFilmSchema