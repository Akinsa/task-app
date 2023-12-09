const mongoose = require('mongoose')
const User = require('../model/user')
// const validator = require('validator')



mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true
}),
mongoose.connect(process.env.MONGODB, {
    useCreateIndex: true
}),
mongoose.connect(process.env.MONGODB, {
    useFindAndModify: false
})

