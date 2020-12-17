/** CONTROLADOR */

/* Imports  */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// ?? Attaching routing to app server
const router = require('./routes/routing');

var corsOptions = {
    origin: "http://localhost:4200"
}

/* Iniciación de web server */ 
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', router); // su ruta inicial sera raiz

const db = require('./model/heroes.model');
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a la base de datos rey ;)');
}).catch(err => {
    console.log('No se pudo establecer una conexión a la base de datos');
    process.exit(); // !! termina con el servidor
});

app.get("/", (req,res) => {
    res.json({ message: "Inicio a servidor de aplicación" });
});

app.listen(port, () =>{
    console.log(`Servidor corriendo en puerto: ${port}`);
});
