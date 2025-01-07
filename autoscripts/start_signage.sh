export DISPLAY=:0

URL="https://docs.google.com/presentation/d/e/2PACX-1vRSuvqnKKk2evC1_hLz-dRnSZ4KXKb4jSaniehgcObKqCq32UEaqesFzHUe4t81Mdfh0Sz-UtU1fu-p/pub?start=true&loop=true&delayms=10000"

# firefox --kiosk "$URL"
chromium-browser --start-fullscreen "$URL"
