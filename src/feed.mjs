import fs from 'fs'
import Parser from 'rss-parser'

export const parseRssFeed = async (feedPathOrUrl) => {
    const rssParser = new Parser()

    if (feedPathOrUrl.startsWith('http')) {
        return await rssParser.parseURL(feedPathOrUrl)
    } else {
        const feedContents = fs.readFileSync(feedPathOrUrl).toString()

        return await rssParser.parseString(feedContents)
    }
}

export const filterItems = (items, channel, releasedSince) => {
    return items.filter((item) => {
        // Exclude releases that are not for the stable channel
        const isStableRelease = item.title.toLowerCase().includes(channel)

        // Exclude items published before "releasedSince"
        const isReleaseRelevant = new Date(item.pubDate).getTime() > releasedSince.getTime()

        return isStableRelease && isReleaseRelevant
    })
}

export const formatDescription = (description) => {
    // Fix double line-breaks (one raw break, one converted from <br />)
    return description.replace(/\n\r\n/g, '\r\n')
}