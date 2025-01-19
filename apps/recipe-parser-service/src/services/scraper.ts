import * as cheerio from 'cheerio'

export async function scrapeWebpage(url: string): Promise<string> {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove unnecessary elements that might confuse the AI
    $('script').remove()
    $('style').remove()
    $('nav').remove()
    $('header').remove()
    $('footer').remove()

    // Get the main content
    const content = $('main').text() || $('article').text() || $('body').text()
    console.log(content.trim())
    return content.trim()
}