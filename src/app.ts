import express from 'express'
import config from 'config'
import routes from './routes'
import postgresSetup from './utils/postgres.connect'

const app = express()
const port = config.get<number>('port')

app.use(express.json());

(async () => {
  try {
    const db = await postgresSetup()
    routes(app, db)

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    });
  } catch (error) {
    console.error('Failed to initialize Postgres:', error)
    process.exit(1)
  }
})()