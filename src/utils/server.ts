import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { serveStatic } from 'hono/bun'
import { ZodError } from 'zod'
import { logger } from './logging'
import { routes } from '../routes'
import { apiKeyAuth } from '../middleware/apiKey.middleware'

const createServer = () => {
  const app = new Hono()

  // Serve static files
  app.use('*', serveStatic({ root: './public' }))

  // Middleware API key, kecualikan /auth/generate-api-key
  app.use(apiKeyAuth(['/api/health', '/api/generate-api-key']) as any)

  // Setup routes
  routes(app)

  // Error handler
  app.onError(async (err, c) => {
    if (err instanceof HTTPException) {
      logger.error(err.message)

      c.status(err.status)
      return c.json({
        status: false,
        statusCode: err.status,
        message: err.message
      })
    } else if (err instanceof ZodError) {
      logger.error(err.message)

      c.status(400)
      return c.json({
        status: false,
        statusCode: 400,
        message: err.message
      })
    } else {
      logger.error(err.message)

      c.status(500)
      return c.json({
        status: false,
        statusCode: 500,
        message: err.message
      })
    }
  })

  return app
}

export default createServer
