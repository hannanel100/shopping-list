import { Hono } from 'hono'
import { z } from 'zod'
import { scrapeWebpage } from '../services/scraper'
import { extractIngredients } from '../services/parser'

const router = new Hono()

const urlSchema = z.object({
    url: z.string().url()
})

router.post('/parse', async (c) => {
    const body = await c.req.json()
    const result = urlSchema.safeParse(body)

    if (!result.success) {
        return c.json({ error: 'Invalid URL' }, 400)
    }

    const { url } = result.data
    const content = await scrapeWebpage(url)
    const ingredients = await extractIngredients(content, url)

    return c.json({ ingredients })
})

export { router as recipeRouter }