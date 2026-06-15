/**
 * 炼金失控反应炉 - API 服务器
 */

import express, {
  type Request,
  type Response,
} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import chemistRoutes from './routes/chemists.js'
import questionRoutes from './routes/questions.js'
import gameRoutes from './routes/game.js'
import funFactRoutes from './routes/funFacts.js'
import elementRoutes from './routes/elements.js'
import elementFactRoutes from './routes/elementFacts.js'
import periodicGameRoutes from './routes/periodicGame.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const distPath = path.join(__dirname, '../dist')
app.use(express.static(distPath))

/**
 * API Routes
 */
app.use('/api/chemists', chemistRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/fun-facts', funFactRoutes)
app.use('/api/elements', elementRoutes)
app.use('/api/element-facts', elementFactRoutes)
app.use('/api/periodic-game', periodicGameRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (_req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, _req: Request, res: Response) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * SPA 前端路由支持
 */
app.get('*', (_req: Request, res: Response) => {
  const indexPath = path.join(distPath, 'index.html')
  res.sendFile(indexPath)
})

export default app
