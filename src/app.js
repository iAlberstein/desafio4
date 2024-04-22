const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const http = require("http"); // Importa el módulo HTTP de Node.js
const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js");


const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = http.createServer(app); // Crea el servidor HTTP utilizando express
const io = socket(httpServer); // Inicializa socket.io con el servidor HTTP

httpServer.listen(PUERTO, () => { // Escucha en el puerto especificado
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


//Desafio loco del chat en el ecommerce: 
const MessageModel = require("./models/message.model.js");
const ProductModel = require("./models/product.model.js"); // Asegúrate de importar el modelo de producto

io.on("connection",  (socket) => {
    console.log("Nuevo usuario conectado");

    // Manejar los mensajes del chat
    socket.on("message", async data => {
        // Guardar el mensaje en MongoDB
        await MessageModel.create(data);

        // Obtener los mensajes de MongoDB y enviarlos a todos los clientes
        const messages = await MessageModel.find();
        io.sockets.emit("message", messages);
    });

    // Manejar la actualización de productos en tiempo real
    socket.on("updateProducts", async () => {
        try {
            // Obtener los productos desde MongoDB
            const productos = await ProductModel.find();
            // Emitir los productos actualizados a todos los clientes
            io.sockets.emit("updateProducts", productos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    });
});