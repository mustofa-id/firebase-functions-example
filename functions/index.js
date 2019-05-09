const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const love = require('./routes/love')

const app = express()
const version = 'v1'
const path = route => `/${version}/${route}`

app.use(cors({ origin: true }))
app.use(express.json())
app.use(path('love'), love)

exports.v1 = functions.https.onRequest(app)
