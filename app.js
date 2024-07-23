// importar módulos de terceros
const express = require('express');
const morgan = require('morgan');

// creamos una instancia del servidor Express
const app = express();

// Tenemos que usar un nuevo middleware para indicar a Express que queremos procesar peticiones de tipo POST
app.use(express.urlencoded({ extended: true }));

// Añadimos el middleware necesario para que el client puedo hacer peticiones GET a los recursos públicos de la carpeta 'public'
app.use(express.static('public'));

// Forma más simple. Variable global para saber cual es el siguiente Id que nos tocan
let id = 5;

// Varible para indicar en que puerto tiene que escuchar nuestra app
// process.env.PORT en render.com
// 3000 lo quiero usar para desarrollo local 
console.log("valor del PORT: ", process.env.PORT)
const PORT = process.env.PORT || 4000;



// Base de datos de imágenes
let images = [{
    id: 1,
    title: "happy cat",
    url: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
}, {
    id: 2,
    title: "happy dog",
    url: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
}, {
    id: 3,
    title: "cat snow",
    url: "https://images.pexels.com/photos/3923387/pexels-photo-3923387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
}, {
    id: 4,
    title: "woman in lake",
    url: "https://images.pexels.com/photos/2365067/pexels-photo-2365067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
}];

// Especificar a Express que quiero usar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Usamos el middleware morgan para loguear las peticiones del cliente
app.use(morgan('tiny'));

// Cuando nos hagan una petición GET a '/' renderizamos la home.ejs
app.get('/', (req, res) => {

    // 2. Usar en el home.ejs el forEach para iterar por todas las imágenes de la variable 'images'. Mostrar de momento solo el título 
    res.render('home', {
        images
    });
});

// Creamos un nuevo endpoint para gestionar la búsqueda 
app.get('/search', (req, res) => {
    // Vamos a recibir algo con esta estructura http://localhost:3000/search?keyword=cat

    // 1. Coger el el valor del parámetro keyword de la query string (cat)
    // TODO 

    // 2. Usar el método filter para filtrar el array de images por el valor de (cat)
    const filteredImages = images.filter(() => true); // TODO

    // Tema mayúsuclas-minúsuclas: dos opciones
    // 1. Pasarlo todo a mínusculas con toLowerCase
    // 2. Usar una expresión regular

    // 3. Usar res.render para renderizar la vista home.ejs y pasarle el array de imágenes filtrado
    res.render('home', {
        images: filteredImages
    })

});

// Cuando nos hagan una petición GET a '/add-image-form' renderizamos 
app.get('/add-image-form', (req, res) => {
    res.render('form', {
        isImagePosted: undefined
    });
});



// Cuando nos hagan una petición POST a '/add-image-form' tenemos que recibir los datos del formulario y actualizar nuestra "base de datos"
app.post('/add-image-form', async (req, res) => {
    // todos los datos vienen en req.body
    console.log(req.body);

    // 1. Actualizar el array 'images' con la información de req.body
    const { title, url } = req.body;

    // Validación del lado servidor de que realmente nos han enviado un títilo
    // Expresión para validar el formato del title de la imagen
    const regexp = /^[0-9A-Z\s_]+$/i;

    /** Programación defensiva: no dar por supuesto nada de lo que te envia un cliente o de cómo usan tus funcionalidades */
    if (title.length > 30 || !regexp.test(title) ) {
        return res.status(400).send('Algo ha salido mal...');
    }


    // opción 1: totalmente válida
    //images.push(req.body); // [{title: 'Gato'}]

    // Calcular color predominante


    console.log('array de imagenes actualizado: ', images);

    // 3. Añadir los otros campos del formulario y sus validaciones

    // 4julio: Tras insertar una imagen 'dejaremos' el formulario visible 
    //res.send('Datos recibidos');
    // Redirect es un método del objecto Response que permite 'redirigir' al cliente a un nuevo endpoint o 

    // TODO: SORT : Usar el sort de manera adecuada para ordenar las fotografías por fecha antes de responder al cliente

    // miramos si la URL está repetida en el array de images
    const isRepeated = false; // TODO

    if (isRepeated) {

        res.render('form', {
            isImagePosted: false,
            isImageRepetad: true
        });

    } else {
        // otra opción, 'sacar' los campos
        images.push({
            id: id++,
            title,
            url,
            dominantColor: ''
        })


        res.render('form', {
            isImagePosted: true,
            isImageRepetad: false
        });

    }



});

// endpoint para borrar la imagen
app.post('/images/:id/delete', (req, res) => {
    // 1. ¿Cómo vamos a obtener la url de la imagen que quiere borrar el cliente? req.params.id
    console.log('req params: ', req.params);

    // 2. images? Usar el método filter para eliminar la imagen que me pasan por req.params.id

    // Opción 1: 3. Sobreescribir el array images con el resultado del método filter
    images = images.filter(() => true); //TODO 

    // Opctión 2: Usar el método de array splice para eliminar el elemento del array images. Antes teneis que identificar el índice donde se encuentra la imagen que queremos borrar

    // 3. Volvemos a hacer un render
    res.redirect('/')

});

// en el futuro es normal que tengamos endpoints como
// app.get('/edit-image-form')



app.listen(PORT, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto " + PORT);
});

