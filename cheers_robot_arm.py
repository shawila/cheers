#!/usr/bin/env python
#
# https://www.dexterindustries.com/BrickPi/
# https://github.com/DexterInd/BrickPi3
#
# Copyright (c) 2016 Dexter Industries
# Released under the MIT license (http://choosealicense.com/licenses/mit/).
# For more information, see https://github.com/DexterInd/BrickPi3/blob/master/LICENSE.md
#
# This code is an example for running all motors while a touch sensor connected to PORT_1 of the BrickPi3 is being pressed.
#
# Hardware: Connect EV3 or NXT motor(s) to any of the BrickPi3 motor ports. Make sure that the BrickPi3 is running on a 9v power supply.
#
# Results:  When you run this program, the motor(s) speed will ramp up and down while the touch sensor is pressed. The position for each motor will be printed.

from __future__ import print_function # use python 3 syntax but make it compatible with python 2
from __future__ import division       #                           ''

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

import time     # import the time library for the sleep function
import brickpi3 # import the BrickPi3 drivers

BP = brickpi3.BrickPi3() # Create an instance of the BrickPi3 class. BP will be the BrickPi3 object.

PORT_NUMBER = 8080

#This class will handles any incoming request from
#the browser
class myHandler(BaseHTTPRequestHandler):
    #Handler for the GET requests
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/html')
        self.end_headers()
        # Send the html message
        self.wfile.write("Done")

        self.pull(1)    # pulls the arm back
        time.sleep(2)   # pauses at max reach (increase this number to pause more or vice versa)
        self.pull(-1)   # brings arm back to original position
        return

    # Arm movement controller
    def pull(self, direction):
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
        return

try:
    #Create a web server and define the handler to manage the
    #incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)
    print("Started httpserver on port %s" %(PORT_NUMBER))

    #Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt: # except the program gets interrupted by Ctrl+C on the keyboard.
    BP.reset_all()        # Unconfigure the sensors, disable the motors, and restore the LED to the control of the BrickPi3 firmware.
    print('^C received, shutting down the web server')
    server.socket.close()
