const express = require('express');
const app = express();
const mongoose = require('mongoose')
const {MONGO_URI} = require('./config/keys')
const PORT = process.env.PORT || 5000

// pass: mJuLkvAOU5286bSO

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.connection.on('connected', () => {
    console.log('Connected to Mongo!!!!')
})

mongoose.connection.on('error', (err) => {
    console.log('Error in Mongo!!!!', err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production") {
    app.use(express.static('frontend/build'))
    const path = require('path')
    app.get("*", (req, res) =>{
        res.sendFile(path.resolve(__dirname,'frontend','build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})