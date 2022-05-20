import { DISCORD_MESSAGE_MAX_LENGTH} from './constants.mjs'

export const createDiscordMessage = (title, changelog, releaseChannel) => {
    let message = `There is a new version of RouterOS in the "${releaseChannel}" release channel:` + '\n\n' +
        `**${title}**` + '\n\n' +
        '```' + changelog + '```'

    // Truncate the message to to avoid "content: Must be 4000 or fewer in length."
    if (message.length > DISCORD_MESSAGE_MAX_LENGTH) {
        const notice = "```\nThis message has been truncated to fit in a Discord message, some change log entries may be missing"

        message = message.substring(0, DISCORD_MESSAGE_MAX_LENGTH - notice.length) + notice
    }

    return message
}