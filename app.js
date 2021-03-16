const express = require('express')
const mongoose = require('mongoose')
const keys = require('./keys')
const app = express()


app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/', require('./routes/api/films'))


start()
async function start() {
    try {
        await mongoose.connect(keys.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(console.log('DB CONNECTED!'))

        const PORT = process.env.PORT || 9999
        app.listen(PORT, () => console.log(`App is running on port: ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
