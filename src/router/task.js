const express = require('express')
const Task = require('../model/task')
const auth = require('../middleware/auth')
const router = new express.Router()




router.post('/task', auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(200).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/task', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    

    if(req.query.sortBy) {
        const parts = req.query.sortBy(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        const task = await Task.find({ owner: req.user._id})
    
        // res.status(200).send(task)

        // await req.user.populate({
        //     path,
        //     match,
        //     options: {
        //         limit: parseInt(req.query.limit),
        //         skip: parseInt(req.query.skip),
        //         sort
        //     }
           
        // }).exec()
        res.status(200).send(task)
        res.send(req.user.tasks)
        
    } catch(e) {
        res.status(500).send(e)
    }
})


router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)

        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send
    }
})

router.patch('/task/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)

        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        if(!task) {
            return res.status(404).send()
        }


        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()


        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.delete('/task/:id',auth,  async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})











module.exports = router


// router.post('/way', async (req, res) => {
//     const way = new Way(req.body)

//     try {
//         await way.save()
//         res,
//     }
// })