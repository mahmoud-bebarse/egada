// mongo db connection
const mongoose = require('mongoose');
require("dotenv").config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/db.json')[env];

const { _DBNAME, _PASSWORD, _USERNAME, _INSTANCE } = config;


//MongoDB Connection
const db = mongoose.connect(
    `mongodb+srv://${_USERNAME}:${_PASSWORD}@${_INSTANCE}.mongodb.net/${_DBNAME}?w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: true
    }
)
    .then(() => console.log('Connected to #bombya_db!'))
    .catch((err) => {
        console.log(err)
    })

exports.db = db;