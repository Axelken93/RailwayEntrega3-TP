import { selectDB } from './utils/config.js'
import express from 'express'

import { createServer } from "http";
import { Server } from "socket.io";
const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer)

import logger from './utils/winston-config.js'

import { app as registerRoute } from './routes/register.js'

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static('./public'))

import { cantSesiones, getUser, getActiveUserInfo } from './src/containers/containerMongoDB.js'
import { compraFinalizada } from './routes/finalizar-compra.js'


// Elegir la base de datos
const BaseDatos = "mongo"

// Elegir entre modo fork o cluster
//const mode = "cluster"

//Routers
const { Router } = express
let routerCarrito = ""
await import(`${selectDB(BaseDatos).carrito}`).then((elem)=> {
    routerCarrito = elem.app
})
let productsRoute = ""
await import(`${selectDB(BaseDatos).productos}`).then((elem)=> {
    productsRoute = elem.app
})



//Configuracion del Routers
app.use('/api/productos', productsRoute)
app.use('/api/carrito', routerCarrito)
app.use(registerRoute)

app.all('*', (req, res) => {
    const { url, method } = req
    res.json({ error: -2, descripcion: `Ruta ${url} y metodo ${method} no implementado`});
    //logger.warn({ error: -2, descripcion: `Ruta ${url} y metodo ${method} no implementado`});
})


const PORT = process.env.PORT || 8080;


io.on('connection', socket => {

    console.log("Un cliente se ha conectado")

    cantSesiones().then((cantidad) => {
        if (cantidad !==0){
            getUser().then((data) => {
                socket.emit('login', data)
            })
            getUser().then((data) => {
                socket.emit('logout', data)
            })
            getActiveUserInfo().then((data) => {
                socket.emit('userInfo', data)
            })
        } else {
            let data = `<h2 style="color:white;" class="m-3 p-3 text-capitalize fw-bold">INICIE SESION</h2>
            <button onclick="location.href= '/login'" class="btn btn-warning m-2 text-light">SignIn</button>`
            socket.emit('signin', data)
        }
    })

    socket.on('finalizar-compra', numCarrito => {
        compraFinalizada(numCarrito)
    })

})


///Escuchando el programa
httpServer.listen(PORT, (err) => {
    if(err) throw new Error(`Error en el servidor ${err}`)
    logger.info('Servidor escuchando en el ' + PORT)
})