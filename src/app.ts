import express from 'express'
import routes from './routes'
import postgresSetup from './utils/postgres.connect'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotEnv from 'dotenv'
import { swaggerDocs } from './utils/swagger.utils'

const app = express()
dotEnv.config()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

(async () => {
  try {
    const db = await postgresSetup();
    swaggerDocs(app, 3000);

    routes(app, db);

    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server listening on port ${process.env.PORT || 3000}`)
    });
  
  } catch (error) {
    console.error('Failed to initialize Postgres:', error)
    process.exit(1)
  }
})();