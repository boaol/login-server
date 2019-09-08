import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'

import apiRouter from './api'
import db from './models'

const app = express()
const port = 3000

let server = db.sequelize
  .sync({
    force: false
  })
  .then(() => {
    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    // app.use(morgan('tiny'))

    morgan.token('body', function(req, res) {
      return JSON.stringify(req.body)
    })

    app.use(morgan(':method :url :status :body - :response-time ms'))

    /**
     * api router
     */
    app.use('/api', apiRouter)

    /**
     * 404 route not found
     */
    app.use((req, res) => {
      res.json('404 - Not found')
    })

    return app.listen(port, () => console.log(`App listening on port ${port}!`))
  })

export default server
