export DISPLAY=:0
# xdotool mousemove 0 0
# xdotool search --onlyvisible --class firefox windowactivate key F5
xdotool search --onlyvisible --class chromium windowactivate key F5 F5
date
echo 'ping 0.0.0.0' | cec-client -s -d 1
echo '---------------------------------'