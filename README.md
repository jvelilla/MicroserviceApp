MicroserviceApp
================

REST API build with Node.js and client with Angular.JS front-end.
and simple microservice using ZMQ implemented with Node.js and Eiffel.

Based on https://github.com/juliensimon/NodeApp  

## Requirements

 * Node.js https://nodejs.org/en/
 * Eiffel  https://www.eiffel.org/
   - At the moment if you want to use the Eiffel microservice you will need to checkout the updated ZMQ library from this branch: https://github.com/jvelilla/EiffelStudio/tree/es_zmq
 
## Microservices
 * Node.js + ZMQ 
 * Eiffel + ZMQ


# Installation

1. Download and Install Node.js
2. Clone or Download this project.
3. Install the required modules for Node.js webapp 
  a. express
  b. body-parser
  c. winston
  d. zmq
  e. mongodb
  Go to the directory where you have download this project and do the following steps.

   ```
   $>cd webapp
   $>npm install express
   $>npm install body-parser
   $>npm install winston
   $>npm install zmq
   $>npm install mongodb
   ```
4. Run the ZMQ service (Eiffel or Node.JS version)
   a. Eiffel version go to the services\eiffel and run it using EiffelStudio or commandline (be sure to have the *.lib and dlls of ZMQ in your PATH.
   b. Node version go to the services\node and install the required modules (zmq) and run it using node service.js
5. Run the Web App. Go to webapp and run the following command

  ```
   node server.js
  ```
  

