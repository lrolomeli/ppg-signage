# Sistema de Presentacion Digital Plasticos Plasa

# Manual de Instalacion

## Índice
1. [Introduccion](#introduccion)
2. [Descripcion](#descripcion)
3. [Requisios del Sistema](#requisitos-del-sistema)
4. [Instalacion](#instalacion)
5. [Configuracion Inicial](#configuracion-inicial)
6. [Contacto y Soporte](#contacto-y-soporte)

---

## Introduccion
Bienvenido al **Manual de Instalacion**. Este documento proporciona instrucciones detalladas para la instalación, configuración y uso software.

## Descripcion
- Al iniciar el dispositivo (raspberry o maquina con linux) se ejecuta un script que abre el navegador en modo pantalla completa con el enlace que apunta a la presentacion en google slides esta ya contiene la informacion de los pedidos a desplegar.
- Una vez abierta la presentacion se utilizan las herramientas cec-utils y xdotool para controlar la pantalla o tv conectadas y el teclado para presionar F5 y refrescar la presentacion por si existen cambios.
- El navegador se refresca cada 5 minutos de acuerdo con el archivo crontab y el horario de encendido de la pantalla es a las 6:00 mientras que el apagado esta configurado a las 22:00 
- El siguiente link te lleva a la presentacion de los pedidos es lo que se deberia desplegar en el dispositivo. https://docs.google.com/presentation/d/e/2PACX-1vRSuvqnKKk2evC1_hLz-dRnSZ4KXKb4jSaniehgcObKqCq32UEaqesFzHUe4t81Mdfh0Sz-UtU1fu-p/pub?start=true&loop=true&delayms=10000

## Requisitos del Sistema
- **Tarjeta SD:** 32GB.
- **Sistema Operativo:** Raspberry Pi OS (Publicado: 2024-12-10) based on Debian GNU/Linux 12 (bookworm)
- **Dispositivo:** Raspberry Pi 4 (4GB)

## Instalacion
1. Flashear el sistema operativo
	- Se utilizó la herramiento Raspberry Pi Imager en la version v.1.9.0.
2. Clonar Repositorio en alguna ubicacion puede ser por ejemplo /home/{usuario}/Downloads/
	- Reemplazar {usuario} con el nombre de su usuario.
3. Actualiza los repositorios con "sudo apt update && sudo apt upgrade"
4. Instala la herramienta para enviar comandos por hdmi cec.
	- "sudo apt install cec-utils"
5. Instala la herramienta para controlar el mouse y teclado.
	- "sudo apt install xdotool"
3. Colocar los archivos en su lugar.
	- 1. Almacena los archivos .desktop en la siguiente ruta: ~/.config/autostart/
		- Los archivos dentro de esa ruta se ejecutaran al iniciar el SO.
		- En caso de no existir la carpeta autostart creala con "mkdir ~/.config/autostart"
		- (En esta version del sistema operativo esta configuracion permite ejecutar programas o scripts al iniciar el sistema, en versiones nuevas asegurate que siga funcionando o revisa otras opciones )
		- Puedes revisar los scripts que se han ejecutado con el siguiente comando:
		- "journalctl --user -xe"
	- 2. Coloca la carpeta autoscripts en la siguiente ruta: ~/Documents/
	- 3. Edita el script periodico, ingresa el comando "crontab -e"
		- Abre el archivo crontab.txt (ubicado en los archivos que descargaste)
		- Reemplaza lo que hay en crontab -e por el crontab.txt


## Configuracion Inicial
1. Configuracion de comunicacion ssh.
2. Configuracion de la hora y fecha actual.
3. Habilitar X11.
	- Para que la herramienta de xdotool funcione debemos habilitar la interfaz grafica (Xorg X11)
	- Para esto hay que escribir el comando "sudo raspi-config"
	- Ir al apartado 6) Advanced Options
	- A6) Wayland
	- Selecciona W1) X11
	- Presiona TAB y Finish
	- Reinicia el raspberry. (Listo)
4. Si se requiere comprobar la herramienta de xdotool desde ssh.
	- asegurese de 

## Solución de Problemas
| Problema | Posible Solucion |
|----------|-----------------|
| No se ejecutan los scripts en automatico al encender el sistema | Verifique que las rutas que se hayan escrito correctamente, confirme que no se han ejecutado los scripts vea los registros de ejecucion en "journalctl --user -xe" |
| No se refresca la presentacion | Confirme que se ha habilitado la interfaz grafica X11 con el siguiente comando "echo $XDG_SESSION_TYPE" el resultado debe ser X11 cualquier otro revise la configuracion inicial.|

Si La TV no enciende
1. Verifica la conexion por ssh.
2. Verifica que haya comunicacion con la TV "echo 'pow 0.0.0.0' | cec-client -s -d 1"
3. Prende la TV manualmente si el comando anterior arroja un error.
4. Puedes checar los resultados de los scripts en la carpeta /var/log/autoscripts/

- 1. Si necesita verificar los scripts que se han ejecutado periodicamente en crontab puede hacerlo con el siguiente comando
- "systemctl status cron" este desplegara si el servicio de ejecucion periodica esta funcionando y algunos logs de los programas ejecutados.
- 2. En el archivo cec_cmds.txt puedes encontrar los comandos basicos para hdmi cec y estos podrian ser distintos en algunas distribuciones de linux.
- 3. El archivo ppgslides.js es la automatizacion de la hoja de pedidos oficial en google sheets de plasticos plasa. Este programa se encarga de modificar
- la presentacion oficial cada que hay un cambio en la hoja. 
- El desarrollo de este programa esta escrito dentro de las extensiones de google sheets.
- Para modificar el programa: 
	- 1) Entra en la hoja electronica de PEDIDOS A FABRICAR en google sheets. 
	- 2) Selecciona el menu de "Extensiones" y la opcion de "Apps Script".
	- 3) La funcion runLastCall2() se ejecuta cada vez que hay una modificacion en la hoja.
- Las operaciones en esta hoja se limitan a solamente lectura para no afectar la edicion de los administradores.

## Contacto y Soporte
Para asistencia, contacte a: **soporte@plasticosplasa.com**
