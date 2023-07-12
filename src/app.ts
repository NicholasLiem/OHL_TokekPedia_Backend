import express from 'express'
import config from 'config'
import routes from './routes'
import postgresSetup from './utils/postgres.connect'
import cookieParser from 'cookie-parser'

const app = express()
const port = config.get<number>('port')

app.use(express.json());
app.use(cookieParser());

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