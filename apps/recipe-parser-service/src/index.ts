import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { recipeRouter } from './routes/recipe'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/recipe', recipeRouter)
const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
