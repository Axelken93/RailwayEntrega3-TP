import express from 'express'
import fs from 'fs';
const app = express()
import { carrito, checkId, readFileCharts, assignedNewId, checkIdProd, getProductFromProductos } from '../src/containers/containerMemory/controllerCarrito.js'

app.get('/', (req, res) => {
        carrito.getAll().then(allProducts => res.json(allProducts)) 
});

app.get('/:num', (req, res) => {
    const { num } = req.params
    if (checkId(num)) {
        carrito.getById(parseInt(num)).then(carritoAleatorio => res.json(carritoAleatorio)) 
    } else {
        res.json({ error: "Carrito no encontrado" })
    };
});

app.get('/:num/productos', (req, res) => {
    const { num } = req.params
    if (checkId(num)) {
        carrito.getProductsByIdCart(parseInt(num)).then(carritoAleatorio => res.json(carritoAleatorio)) 
    } else {
        res.json({ error: "Carrito no encontrado" })
    };
});

app.post('/', (req, res) => {
    let newChart = {"id": assignedNewId(), "timestamp": new Date().toLocaleString(), "productos": req.body}
    carrito.save(newChart)
    res.json(newChart.id)
})

app.post('/:num/productos', (req, res) => {
    const { num } = req.params
    if (checkId(num)) {
        let newProducts = req.body
        let oldArrayCharts = readFileCharts()
        let oldChart = oldArrayCharts[parseInt(num)-1]
        let carritoModificado = readFileCharts()[num-1]
        let oldProductsInChart = oldChart.productos
        oldProductsInChart.push(newProducts)
        let newChart = {"id": parseInt(num), "timestamp": new Date().toLocaleString(), "productos": oldProductsInChart}
        const newArrayCharts = JSON.stringify(oldArrayCharts,null,2)
        fs.promises.writeFile(`public/${carrito.fileName}`, newArrayCharts)
        res.json({ CarritoAnterior: carritoModificado, CarritoNuevo: newChart})
    } else {
        res.json({ error: "Carrito no encontrado" })
    };
});

app.post('/:num/productos/:id_prod', (req, res) => {
    const { num, id_prod } = req.params
    if (checkId(num)) {
        if (checkIdProd(num, id_prod)) {
            res.json({ error: `Producto con ID: ${id_prod} ya se encuentra en carrito numero ${num}` })
        } else {
            let newProduct = getProductFromProductos(id_prod)
            console.log(newProduct)
            let oldArrayCharts = readFileCharts() //anterior array de carritos
            let oldChart = oldArrayCharts[parseInt(num)-1] //carrito seleccionado
            let carritoModificado = readFileCharts()[num-1] //queda igual
            let oldProductsInChart = oldChart.productos //productos en el carrito seleccionado
            oldProductsInChart.push(newProduct) //agrego el nuevo producto
    
            //publico el carrito modificado y respuesta en consola.
            let newChart = {"id": parseInt(num), "timestamp": new Date().toLocaleString(), "productos": oldProductsInChart}
            const newArrayCharts = JSON.stringify(oldArrayCharts,null,2)
            fs.promises.writeFile(`public/${carrito.fileName}`, newArrayCharts)
            res.json({ CarritoAnterior: carritoModificado, CarritoNuevo: newChart})
        }
    } else {
        res.json({ error: "Carrito no encontrado" })
    };
});


app.delete('/:num', (req, res) => {
    const { num } = req.params
    const oldArrayCharts = readFileCharts()
    if (checkId(num)) {
        const removedChart = oldArrayCharts.splice(parseInt(num)-1, 1);
        const newArrayCharts = JSON.stringify(oldArrayCharts,null,2)
        fs.promises.writeFile(`public/${carrito.fileName}`, newArrayCharts)
        res.json({ CarritoEliminado: removedChart })
    } else {
        res.json({ error: "Carrito no encontrado" })
    }
});

app.delete('/:num/productos/:id_prod/', (req, res) => {
    const { num, id_prod } = req.params
    if (checkId(num)) {
        if (checkIdProd(num, id_prod)) {
            const oldArrayCharts = readFileCharts()
            const productoEliminado = oldArrayCharts[num-1].productos.filter( x => {return x.id == id_prod});
            let idPosition = oldArrayCharts[num-1].productos.map((x) => {return x.id}).indexOf(parseInt(id_prod))
            oldArrayCharts[num-1].productos.splice(idPosition,1)
            const newArrayCharts = JSON.stringify(oldArrayCharts,null,2)
            fs.promises.writeFile(`public/${carrito.fileName}`, newArrayCharts)
            res.json({ ProductoEliminado: productoEliminado })
        } else {
            res.json({ error: "Producto no encontrado en este carrito" })
        }
    } else {
        res.json({ error: "Carrito no encontrado" })
    }
});


export {app};