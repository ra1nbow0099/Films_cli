const program = require('commander')
const addingFilmSchema = require('./middlewares/validation')
const {prompt } = require('inquirer')
const axios = require('axios');

const film_formats = ['DVD', 'VHS', 'BLU-RAY']
//Questions to add film
questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Film name'
    },
    {
        type: 'input',
        name: 'year',
        message: 'Release date'
    },
    {
        type: 'list',
        name: 'format',
        message: 'Choose film format',
        choices: film_formats
    },
    {
        type: 'input',
        name: 'actors',
        message: 'Film actors'
    },
]

program
    .version('1.0.0')
    .description('Films CLI')

//Getting all films in cli
program
    .command('get')
    .alias('g')
    .description('All films')
    .action(() => {
        axios.get('http://localhost:9999/api')
            .then( data => {
                console.info(data.data)
            });
    })

//Add new film
program
    .command('add')
    .alias('a')
    .description('Add film')
    .action(() => {
        prompt(questions).then(answers => {
            //validation
            const {error} = addingFilmSchema.validate(answers)
            if(error){
                return console.info(error.message)
            }

                axios.post('http://localhost:9999/api', {
                name: answers.name,
                year: answers.year,
                format: answers.format,
                actors: answers.actors
                })
            console.info('saved!')
        })
    })

//Delete film by ID
program
    .command('delete <id>')
    .alias('d')
    .description('Delete film')
    .action( id => {
        axios.delete(`http://localhost:9999/api/delete/${id}`, {
            _id: id
        })
        .then(() => console.info('Deleted!'))
    })


//Find film by the name of film or an actor
program
    .command('find <value>')
    .alias('f')
    .description('Find film')
    .action( value => {
        axios.get(`http://localhost:9999/api/findFilm/${value}`, {
           $or: {name: value.trim()} || {actors: value.trim()}
        })
        .then((data) => console.info(data.data))
    })

program
    .command('upload')
    .alias('u')
    .description('upload file with films! (.txt)')
    .action(() => {
        console.info('http://localhost:9999/file')
    }
    )
program.parse(process.argv)