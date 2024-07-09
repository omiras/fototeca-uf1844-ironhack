// importar módulos de terceros
const express = require('express');
const morgan = require('morgan');

// creamos una instancia del servidor Express
const app = express();

// Tenemos que usar un nuevo middleware para indicar a Express que queremos procesar peticiones de tipo POST
app.use(express.urlencoded({ extended: true }));

// Añadimos el middleware necesario para que el client puedo hacer peticiones GET a los recursos públicos de la carpeta 'public'
app.use(express.static('public'));

// Base de datos de imágenes
const images = [{
    title: "happy cat",
    url: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg"
}, {
    title: "happy dog",
    url: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
}, {
    title: "cat snow",
    url: "https://images.pexels.com/photos/3923387/pexels-photo-3923387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
}, {
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
    const filteredImages = images.filter(); // TODO

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
    // Esto NO ES necesario para la práctica
    if (!title || title.length > 30) {
        return res.status(400).send('Algo ha salido mal...');
    }

    // opción 1: totalmente válida
    //images.push(req.body); // [{title: 'Gato'}]

    // otra opción, 'sacar' los campos
    images.push({
        title,
        url
    })

    console.log('array de imagenes actualizado: ', images);

    // 3. Añadir los otros campos del formulario y sus validaciones

    // 4julio: Tras insertar una imagen 'dejaremos' el formulario visible 
    //res.send('Datos recibidos');
    // Redirect es un método del objecto Response que permite 'redirigir' al cliente a un nuevo endpoint o 

    // TODO: SORT : Usar el sort de manera adecuada para ordenar las fotografías por fecha antes de responder al cliente

    res.render('form', {
        isImagePosted: true
    });


});


// en el futuro es normal que tengamos endpoints como
// app.get('/edit-image-form')

app.listen(3000, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto 3000.")
});

