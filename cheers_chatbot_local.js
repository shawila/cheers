const http = require('http')
const tmi = require('tmi.js')

// Valid commands start with:
let commandPrefix = '!'
// Define configuration options:
let opts = {
  identity: {
    username: 'Cheers',
    password: process.env.TWITCH_TOKEN
  },
  channels: [
    'tahsoos'
  ]
}

// These are the commands the bot knows (defined below):
let knownCommands = { tip }

// Function called when the "tip" command is issued:
function tip (target, context, params) {
  let msg = 'bobsuruncle has donated 5$'
  // If there's something to print:
  if (params.length) {
    msg += params.join(' ')
  }
  // Send it back to the correct place:
  sendMessage(target, context, msg)

  // Send API call to robot arm
  console.log('robot call ----> start')
  http.get('http://dex.local:8080', (res) => {
    const { statusCode } = res
    console.log('status', statusCode)
    res.on('end', () => console.log('robot call ----> end'))
  }).on('error', (err) => { console.log("robot call ----> error: " + err.message) })
}

// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message)
  } else {
    client.say(target, message)
  }
}

// Create a client with our options:
let client = new tmi.client(opts)

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  if (msg.toLowerCase().includes('donated')) {
    setTimeout(() => sendMessage(target, context, 'THIS WILL TRIGGER THE API CALL'), 2000)
    return
  }

  if (self) { return } // Ignore messages from the bot

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
    return
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.splice(1)

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName]
    // Then call the command with parameters:
    command(target, context, params)
    console.log(`* Executed ${commandName} command for ${context.username}`)
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`)
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Disconnected: ${reason}`)
  process.exit(1)
}

const express = require('express')
const app = express()

app.post('/', (req, res) => {
  sendMessage('#tahsoos', {}, 'bobsuruncle has donated 5$')
  res.send('ok')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
