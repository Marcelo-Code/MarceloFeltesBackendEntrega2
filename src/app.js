import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import { products } from "./public/js/products.js";

const app = express();

//Se indica que el server puede recibir JSON en el body de las solicitudes
app.use(express.json());

//Permite que el servidor pueda recibir y manejar datos enviados desde formularios HTML
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(8080, () => {
  console.log("Servidor http escuchando en el puerto 8080");
});

//Se instancia el socket que funciona dentro del httpServer
const io = new Server(httpServer);

//Configuración del motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Se configura la carpeta public como carpeta para archivos estáticos
app.use(express.static(__dirname + "/public"));

//Se implemementan los routers
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  //Escucha el evento newProduct, creación de producto
  socket.on("newProduct", (data) => {
    products.push(data);
    console.log(products);
    io.emit("createdProduct", products);
  });

  //Escucha el evento deleteProduct, de eliminación de producto
  socket.on("deleteProduct", (index) => {
    let deletedProduct = products.splice(index, 1)[0];

    //Envía el evento deletedProduct de confirmación de eliminación, conjuntamente con el producto eliminado
    io.emit("deletedProduct", { products, deletedProduct });
  });

  //Escucha el evento newUser, para enviar la lista de productos al conectarse un nuevo usuario
  socket.on("newUser", (userId) => {
    socket.emit("products", products);
  });
});
