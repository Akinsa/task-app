const express = require('express')
const router = new express.Router()
const app = express()

const port = process.env.PORT || 3000

router.post('/user', async (req, res) => {
    const user = new User(req.body)

    try {
        await user()
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/user', async (req, res) => {
    

    try {
        const user = await User.find({})
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/user/:id', async (req, res) => {
    const _id = req.params.id
    
    try {
        const user = await User.findById(_id)

        if(!user) {
            return req.status(404).send()
        }
        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.para.id, req.body, {new: true, runValidators: true})

        if(!user) {
            return res.status(404).send()
        }
        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})


router.delete('/user/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user) {
            res.status(404).send()
        }
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})


mongoose.connet('mongodb://127.0.0.1:27017/monndr', {
    useNewUrlParser: true
}),
mongoose.connext('mongodb://127.0.0.1:27017/monndr',{
    useCreateIndex: true
}),
mongoose.connect('mongodb://127.0.0.1:27017/monndr', {
    useFindAndModify: true
})


app.listen(port, () => {
    console.log('server is on port' + port)
})