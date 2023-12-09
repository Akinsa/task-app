const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    }, 
    password: {
        type: String,
        required: true,
        minlenght: 8,
        maxlenght: 15,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error ('password must not contain "password"')
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if(value <= 18) {
                throw new Error('Age must be greater than 18')
            }
        },
        default: 0
    },
    avatar: {
        type: Buffer
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true 
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
     foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    // delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async  function () {
    const user = this 

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECCRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


// userSchema.methods.generateAuthToken = async function () {
//   const user = this;

//   const token = jwt.sign({ _id: user._id.toString() }, secretKey);

//   user.tokens = user.tokens.concat({ token })
//   await user.save()
//   return token;
// };



userSchema.static.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email, password })


    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


// hash the plain password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }


    next()
})


// delete user tasks when user is removed

userSchema.pre('tremove', async function (next) {
    const user = this 
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)



module.exports = User

