const Router = require('express')
const {getFilms, addFilms, deleteFilms, findFilms, fileLoaderView, fileLoader} = require('../../controllers/films.controller')
const upload = require('../../middlewares/fileloader')
const router = Router()

//@route GET /
//@desc Get films
router.get('/api', getFilms)

//@route POST /
//@desc Add films
router.post('/api', addFilms)

//@route delete /:id
//@desc delete film
router.delete('/api/delete/:id', deleteFilms)

//@route get /:value
//@desc find film
router.get('/api/findFilm/:value', findFilms)


//@route GET /file
//@desc view to form
router.get('/file', fileLoaderView)

//@route POST /file
//@desc import *(films.txt) to db
router.post('/file', upload.single('file'), fileLoader)

module.exports = router