#!/bin/bash

# Actualiza los repositorios y actualiza el sistema
echo "Actualizando el sistema..."
sudo apt update && sudo apt upgrade -y &

# Instala cec-utils para controlar dispositivos HDMI-CEC
echo "Instalando cec-utils..."
sudo apt install -y cec-utils &

# Instala xdotool para controlar el mouse y teclado
echo "Instalando xdotool..."
sudo apt install -y xdotool &

# Esperar a que todos los procesos en segundo plano finalicen
wait
echo "Todas las instalaciones han finalizado."

# Crear la carpeta /var/log/autoscripts/
echo "Creando carpeta /var/log/autoscripts/"
sudo mkdir -p /var/log/autoscripts/
echo "Carpeta /var/log/autoscripts/ creada."

# Mover la carpeta autoscripts a ~/Documents/
echo "Moviendo autoscripts a ~/Documents/"
mv autoscripts ~/Documents/

# Copiar el archivo signage-fs.desktop a ~/.config/autostart/
echo "Copiando signage-fs.desktop a autostart..."
mkdir -p ~/.config/autostart/
mv ~/Documents/autoscripts/signage-fs.desktop ~/.config/autostart/
echo "Archivo signage-fs.desktop copiado a ~/.config/autostart/"

# Copiar el contenido de crontab.txt a crontab
echo "Configurando crontab..."
crontab ~/Documents/autoscripts/crontab.txt
echo "Crontab actualizado correctamente."

# Habilitar X11
echo "Habilitando X11..."
sudo raspi-config nonint do_wayland W1
echo "X11 habilitado. Es recomendable reiniciar el Raspberry Pi."
