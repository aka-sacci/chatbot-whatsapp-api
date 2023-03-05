//Dependencies
import express from 'express'
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { router } = require("./router")
//const database = require('./database')

//App
const app = express()

//Config
//CORS
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

//Middlewares
//JSON CONVERTER
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Routes
app.use(router)

module.exports = app