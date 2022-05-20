# routeros-release-bot

A Discord bot that sends a message to a channel whenever it has detected a new release of Mikrotik RouterOS

## Features

* Designed to be run regularly (e.g. from cron)
* Only sends messages for releases newer than the specified date

## Usage

```
$ node src/routeros-release-bot.mjs --help
node routeros-release-bot.mjs [options]

Options:
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -r, --rssPath        The URL or file path to the RSS feed
                                  [default: "https://mikrotik.com/download.rss"]
  -c, --channel        The release channel (stable or testing)        [required]
  -s, --releasedSince  Process releases released since this timestamp
```

Here's a more concrete example:

```bash
RELEASED_SINCE=$(cat last_run.txt)
DISCORD_CHANNEL_ID=xxx DISCORD_TOKEN=yyy node src/routeros-release-bot.mjs -c stable -s $RELEASED_SINCE
date +%Y-%m-%dT%H:%M:%S.000Z > last_run.txt
```

## License

GNU General Public License, version 2 or later