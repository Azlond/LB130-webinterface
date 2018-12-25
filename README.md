Dependencies
------------

* [tplink-lightbulb](https://github.com/konsumer/tplink-lightbulb)
	* by konsumer
  
* [lightbulb.svg](https://www.codeseek.co/alexzaworski/animated-svg-lightbulb-XJgmYv)
	* the remote.svg image was taken from [Alex Zaworski](https://www.codeseek.co/alexzaworski)

Hardware
--------------
For use with the [TP-Link LB130](http://www.tp-link.com/us/products/details/cat-5609_LB130.html)

Installation & Configuration
--------------
* Clone the repo
* Replace `##HOSTNAME` in config.json with the hostname or IP of the LB-130 bulb
* Replace `##IP` in config.json with the IP of the server
* Replace `##PORT` config.json with the port
* Run `npm run build`
* Run `node server.js`