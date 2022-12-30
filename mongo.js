const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide password as an argument: node mongo.js <password> <name> <number>')
    process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://magnusindregard:${password}@cluster0.nypth0n.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
  
const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    console.log('To post new entries, alse provide name and number as arguments: node mongo.js <password> <name> <number>')
    mongoose
        .connect(url)
        .then((result) => {
            console.log('Phonebook')
            console.log(result)
            Person.find({})
                .then(result => {
                    result.forEach(person => {
                    console.log(person)
                })
            mongoose.connection.close()
        })
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    mongoose
    .connect(url)
    .then((result) => {

        console.log(result)
        const person = new Person({
        name: name,
        number: number
        })

        return person.save()
    })
    .then(() => {
        console.log(`Added ${name} number ${number} to the phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}









