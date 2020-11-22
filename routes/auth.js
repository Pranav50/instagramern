const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:"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"
    }
}))

router.get('/protected',requireLogin, (req, res) => {
    res.send('Hello Pranav')
})

router.post('/signup', (req, res) => {
    const {name, email, pass} = req.body
    if(!name || !email || !pass) {
        res.json({
            error:'Please add all fields'
        })
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json({error: 'User already exists with that email'})
        }
        bcrypt.hash(pass, 12)
        .then(hashedpassword => {
            const user = new User({
                email,
                pass:hashedpassword,
                name
            })
            user.save()
            .then(user => {
                transporter.sendMail({
                    to:user.email,
                    from:"bixav27158@ezeca.com",
                    subject:"signup success",
                    html: "<h1>Welcome to Instagram</h1>"

                })
                res.json({message:'Successfully Saved'})
                console.log('EMAIL', user.email)
            })
            .catch(err => {
                console.log(err)
            });
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const {email, pass} = req.body

    if(!email || !pass) {
        return res.status(422).json({error: 'Please provide email or password'})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser) {
            return res.status(422).json({error: 'Invalid email or password'})
        }
        bcrypt.compare(pass, savedUser.pass)
        .then(doMatch => {
            if(doMatch) {
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id, email, name, following, followers, image} = savedUser
                res.json({token, user: {_id, name, email, following, followers, image}})
            } else {
                return res.status(422).json({error: 'Invalid email or password'})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
})

module.exports = router