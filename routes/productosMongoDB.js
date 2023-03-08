import express from 'express'
import { createServer } from "http";
const app = express()
const httpServer = createServer(app);

import cluster from 'cluster'
import os from 'os'
let numCPUs = os.cpus().length
import { productMongodb, checkId, assignedNewId } from '../src/containers/containerMongoDB.js';
import { admin } from'../utils/login.js'

//Modo Cluster Hardcodeado
const clusterMode = false

if (clusterMode) {
    if (cluster.isMaster) {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', worker => {
            console.log(`Worker ${worker.process.pid} died: ${new Date().toString()}`)
        })
    } else {

        app.get('/', (req, res) => {
            const { num } = req.query
            if (!num) {
                productMongodb.getAll().then(allProducts => res.json(allProducts))
            } else {
                checkId(num).then((e)=> {
                    if (e) {
                        productMongodb.getbyID(parseInt(num)).then(Product => res.json(Product))
                    } else {
                        res.json({ error: "Producto no encontrado" })
                    }
                })
            }
        });
        const PORT = process.env.PORT || 8080;

        httpServer.listen(PORT, (err) => {
            if(err) throw new Error(`Error en el servidor ${err}`)
            logger.info('Servidor escuchando en el ' + PORT)
        })
    }    
}



app.get('/', (req, res) => {
    const { num } = req.query
    if (!num) {
        productMongodb.getAll().then(allProducts => res.json(allProducts))
    } else {
        checkId(num).then((e)=> {
            if (e) {
                productMongodb.getbyID(parseInt(num)).then(Product => res.json(Product))
            } else {
                res.json({ error: "Producto no encontrado" })
            }
        })
    }
});

app.post('/', (req, res) => {
    if (admin) {
        let newProduct = req.body
        newProduct.timestamp = new Date().toLocaleString()
        assignedNewId()
        .then((newID) => {
            newProduct.id = newID
            res.json(newID)
        })
        .then(() => {
            productMongodb.save(newProduct)
        })
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos y metodo POST no autorizada"})
    }
})

//Actualiza un producto segun su ID
app.put('/:num', (req, res) => {
    if (admin) {
        const { num } = req.params
        const newProduct = req.body
        newProduct.timestamp = new Date().toLocaleString()
        newProduct.id = num
        checkId(num).then((e)=> {
            if (e) {
                productMongodb.deleteByID(num).then(() => {
                    res.json(newProduct)
                    productMongodb.save(newProduct)
                })
            } else {
                res.json({ error: "ID de producto no encontrado" })
            }
        })
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos y metodo POST no autorizada"})
    }
});


//Elimina un producto segun su ID
app.delete('/:num', (req, res) => {
    if (admin) {
        const { num } = req.params

        checkId(num).then((e)=> {
            if (e) {
                productMongodb.deleteByID(num).then(() => {
                    res.json("Producto eliminado correctamente")
                })
            } else {
                res.json({ error: "Producto no encontrado" })
            }
        })
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos y metodo POST no autorizada"})
    }
});


export {app};
