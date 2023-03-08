import express from 'express'
const app = express()
import { fbProductos } from '../src/containers/containerFirebase.js';
import { admin } from'../utils/login.js'

app.get('/:num?', (req, res) => {
    const { num } = req.params
    if (!num) {
        fbProductos.getAll().then(allProducts => res.json(allProducts))
    } else {
        fbProductos.checkId(num).then((e)=> {
            if (e) {
                fbProductos.getById(parseInt(num)).then(Product => res.json(Product))
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
        fbProductos.assignedNewId()
        .then((newID) => {
            newProduct.id = newID
            res.json(newID)
            return newProduct
        })
        .then((newProduct) => {
            fbProductos.save(newProduct)
        })
    } else {
        res.json({ error: -1, descripcion: `ruta ${url} y metodo ${method} no autorizada`})
    }
})

app.put('/:num', (req, res) => {
    if (admin) {
        const { num } = req.params
        const newProduct = req.body
        newProduct.timestamp = new Date().toLocaleString()
        newProduct.id = parseInt(num)
        fbProductos.checkId(num).then((e)=> {
            if (e) {
                fbProductos.deleteByID(num).then(() => {
                    res.json(newProduct)
                    fbProductos.save(newProduct)
                })
            } else {
                res.json({ error: "ID de producto no encontrado" })
            }
        })
    } else {
        res.json({ error: -1, descripcion: `ruta ${url} y metodo ${method} no autorizada`})
    }
});

app.delete('/:num', (req, res) => {
    if (admin) {
        const { num } = req.params

        fbProductos.checkId(num).then((e)=> {
            if (e) {
                fbProductos.deleteByID(num).then(() => {
                    res.json("Producto eliminado correctamente")
                })
            } else {
                res.json({ error: "Producto no encontrado" })
            }
        })
    } else {
        res.json({ error: -1, descripcion: `ruta ${url} y metodo ${method} no autorizada`})
    }
});



export {app};