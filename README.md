Welcome!

This repo will setup a Twitch chatbot that listens to donations, and pass a call to a BrickPi attached to LEGO Mindstorms robot arm to move.

The first step is of course to [clone](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) this repo.

There are two parts in this project:
- Twitch chatbot: we add this to the our Twitch channel and it will monitor our chat for a `!tip` command that will trigger the robot
- Robot: we will build a robot arm with LEGO Mindstorms and a BrickPi that will move when triggered by the chatbot

For running the demo, we can either run the files ending in `local` to test locally if both your code and your robot are on the same WiFi network, or run the files ending in `pubnub` to test by going through "the cloud".

# Twitch chatbot

## Install Node.js

Follow the instructions [here](https://nodejs.org/en/download/package-manager/#nvm) to install Node.js

## Setup

For setup, we will need node and a Twitch account as a bare minimum to run locally.
For a nicer setup, we will use PubNub to communicate with the robot, and host our code on Heroku

### Install dependencies

After that's done run `npm install` to install dependencies.

### Twitch token

Finally, we need to generate our Twitch channel's oauth token. The easiest (but not suitable for production!) way would be to access this [url](https://twitchapps.com/tmi/) and generate a token there.

Set this token as an environment variable `export TWITCH_TOKEN="GENERATED_TOKEN"` (replace GENERATED_TOKEN with the generated one :) ).

### PubNub

Set up an account on [PubNub](https://www.pubnub.com/), then go to the dashboard and copy your subscribe and publish keys. We need to add them to our environment variables to be able to connect to pubnub.
```
export PUBNUB_SUBSCRIBE_KEY="<your subscription key>"
export PUBNUB_PUBLISH_KEY="<your publish key>"
```

### Heroku

To run this code on a server instead of locally, set up Heroku by following [these steps](https://devcenter.heroku.com/articles/getting-started-with-nodejs), but instead of getting their git repo, just use this one instead.

Don't forget to set the environment variables on Heroku by going to `https://dashboard.heroku.com/apps/<your app name>/settings`, clicking on `Reveal Config Vars` then adding the key to the left side (`PUBNUB_SUBSCRIBE_KEY`) and the value on the right side.

## Run the chatbot

### Run locally

`node cheers_bot.js` should run the chatbot.

### Run on heroku

As explained in the Heroku quick guide, just run `git push heroku master` and you're done. Just make sure to have set the environment variables beforehand (as explained about) or deployment will fail.

## Test the chatbot

Go to your Twitch channel, and type `!tip` in chat, the chatbot should answer.

# Robot arm

## Setup BrickPi

Dexter Industries have a great step-by-step [tutorial](https://www.dexterindustries.com/BrickPi/brickpi3-getting-started/) on how to setup your BrickPi.

For instructions on setting up WiFi, check this [post](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md).

## Build your robot arm

I will include some photos of the arm I prepared, but the important part is to connect the motor to port A (more on this in the code section below).

## Code for the robot arm

Follow the instructions to connect to your BrickPi.
My preferred way is by ssh `ssh pi@dex.local`. The default credentials are `robots1234`.

The next step is copy the code from `cheers_robot_local.py` into the file `~/cheers_robot_local.py` then run it with `python ~/cheers_robot_local.py`.
Alternatively, use `cheers_robot_pubnub.py` to test through PubNub, just make sure to add the environment variables here also (`PUBNUB_SUBSCRIBE_KEY` and `PUBNUB_PUBLISH_KEY`).

## Tinkering with the bot timing

If we want to fix the movement, we will need to change code in the `pull` function.

The comments should be sufficient to know what needs changing.

## Test the robot arm code

Open your browser to the following url `http://dex.local:8080`. If all goes well, you should see `Done` and the robot arm should be moving.

# Put it all together

Now that we have both the chatbot and the robot arm code running, typing `!tip` in Twitch chat should initiate the robot arm movement.

# Setup stream

Check out this [blog post](http://dev.en-japan.io/user-test-with-obs/) by yours truly for some easy-to-follow instructions on how to set up OBS to stream on Twitch.
