#!/bin/bash

URL="https://docs.google.com/presentation/d/e/2PACX-1vRSuvqnKKk2evC1_hLz-dRnSZ4KXKb4jSaniehgcObKqCq32UEaqesFzHUe4t81Mdfh0Sz-UtU1fu-p/pub?start=true&loop=true&delayms=10000"

pkill -f '/usr/lib/chromium/chromium'
sleep 2
chromium-browser --start-fullscreen --no-sandbox --disable-infobars --kiosk "$URL"
