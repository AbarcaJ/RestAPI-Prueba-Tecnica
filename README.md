# ██████╗░██████╗░██╗░░░██╗███████╗██████╗░░█████╗░  ████████╗███████╗░█████╗░███╗░░██╗██╗░█████╗░░█████╗░
# ██╔══██╗██╔══██╗██║░░░██║██╔════╝██╔══██╗██╔══██╗  ╚══██╔══╝██╔════╝██╔══██╗████╗░██║██║██╔══██╗██╔══██╗
# ██████╔╝██████╔╝██║░░░██║█████╗░░██████╦╝███████║  ░░░██║░░░█████╗░░██║░░╚═╝██╔██╗██║██║██║░░╚═╝███████║
# ██╔═══╝░██╔══██╗██║░░░██║██╔══╝░░██╔══██╗██╔══██║  ░░░██║░░░██╔══╝░░██║░░██╗██║╚████║██║██║░░██╗██╔══██║
# ██║░░░░░██║░░██║╚██████╔╝███████╗██████╦╝██║░░██║  ░░░██║░░░███████╗╚█████╔╝██║░╚███║██║╚█████╔╝██║░░██║
# ╚═╝░░░░░╚═╝░░╚═╝░╚═════╝░╚══════╝╚═════╝░╚═╝░░╚═╝  ░░░╚═╝░░░╚══════╝░╚════╝░╚═╝░░╚══╝╚═╝░╚════╝░╚═╝░░╚═╝

#                      ██████╗░███████╗░██████╗████████╗  ░█████╗░██████╗░██╗
#                      ██╔══██╗██╔════╝██╔════╝╚══██╔══╝  ██╔══██╗██╔══██╗██║
#                      ██████╔╝█████╗░░╚█████╗░░░░██║░░░  ███████║██████╔╝██║
#                      ██╔══██╗██╔══╝░░░╚═══██╗░░░██║░░░  ██╔══██║██╔═══╝░██║
#                      ██║░░██║███████╗██████╔╝░░░██║░░░  ██║░░██║██║░░░░░██║
#                      ╚═╝░░╚═╝╚══════╝╚═════╝░░░░╚═╝░░░  ╚═╝░░╚═╝╚═╝░░░░░╚═╝
#                                        Made by ~Abarca, J.


# Objetivos del Proyecto:
`Crear un API Rest con un sistema de autenticacion utilizando las tecnologias:`
- Node
- Express
- MongoDB

`Lineamiento General:`
- Codigo limpio y estructurado usando Diseño MVC.
- Uso de auth flow con Access Token y Refresh Token.
- Autorizacion por Roles.
- Uso de CORS para rechazar o aceptar origenes.
- Manejo de errores

`Adicional:` Realizar una documentacion con Swagger.



# Resumen de todo lo realizado para la Prueba Tecnica:
* Uso de `ExpressJS` Para las Peticiones.
* Definicion de Rutas con versionamiento en url `(Pensando en futuro!)`.
* Autenticacion mediante JWT `(Access Token y Refresh Token)`.
* Guardando la informacion utlizando MongoDB como base de datos.
* Establecemos la variable de entorno `NODE_ENV=production`.
* Utilizamos definicion de Middleware basica para Roles.
* Definimos Middleware para validar la sesion/autorizacion .
* Definimos Middleware para validar los metodos HTTP accesibles.
* Definimos middleware para rechazar peticiones mientras este caida la database.
* Definicion de origenes con el modulo CORS.
* Utilizamos cross-env para intercambiar de entorno.
* Utilizamos Standard Lint para un codigo mas limpio y sin variables redundantes.


# Llevandolo a los contenedores y deploy:
* `Procfile`? Solo conectamos MongoDB y podremos utilizar con Herokuapp.com.
* `docker-compose.yml`? Alojando con Docker y Politica de reestablecimiento al reiniciar.
