import RPi.GPIO as GPIO
import time
import sys

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup([20, 21], GPIO.OUT)
GPIO.output(20, False)

print("program started")
state = False
for i in range(10):
  GPIO.output(21, state)
  state = not state
  time.sleep(0.5)
GPIO.output(20, True)
print("error printing", file=sys.stderr)
print(5/0)
