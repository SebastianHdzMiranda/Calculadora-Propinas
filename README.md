# json-server
    Herramienta de desarrollo que proporciona una API RESTful simulada a partir de un archivo JSON. Es una herramienta útil cuando estás desarrollando o probando una aplicación que necesita interactuar con una API, pero aún no tienes un servidor real implementado.

    Simulación de una API REST:

        1.- Puedes crear un archivo JSON que represente tus datos y utilizar json-server para crear una API REST simulada basada en ese archivo.
        Acciones CRUD:

        2.- json-server proporciona rutas y operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para tus datos simulados. Puedes realizar operaciones HTTP como GET, POST, PUT y DELETE para interactuar con los datos.
        Fácil de Configurar:

        3.- Es fácil de configurar y usar. Solo necesitas tener un archivo JSON con tus datos y ejecutar json-server en la línea de comandos.
        Personalización:

        4.- Puedes personalizar la configuración y el comportamiento de la API simulada utilizando opciones de línea de comandos o un archivo de configuración.

    1.- Instala json-server globalmente usando npm (Node Package Manager):

        npm install -g json-server

    2.- Crea un archivo JSON con tus datos (por ejemplo, db.json).


    3.- Ejecuta json-server:

        json-server --watch db.json --port 4000
    
    --port 4000 significa que lo abrira en el puerto 4000

