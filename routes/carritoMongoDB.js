import express from 'express'
const app = express()
import { productMongodb, carritoMongodb, checkId, checkChartId, assignedNewChartId, checkIfNewProductExist } from '../src/containers/containerMongoDB.js';
import { admin } from'../utils/login.js'
import logger from '../utils/winston-config.js'


app.get('/:num?', (req, res) => {
    const { num } = req.query
    if (!num) {
        carritoMongodb.getAll().then(allCharts => res.json(allCharts))
    } else {
        checkChartId(num).then((e)=> {
            if (e) {
                carritoMongodb.getbyID(parseInt(num)).then(chart => res.json(chart))
            } else {
                res.json({ error: "Carrito no encontrado" })
            }
        })
    }
});

app.get('/:num/productos', (req, res) => {
    const { num } = req.params

    checkChartId(num).then((e)=> {
        if (e) {
            carritoMongodb.getbyID(parseInt(num)).then((chart) => {
                let products = []
                for (const prod of chart) {
                    products.push(prod.productos)
                }
                res.json(products[0])
            })
        } else {
            res.json({ error: "Carrito no encontrado" })
        }
    })

});

app.post('/', (req, res) => {
    if (admin) {
        assignedNewChartId()
        .then((newID) => {
            let newChart = {"id": newID, "timestamp": new Date().toLocaleString(), "productos": req.body }
            res.json(newID)
            return newChart
        })
        .then((newChart) => {
            carritoMongodb.save(newChart)
        })
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos y metodo POST no autorizada"})
    }
})

app.post('/producto/:num', (req, res) => {
    const { num } = req.params
    if (admin) {
        assignedNewChartId()
        .then((newID) => {
            let newChart = {}
            newChart.id = newID
            newChart.timestamp = new Date().toLocaleString()
            res.json(newID)
            productMongodb.getbyID(num).then((product) => {
                newChart.productos = product
            })
            .then(() => {
                logger.info(newChart)
                carritoMongodb.save(newChart)
            })
        })
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos y metodo POST no autorizada"})
    }
})


app.post('/:num/productos/:id_prod', (req, res) => {
    const { num, id_prod } = req.params
    if (admin) {
        checkId(id_prod).then((p) => {
            if (p) {
                checkChartId(num).then((e) => {
                    if (e) {
                        checkIfNewProductExist(num,id_prod).then((e) => {
                            if (e) {
                                carritoMongodb.getbyID(parseInt(num)).then((chart) => {
                                    let products = []
                                    for (const prod of chart) {
                                        products.push(prod.productos)
                                    }
                                    return products[0]
                                }).then((products) => {
                                    productMongodb.getbyID(parseInt(id_prod)).then((newProduct) => {
                                        products.push(newProduct[0])
                                        return products
                                    }).then((products) => {
                                        carritoMongodb.insertProductOnChart(num,products).then(() => {
                                            res.json("Producto ingresado correctamente al carrito")
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

        checkChartId(num).then((e)=> {
            if (e) {
                carritoMongodb.deleteByID(num).then(() => {
                    res.json("Carrito eliminado correctamente")
                })
            } else {
                res.json({ error: "Carrito no encontrado" })
            }
        })
    } else {
        res.json({ error: -1, descripcion: "ruta /api/productos y metodo POST no autorizada"})
    }
});


app.delete('/:num/productos/:id_prod', (req, res) => {
    const { num, id_prod } = req.params
    if (admin) {
        checkId(id_prod).then((p) => {
            if (p) {
                checkChartId(num).then((e) => {
                    if (e) {
                        checkIfNewProductExist(num,id_prod).then((e) => {
                            if (e) {
                                res.json({ error: "No se encontro el producto que desea eliminar en este carrito" })
                            } else {
                                carritoMongodb.deleteProducByChartID(num,id_prod).then(() => {
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