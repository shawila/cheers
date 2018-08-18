#!/usr/bin/env python

from __future__ import print_function # use python 3 syntax but make it compatible with python 2
from __future__ import division       #                           ''

import sys      # used to exit when needed
import time     # import the time library for the sleep function
import brickpi3 # import the BrickPi3 drivers

import logging; logging.basicConfig(level=logging.INFO)

import os # Environment variables for pubnub key
from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

BP = brickpi3.BrickPi3() # Create an instance of the BrickPi3 class. BP will be the BrickPi3 object.

class MySubscribeCallback(SubscribeCallback):
    def presence(self, pubnub, presence):
        pass  # handle incoming presence data

    def status(self, pubnub, status):
        pass  # handle incoming status data

    def message(self, pubnub, message):
        print('Received mesage from pubnub')

        pull(1)         # pull the arm back
        time.sleep(2)   # pauses at max reach (increase this number to pause more or vice versa)
        pull(-1)        # returns arm back to original position

def pull(direction):
    # If we want to increase the speed of movement, increase the 50
    # To slow down the movement, decrease
    target = 50 * direction

    BP.set_motor_dps(BP.PORT_A, target)
    print(("Motor A Target Degrees Per Second: %d" % target), "  Motor A Status: ", BP.get_motor_status(BP.PORT_A))

    total = 0
    while total < 15: # this moves the arm for 1.5 seconds: change this as needed
        total += 1
        time.sleep(0.1)  # delay for 0.1 seconds (100ms) to reduce the Raspberry Pi CPU load.

    print('Stopping motor A')
    BP.set_motor_dps(BP.PORT_A, 0)

try:
    # Get pubnub publish_key and subscribe_key from env variables and init Pubnub
    pnconfig = PNConfiguration()
    pnconfig.subscribe_key = os.environ['PUBNUB_SUBSCRIBE_KEY']
    pnconfig.publish_key = os.environ['PUBNUB_PUBLISH_KEY']
    pubnub = PubNub(pnconfig)

    # Subscribe to Pubnub and listen to instructions
    print('Subsribing to Pubnub')
    pubnub.add_listener(MySubscribeCallback())
    pubnub.subscribe().channels('cheers').execute()

    while True:
        time.sleep(0.1)

except KeyboardInterrupt:   # except the program gets interrupted by Ctrl+C on the keyboard.
    BP.reset_all()          # Unconfigure the sensors, disable the motors, and restore the LED to the control of the BrickPi3 firmware.
    pubnub.unsubscribe_all() # Unsubscribe all listerners from pubnub
    print('^C received, shutting down the web server')
    sys.stdout.flush()
    os._exit(0)
