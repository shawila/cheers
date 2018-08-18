const PubNub = require('pubnub')
const tmi = require('tmi.js')

const express = require('express')
const PORT = process.env.PORT || 5000

express()
  .get('/', (req, res) => res.send('Cheers catbot deployed successfully!'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

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

// Init pubnub
const subscribeKey = process.env.PUBNUB_SUBSCRIBE_KEY
const publishKey = process.env.PUBNUB_PUBLISH_KEY
const pubnub = new PubNub({ publishKey , subscribeKey })

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
  const publishConfig = {
    channel: 'cheers',
    message: {
      chatbot: 'cheers'
    }
  }
  pubnub.publish(publishConfig, (status, response) => {
    console.log(status, response)
    console.log('robot call ----> end')
  })
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

// Ping our heroku app every 5 minutes so it stays awake
var http = require('http');
setInterval(() => {
  console.log('Poke ...')
  http.get('http://cheers-chatbot.herokuapp.com')
}, 300000)
