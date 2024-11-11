import RPi.GPIO as GPIO
import time
import json
from datetime import datetime
import os

#GPIO.setwarnings(False)

subdirectory = "src/routes"  # The Directory of the JSON Files
file_path = os.path.join(subdirectory, "sensor_data.json")

# Ensure the subdirectory exists, and create it if it doesn't
if not os.path.exists(subdirectory):
    os.makedirs(subdirectory)
    #print("Path not found")

def get_light_and_security_status():
    # Set up GPIO mode and pins
    GPIO.setmode(GPIO.BOARD)
    PIR_input = 13  # PIR sensor input pin
    resistorPin = 7  # Resistor pin for measuring light
    sec_light = 11  # Security light output pin
    room_light = 15  # Room light output pin

    GPIO.setup(PIR_input, GPIO.IN)  # Set PIR sensor pin as input
    GPIO.setup(sec_light, GPIO.OUT)  # Set security light pin as output
    GPIO.setup(room_light, GPIO.OUT)  # Set room light pin as output

    sec_light_status = "OFF"
    room_light_status = "OFF"
    darkness_status = "DAYLIGHT"
    room_status = "NOBODY"

    # Set the resistor pin as output and pull it low to start the measurement
    GPIO.setup(resistorPin, GPIO.OUT)
    GPIO.output(resistorPin, GPIO.LOW)
    time.sleep(0.1)

    # Set the resistor pin as input and measure the time it takes for it to go high
    GPIO.setup(resistorPin, GPIO.IN)
    currentTime = time.time()
    diff = 0

    # Measure the time until the pin goes high (indicating a light change)
    while(GPIO.input(resistorPin) == GPIO.LOW):
        diff = time.time() - currentTime

    # If the diff value is greater than 20 milliseconds, it's considered "dark"
    if diff * 1000 > 40:
        GPIO.output(sec_light, GPIO.HIGH)  # Turn on security light
        sec_light_status = "ON"
        darkness_status = "DARKNESS"
        print("Darkness detected!")
    else:
        GPIO.output(sec_light, GPIO.LOW)  # Turn off security light
        sec_light_status = "OFF"
        darkness_status = "DAYLIGHT"
        print("It is Daylight!")

    # Check for movement detected in the room via the PIR sensor
    # In this loop, we continuously check if there's movement, without blocking
    if GPIO.input(PIR_input):
        room_light_status = "ON"
        room_status = "SOMEONE"
        GPIO.output(room_light, GPIO.HIGH)  # Keep the room light on while movement is detected
        print("Someone is in the room!")
    else:
        room_light_status = "OFF"
        room_status = "NOBODY"
        GPIO.output(room_light, GPIO.LOW)  # Turn off room light when no movement is detected
        print("No one in the room!")

    # Capture the current timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Prepare the status as a JSON object
    status = [{
        "room_name": "Room 1",
        "room_light_status": room_light_status,
        "sec_light_status": sec_light_status,
        "darkness_status": darkness_status,
        "room_status": room_status,
        "timestamp": timestamp
    }]

    # Return the status as a JSON-formatted string
    return status
    #return json.dumps(status)

# Example usage:


if __name__ == "__main__":
    try:
        #result = get_light_and_security_status()
        while True:
            result = get_light_and_security_status()
            print(result)  # This will print the JSON output


            # Serializing json
            json_object = json.dumps(result, indent=4)
            # Writing to sample.json
            with open("sensor_data.json", "w") as outfile:
                outfile.write(json_object)


            with open(file_path, "w") as outfile:
                outfile.write(json_object)
                
            time.sleep(2)  # Wait for 2 seconds before checking again

    except KeyboardInterrupt:
        # Clean up GPIO to prevent warnings
        print("Exiting gracefully...")
        GPIO.cleanup()


