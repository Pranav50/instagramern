if(process.env.NODE_ENV==='production'){
    module.exports = require('./prod')
} else {
    module.exports = require('./dev')
}

module.exports = {
    MONGO_URI: "mongodb+srv://pranavinsta:mJuLkvAOU5286bSO@cluster0.mhggr.mongodb.net/<dbname>?retryWrites=true&w=majority",
    JWT_SECRET: 'khsdfhjskdi12kj'
}