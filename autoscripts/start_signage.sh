export DISPLAY=:0

URL="https://docs.google.com/presentation/d/e/2PACX-1vRSuvqnKKk2evC1_hLz-dRnSZ4KXKb4jSaniehgcObKqCq32UEaqesFzHUe4t81Mdfh0Sz-UtU1fu-p/pub?start=true&loop=true&delayms=10000"
#El comando "as" en cec-client significa "Active Source" (Fuente Activa). Esto le indica al dispositivo conectado por HDMI (como un televisor) que la Raspberry Pi u otro dispositivo con cec-client debe ser tratado como la fuente activa de video.
echo "as" | cec-client -s -d 1
# firefox --kiosk "$URL"
chromium-browser --start-fullscreen "$URL"