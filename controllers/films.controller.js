const Film = require('../models/Film')
const fs = require('fs')
const addingFilmSchema = require('../middlewares/validation')

exports.getFilms = async (req, res) => {
    try{
        //Finding all films
        await Film.find()
        .sort({name: 1})
        .then(films => res.status(200).json(films))
    } catch (err) {
        console.log(err)
    }
}

exports.addFilms = async (req, res) => {
    try {
        const {error} = addingFilmSchema.validate(req.body)
        if(error){
            return res.send(error.message)
        }
        //If film is already exist
        const filmAlreadyExist = await Film.findOne({$and: [{name: req.body.name}, {year: req.body.year}, {format: req.body.format}]})
        if(filmAlreadyExist) {
            res.json('Film is already exist!')
        } else{
        //form input receiving
        const newFilm = new Film({
            name: req.body.name,
            year: req.body.year,
            format: req.body.format,
            actors: req.body.actors
        })
            await newFilm.save()
            .then(film => res.status(201).json(film))
            .catch(err => console.log(err))
    }
    } catch (err) {
        console.log(err)
    }
}

exports.deleteFilms = async (req, res) => {
    try {
        await Film.deleteOne({ "_id" : req.params.id})
        .then(() => res.status(200).json('deleted!'))
    } catch(err) {
        console.log(err)
    }
}

exports.findFilms = async (req, res) => {
    try{
        // Check if film is already exist
        const filmExist = await Film.findOne({$or: [{name : req.params.value.trim()}, {actors : req.params.value.trim()}]})
        if (filmExist) return res.status(200).send(filmExist)
        // if no films with this name
        res.json('Cannot find film!')
    } catch (err) {
        console.log(err)
    }
}

exports.fileLoaderView = async (req, res) => {
    try {
        res.render('upload')
    } catch(err) {
        console.log(err)
    }
}

exports.fileLoader = async (req, res) => {
    try {
        let fileData = await req.file;
        console.log(fileData);
        console.log(fileData.originalname.slice(-4));
        if (fileData.originalname.slice(-4) !== ".txt") {
          res.send("Неверный формат файла");
        } else if (fileData.size == 0) {
          res.send("Ошибка при загрузке файла, файл пустой!");
        }
      
        fs.readFile(req.file.path, "utf-8", function (error, data) {
          if (error) throw error;
      
          const text = data
            .replace(/Title:+/g, '"},{title:"')
            .replace(/Release Year:+/g, '",releaseYear:')
            .replace(/Format:+/g, ',format:"')
            .replace(/Stars:+/g, '",stars:"')
            .slice(3)
            .replace(/\s+/g, " ")
            .trim();
      
          const text2 = `${text}"}`;
      
          const text3 = JSON.parse(JSON.stringify(text2, null, 4));
      
          fs.writeFile("films.json", text3, function (error) {
            if (error) throw error;
            let data = fs.readFileSync("films.json", "utf-8");
      
            String.prototype.replaceAll = function (search, replacement) {
              var target = this;
              return target.replace(new RegExp(search, "g"), replacement);
            };
      
            var str =
              "{lat:55.74755013048941, lng:37.63388156890869},{lat:55.746245766551574, lng:37.63336658477783},{lat:55.746789256825124, lng:37.63115644454956}";
            data = data.replaceAll("title", '"title"');
            data = data.replaceAll("releaseYear", '"releaseYear"');
            data = data.replaceAll("format", '"format"');
            data = data.replaceAll("stars", '"stars"');
      
            var a = JSON.parse('{"obj":[' + data + "]}")
            a.obj.map(async (el) => {
              const film = new Film({
                name: el.title,
                year: el.releaseYear,
                format: el.format,
                actors: el.stars,
              });
              await film.save()
            });
          });
        });
      
        if (!fileData) res.send("Ошибка при загрузке файла");
        else res.send("Файл загружен");
    } catch (err) {
        console.log(err)
    }
}
