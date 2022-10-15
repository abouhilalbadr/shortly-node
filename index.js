const express = require('express')
const cors = require('cors')

const app = express()

const indexRoute = require('./routes/index')
const shortlyRoute = require('./routes/shortly')

require('dotenv').config()
// Use CORS
app.use(cors())

// Use JSON req/res
app.use(express.json())

// Use url endcoded
app.use(express.urlencoded({
  extended: true
}))


app.use('/', indexRoute)
app.use('/api/url', shortlyRoute);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));