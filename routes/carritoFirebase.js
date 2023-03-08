import express from 'express'
const app = express()
import { fbProductos, fbCarritos } from '../src/containers/containerFirebase.js';
import { admin } from'../utils/login.js'

app.get('/:num?', (req, res) => {
    const { num } = req.params
    if (!num) {
        fbCarritos.getAll().then(allCharts => res.json(allCharts))
    } else {
        fbCarritos.checkId(num).then((e)=> {
            if (e) {
                fbCarritos.getById(parseInt(num)).then(chart => res.json(chart))
            } else {
                res.json({ error: "Carrito no encontrado" })
            }
        })
    }
});

app.get('/:num/productos', (req, res) => {
    const { num } = req.params
    fbCarritos.checkId(num).then((e)=> {
        if (e) {
            fbCarritos.getById(parseInt(num)).then((chart) => {
                res.json(chart.productos)
            })
        } else {
            res.json({ error: "Carrito no encontrado" })
        }
    })
});

app.post('/', (req, res) => {
    if (admin) {
        fbCarritos.assignedNewId()
        .then((newID) => {
            let newChart = {"id": newID, "timestamp": new Date().toLocaleString(), "productos": req.body }
            res.json(newID)
            return newChart
        })
        .then((newChart) => {
            fbCarritos.save(newChart)
        })
    } else {
        res.json({ error: -1, descripcion: `ruta ${url} y metodo ${url} no autorizada`})
    }
})

app.post('/producto/:num', (req, res) => {
    const { num } = req.params
    if (admin) {
        fbCarritos.assignedNewId()
        .then((newID) => {
            let newChart = {}
            newChart.id = newID
            newChart.timestamp = new Date().toLocaleString()
            res.json(newID)
            fbProductos.getById(num).then((product) => {
                newChart.productos = product
            })
            .then(() => {
                fbCarritos.save(newChart)
            })
        })
    } else {
        res.json({ error: -1, descripcion: `ruta ${url} y metodo ${url} no autorizada`})
    }
})


app.post('/:num/productos/:id_prod', (req, res) => {
    const { num, id_prod } = req.params
    let newChart = {id: num, timestamp: new Date().toLocaleString()}
    let oldProducts =""
    if (admin) {
        fbProductos.checkId(id_prod).then((p) => {
            if (p) {
                fbCarritos.checkId(num).then((e) => {
                    if (e) {
                        fbCarritos.checkIfNewProductExist(num,id_prod).then((e) => {
                            if (e) {
                                fbCarritos.getById(parseInt(num)).then((carrito) => {
                                    oldProducts = carrito.productos
                                    return oldProducts
                                }).then(()=> {
                                    fbProductos.getById(parseInt(id_prod)).then((newProduct)=> {
                                        oldProducts.push(newProduct)
                                        return oldProducts
                                    }).then((oldProducts) => {
                                        newChart.productos = oldProducts
                                        return newChart
                                    }).then((newChart)=> {
                                        fbCarritos.deleteByID(num).then(()=> {
                                            fbCarritos.save(newChart)
                                            res.json(`Producto nro ${id_prod} agregado con exito al carrito ${num}`)
                                        })
                                    })
                                })
                            } else {
                                res.json({ error: "Producto que intenta agregar ya se encuentra seleccionado" })
                            }
                        })
                    } else {
                        res.json({ error: "Carrito no encontrado" })
                    }
                })
            } else {
                res.json({ error: `Producto con ID ${id_prod} no encontrado` })
            }
        })
    } else {
        res.json({ error: -1, descripcion: `ruta ${url} y metodo ${url} no autorizada`})
    }
})

app.delete('/:num', (req, res) => {
    if (admin) {
        const { num } = req.params

        fbCarritos.checkId(num).then((e)=> {
            if (e) {
                fbCarritos.deleteByID(num).then(() => {
                    res.json("Carrito eliminado correctamente")
                })
            } else {
                res.json({ error: "Carrito no encontrado" })
            }
        })
    } else {
        res.json({ error: -1, descripcion: `ruta ${url} y metodo ${url} no autorizada`})
    }
});

app.delete('/:num/productos/:id_prod', (req, res) => {
    const { num, id_prod } = req.params
    if (admin) {
        fbProductos.checkId(id_prod).then((p) => {
            if (p) {
                fbCarritos.checkId(num).then((e) => {
                    if (e) {
                        fbCarritos.checkIfNewProductExist(num,id_prod).then((e) => {
                            if (e) {
                                res.json({ error: "No se encontro el producto que desea eliminar en este carrito" })
                            } else {
                                fbCarritos.deleteProducByChartID(num,id_prod).then(() => {
                                    res.json("Producto eliminado exitosamente del carrito")
                                })
                            }
                        })
                    } else {
                        res.json({ error: "Carrito no encontrado" })
                    }
                })
            } else {
                res.json({ error: `Producto con ID ${id_prod} no encontrado` })
            }
        })
    } else {
        res.json({ error: -1, descripcion: `ruta ${url} y metodo ${url} no autorizada`})
    }
});

export {app};