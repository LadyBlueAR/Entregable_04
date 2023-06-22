import express, { urlencoded } from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import ProductManager from './public/js/ProductManager.js';

const pm = new ProductManager('./src/data/products.json');

const app = express();
app.use(express.json())
app.use(urlencoded({extended:true}))
const httpServer = app.listen(8080, () => console.log("Listening on Port 8080"));
const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/products', productsRouter);
app.use('/realtimeproducts', viewsRouter );

app.get('/', (req, res) => {
    res.render('index');
})

socketServer.on('connection', (socket) => {
    console.log("Nuevo cliente conectado");

    socket.emit('productos', pm.getProducts());

    socket.on('productos', (idProducto) => {
        console.log({ idProducto });
        pm.deleteProduct(parseInt(idProducto));
        socket.emit('productos', pm.getProducts());
    }); 

    socket.on('addProduct', (productJSON) => {
        const producto = JSON.parse(productJSON)
        console.log(producto)
        pm.addProduct(producto);

        socket.emit('productos', pm.getProducts());
    
      });    

})

