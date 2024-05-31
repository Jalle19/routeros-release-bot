import yargs from 'yargs'
import Discord from 'discord.js'
import { filterItems, parseRssFeed } from './feed.mjs'
import { createDiscordMessage } from './discord.mjs'
import { RELEASE_FEED_URL } from './constants.mjs'

const argv = yargs(process.argv.slice(2))
    .usage('node $0 [options]')
    .options({
        'rssPath': {
            description: 'The URL or file path to the RSS feed',
            default: RELEASE_FEED_URL,
            alias: 'r',
        },
        'channel': {
            description: 'The release channel (stable or testing)',
            demand: true,
            alias: 'c',
        },
        'releasedSince': {
            description: 'Process releases released since this timestamp',
            default: undefined,
            alias: 's',
        },
    }).argv

// Parse the given timestamp into a Date. If no timestamp or an invalid timestamp is given, use
// current time
let releasedSince

if (argv.releasedSince && !isNaN(new Date(argv.releasedSince).getTime())) {
    releasedSince = new Date(argv.releasedSince)
} else {
    releasedSince = new Date()
}

// Create a Discord client and connect
const discordClient = new Discord.Client()
discordClient.login(process.env.DISCORD_TOKEN)

discordClient.once('ready', async () => {
    // Parse the RSS feed into a list of release items
    const feed = await parseRssFeed(argv.rssPath)
    const items = filterItems(feed.items, argv.channel, releasedSince)

    // Look up the channel
    const channel = await discordClient.channels.fetch(process.env.DISCORD_CHANNEL_ID)

    // Send one message for release (usually there's zero or one, but sometimes there are two releases within a day)
    for (const item of items) {
        const title = item.title

        // The raw change log is pretty badly formatted so we need to touch it up
        const changeLog = item['content:encodedSnippet']

        // Format the message for sending to the channel
        const message = createDiscordMessage(title, changeLog, argv.channel)

        console.log(message)
        await channel.send(message)
    }

    // The Discord client starts an infinite loop that apparently can't be exited just like that
    process.exit(0)
})
