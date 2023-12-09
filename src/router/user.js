const express = require('express')
const User = require('../model/user')
const router = new express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancellationEmail} = require('../email/account')
const multer = require('multer')
const sharp = require('sharp')

router.post('/user', async (req, res) => {
    const user = new User(req.body)
    

    try {
        
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }

})



router.post('/user/login', auth, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(req.body);

        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
      res.status(400).send();
    }
});


// router.post('.user.login', async(req, res) => {
//     try {

//     }
// })


router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send('successfullly loggedout')
    } catch (e) {
        res.status(500).send()
    }
})


router.post('/user/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('successfully')
    } catch(e) {
        res.status(500).send(e)
    }
})


router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
    // try{
    //     const user = await User.find({})
    //     res.status(200).send(user)
    // } catch(e) {
    //     res.status(400).send(e)
    // }
})


router.get('/user/:id', async (req, res) => {
    const _id = req.params.id


    try {
        const user = await User.findById(_id)

        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    }catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/user/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/user/me', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id)


        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
        // await req.user.remove()
        // res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    // dest: 'avatar',
    limit: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg|PNG)$/)) {
            return cb(new Error('please upload an Image'))
        }
        cb(undefined, true)
    }
})

router.post('/user/me/avatar', auth, upload.single('avatar'), async  (req, res)=> {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()


    req.user.avatar = buffer
    await req.user.save()
    res.send()  
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


router.delete('/user/me/avatar', auth, async(req, res) => {
    req.user.avater = undefined
    await req.user.save()
    res.send()
})


router.get('/user/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.param.id)
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send(e)
    }
})
module.exports = router