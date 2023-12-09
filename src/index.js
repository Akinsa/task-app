const express = require('express')
require('./db/mongoose')


const userRouter = require('./router/user')
const taskRouter = require('./router/task')


const app = express()

// const port = process.env.PORT || 1500
const port = process.env.PORT

// app.use((req, res, next) => {
//     if(req.method == 'GET'){
//         res.send('GET request are disabled')
//     } else {
//         next()
//     }
// })



// app.use((req, res, next) => {
//     res.status(503).send('site is currently down,')
// })



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


// const Task = require('./model/task')
// const User = require('./model/user')

// const main = async () => {
//     //  const task = await Task.findById('6570aecdfb525172c2fd08d2')
//     // // const task = await Task.findById('656f9f0e73ec582f028e8c4f')
//     // await task.populate('owner')

//     // console.log(task.owner)

//     const user = await User.findById('656f9f0e73ec582f028e8c4f')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()


const multer = require('multer')

const upload = multer({
    dest: 'images',
    limit: {
        fieSize: 1000000
    },
    fileFilter(req, file, cb) {
        // if(!file.originalname.endsWith('.pdf')) {
        //     return cb(new Error('please upload a PDF'))
        // }
        // cb(undefined, true)

        if(!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('plese upload a word docunmnet'))
        }
        cb(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next ) => {
    res.status(400).send({error: error.message})
})


const moob = multer({
    dest: 'pic',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, res, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('please upload a word documnet'))
        }
        cb(undefined, true)
    }
})

app.post('/moob', upload.single('moob'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})




























app.listen(port, () => {
    console.log('Server is on port ' + port)
})

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = await jwt.sign({_id: 'wertyuio'}, '1234567890poiuytrewq', {expiresIn: '5 seconds'})
//     console.log(token)

//     const data = await jwt.verify(token, '1234567890poiuytrewq')
//     console.log(data)
// }

// myFunction()


// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({_id: 'abc123'}, 'AkinsoyinuSamuel123456')
//     console.log(token)

//     const data = jwt.verify(token, 'AkinsoyinuSamuel123456')
//     console.log(data)
// }

// myFunction()