# Raspberry pi Kiosk Assets

Raspberry pi 3B+ running an official 7" touchscreen LCD


## LCD rotation

To rotate the screen output on the raspberry pi:

`sudo vi /boot/config.txt`

and add one of the following to the bottom of the file

```
# For HDMI out
display_rotate=0
display_rotate=1
display_rotate=2
display_rotate=3

# If you are using the official LCD touchscreen
lcd_rotate=0
lcd_rotate=1
lcd_rotate=2
lcd_rotate=3
```

0 is the normal configuration. 1 is 90 degrees. 2 is 180 degress. 3 is 270 degrees.

