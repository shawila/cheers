Welcome!

This repo will setup a Twitch chatbot that listens to donations, and pass a call to a BrickPi attached to LEGO Mindstorms robot arm to move.

The first step is of course to [clone](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) this repo.

# Twitch chatbot

## Install Node.js

Follow the instructions [here](https://nodejs.org/en/download/package-manager/#nvm) to install Node.js

## Setup

### Install dependencies

After that's done run `npm install` to install dependencies.

### Twitch token

Finally, we need to generate our Twitch channel's oauth token. The easiest (but not suitable for production!) way would be to access this [url](https://twitchapps.com/tmi/) and generate a token there.

Set this token as an environment variable `export TWITCH_TOKEN="GENERATED_TOKEN"` (replace GENERATED_TOKEN with the generated one :) ).

## Run the chatbot

`node cheers_bot.js` should run the chatbot.

## Test the chatbot

Go to your Twitch channel, and type `!tip` in chat, the chatbot should answer.

# Robot arm

## Setup BrickPi

Dexter Industries have a great step-by-step [tutorial](https://www.dexterindustries.com/BrickPi/brickpi3-getting-started/) on how to setup your BrickPi.

## Build your robot arm

I will include some photos of the arm I prepared, but the important part is to connect the motor to port A (more on this in the code section below).

## Code for the robot arm

Follow the instructions to connect to your BrickPi.
My preferred way is by ssh `ssh pi@dex.local`. The default credentials are `robots1234`.

The next step is copy the code from `cheers_robot_arm.py` into the file `~/cheers_robot_arm.py` then run it with `python ~/cheers_robot_arm.py`.

## Tinkering with the bot timing

If we want to fix the movement, we will need to change code in the `pull` function.

The comments should be sufficient to know what needs changing.

## Test the robot arm code

Open your browser to the following url `http://dex.local:8080`. If all goes well, you should see `Done` and the robot arm should be moving.

# Put it all together

Now that we have both the chatbot and the robot arm code running, typing `!tip` in Twitch chat should initiate the robot arm movement.
