import express from 'express'
import fs from 'fs';
const app = express()
import { productos, checkId, readFile, readFileProducts, assignedNewId, readFileArrayId } from '../src/containers/containerMemory/controllerProductos.js';
import { admin } from'../utils/login.js'


app.get('/:num?', (req, res) => {
    const { num } = req.params
    if (!num) {
        productos.getAll().then(allProducts => res.json(allProducts))
    } else if (checkId(num)) {
        productos.getById(parseInt(num)).then(randomProduct => res.json(randomProduct))     
    } else {
        res.json({ error: "Producto no encontrado" })
    };
});

app.post('/', (req, res) => {
    if (admin) {
        let newProduct = req.body
        newProduct.timestamp = new Date().toLocaleString()
        newProduct.id = assignedNewId()
        productos.save(newProduct)
        res.json(newProduct.id)
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos y metodo POST no autorizada"})
    }
})


app.put('/:num', (req, res) => {
    if (admin) {
        const { num } = req.params
        const newProduct = req.body
        const oldArrayProducts = readFileProducts()
        const oldProduct = oldArrayProducts[parseInt(num)-1]
    
        if (checkId(num)) {
            newProduct.timestamp = new Date().toLocaleString()
            newProduct.id = parseInt(num)
            oldArrayProducts[parseInt(num)-1] = newProduct
            const newArrayProducts = JSON.stringify(oldArrayProducts,null,2)
            fs.promises.writeFile(`public/${productos.fileName}`, newArrayProducts)
            res.json({ ProductoAnterior: oldProduct, ProductoNuevo: newProduct})
        } else {res.json({ error: "Producto no encontrado" })}
        
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos/id y metodo PUT no autorizada"})
    }
});


//Elimina un producto segun su ID
app.delete('/:num', (req, res) => {
    if (admin) {
        const { num } = req.params
        const oldArrayProducts = readFileProducts()
    
        if (checkId(num)) {
            const removedProduct = oldArrayProducts.splice(parseInt(num)-1, 1);
            const newArrayProducts = JSON.stringify(oldArrayProducts,null,2)
            fs.promises.writeFile(`public/${productos.fileName}`, newArrayProducts)
            res.json({ Eliminado: removedProduct })
        } else {
            res.json({ error: "Producto no encontrado" })
        }
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos y metodo POST no autorizada"})
    }
});



export {app};