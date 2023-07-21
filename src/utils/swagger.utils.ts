import { Express, Request, Response } from 'express'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import {version} from '../../package.json'

const options: swaggerJsDoc.Options  = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Single Service API Docs',
            version
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: 
        [{
            BearerAuth: [],
        }]
    },
    apis: ['src/routes.ts', 'src/controller/*.ts', 'src/middlewares/*.ts']
}

const swaggerSpec = swaggerJsDoc(options)

export function swaggerDocs(app: Express, port: number) {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

    app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })

    console.log(`Docs available at http://localhost:${port}/api-docs`)
}
