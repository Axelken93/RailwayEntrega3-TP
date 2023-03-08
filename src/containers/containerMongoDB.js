import mongoose from "mongoose";
import * as productoModels from "../db/models/productosSchema.js";
import * as carritoModels from "../db/models/carritosSchema.js";
import * as usersModels from "../db/models/usersSchema.js";
import * as sessionModels from "../db/models/sessionSchema.js";
import {mongoDBConnection} from "../../utils/config.js";
import logger from "../../utils/winston-config.js";
import express from 'express'
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

class ContenedorMongoDB {
    constructor(db){
        this.db = db
    }

    async getAll() {
        try {
            await mongoDBConnection()
            const rta = await this.db.find({}, {_id: 0})
            return rta
        }
        catch (err) {
            logger.error(`Hubo un error al intentar obtener todos los objetos: ${err}`)
        }
    };

    async getbyID(num) {
        try {
            await mongoDBConnection()
            const rta = await this.db.find({id: {$eq: num}}, {_id: 0})
            return rta
        }
        catch (err) {
            logger.error(`Hubo un error al intentar obtener el objeto con ID Nro ${num}: ${err}`)
        }
    };

    async getbyUsername(username) {
        try {
            await mongoDBConnection()
            const rta = await this.db.find({mail: {$eq: username}}, {_id: 0})
            return rta
        }
        catch (err) {
            logger.error(`Hubo un error al intentar obtener el objeto con Username ${username}: ${err}`)
        }
    };

    async save(obj) {
        try {
            await mongoDBConnection()
            const objeto = obj
            const saveModel = new this.db(objeto);
            let objSave = await saveModel.save()
            logger.info("Objeto guardado correctamente")
        }
        catch (err) {
            logger.error(`Hubo un error al intentar guardar el objeto: ${err}`)
        }
    };

    async insertProductOnChart(chartNum, productsList) {
        try {
            await mongoDBConnection()
            let products = productsList
            logger.info(productsList)
            let carritoActualizado = await this.db.updateOne( {id: {$eq: chartNum}}, {
                $set: {productos: products}
            } )
            logger.info(carritoActualizado)
            logger.info("Objeto guardado correctamente")
        }
        catch (err) {
            logger.error (`Hubo un error al intentar insertar el objeto: ${err}`)
        }
    };

    async deleteByID(num) {
        try {
            await mongoDBConnection()
            let productDeleted = await this.db.deleteOne({id: {$eq: num}})
            logger.info("Objeto eliminado correctamente")
            return productDeleted
        }
        catch (err) {
            logger.error(`Hubo un error al intentar eliminar el objeto: ${err}`)
        }
    };

    async deleteProducByChartID(chartNum, prodNum) {
        try {
            await mongoDBConnection()
            let carritoActual = await carritoMongodb.getbyID(parseInt(chartNum))
            let carritoViejo = carritoActual[0]

            let nuevoCarrito = {id: carritoViejo.id, timestamp: carritoViejo.timestamp}

            let productosExistentes = await carritoMongodb.getbyID(parseInt(chartNum))
            let arrayProductosExistentes = []
            for (const producto of productosExistentes) {
                arrayProductosExistentes.push(producto.productos)
            }
            arrayProductosExistentes = arrayProductosExistentes[0]

            let newArray = []
            for (const e of arrayProductosExistentes) {
                if (e.id != prodNum)
                    newArray.push(e)
            }

            nuevoCarrito.productos = newArray
            await mongoDBConnection()
            await this.db.deleteOne({id: {$eq: chartNum}})
            const saveModel = new this.db(nuevoCarrito);
            let objSave = await saveModel.save()
        }
        catch (err) {
            logger.error (`Hubo un error al intentar eliminar el producto: ${err}`)
        }
    };

    async deleteAll() {
        try {
            await mongoDBConnection()
            let productDeleted = await this.db.deleteMany({})
            logger.info("Objetos eliminado correctamente")
            return productDeleted
        }
        catch (err) {
            logger.error (`Hubo un error al intentar eliminar el objeto: ${err}`)
        }
    };

async countDoc() {
    try {
        await mongoDBConnection()
        const rta = await this.db.countDocuments()
        return rta
    }
    catch (err) {
        logger.error(`Hubo un error al intentar contar todos los objetos: ${err}`)
    } 
};

async getSession() {
    try {
        await mongoDBConnection()
        const rta = await this.db.find({}, {_id: 0})
        let session = rta[0]
        return session
    }
    catch (err) {
        logger.error(`Hubo un error al intentar obtener todos los usuarios: ${err}`)
    } 
};

};

async function checkId(num){
    try {
        await mongoDBConnection()
        const ID = await productoModels.productos.find({}, {_id: 0, id:1})
        let arrayID =[]
        await ID.forEach(e => {
            arrayID.push(e.id)
        });
        if (arrayID.some((e) => {return e == num})) {
            return true
        } else {return false}
    }
    catch (err) {
        logger.error (`Hubo un error al validar el ID: ${err}`)
    }
}

async function checkChartId(num){
    try {
        await mongoDBConnection()
        const ID = await carritoModels.carritos.find({}, {_id: 0, id:1})
        let arrayID =[]
        await ID.forEach(e => {
            arrayID.push(e.id)
        });
        if (arrayID.some((e) => {return e == num})) {
            return true
        } else {return false}
    }
    catch (err) {
        logger.error (`Hubo un error al validar el ID: ${err}`)
    }
}

async function assignedNewId(){
    try {
        await mongoDBConnection()
        const ID = await productoModels.productos.find({}, {_id: 0, id:1}).sort({id: -1}).limit(1)
        let newID= ID[0].id + 1
        return newID
    }
    catch (err) {
        logger.error (`Hubo un error al asignar nuevo ID: ${err}`)
    }
}

async function assignedNewUserId(){
    try {
        await mongoDBConnection()
        const cantUsers = await usersModels.users.countDocuments()

         if (cantUsers !== 0) {
            const ID = await usersModels.users.find({}, {_id: 0, id:1}).sort({id: -1}).limit(1) || false
            let newID= ID[0].id + 1
            return newID
        } else {
            let newID = 1
            return newID 
        }

    }
    catch (err) {
        logger.error (`Hubo un error al asignar nuevo ID: ${err}`)
    }
}

async function assignedNewChartId(){
    try {
        await mongoDBConnection()
        const ID = await carritoModels.carritos.find({}, {_id: 0, id:1}).sort({id: -1}).limit(1)
        let newID= ID[0].id + 1
        return newID
    }
    catch (err) {
        logger.error (`Hubo un error al asignar nuevo ID: ${err}`)
    }
}

async function checkIfNewProductExist(chartNum, prodNum){
    try {
        let productosExistentes = await carritoMongodb.getbyID(parseInt(chartNum))
        let arrayProductosExistentes = []
        for (const producto of productosExistentes) {
            arrayProductosExistentes.push(producto.productos)
        }
        arrayProductosExistentes = arrayProductosExistentes[0]
        let arrayIdExistente = []
        for (const prod of arrayProductosExistentes) {
            arrayIdExistente.push(prod.id)
        }

        if (arrayIdExistente.some((e) => {return e == prodNum})) {
            return false
        } else {return true}
    }
    catch (err) {
        logger.error (`Hubo un error al realizar la validación: ${err}`)
    }
}


const productMongodb = new ContenedorMongoDB(productoModels.productos);
const carritoMongodb = new ContenedorMongoDB(carritoModels.carritos);
const usersMongodb = new ContenedorMongoDB(usersModels.users);
const sessionMongodb = new ContenedorMongoDB(sessionModels.sessionDB);


async function cantSesiones() {
    let cantidadSessiones = await sessionMongodb.countDoc()
    return cantidadSessiones
}

async function getUser(){
    let cantidad = await sessionMongodb.countDoc()
    if (cantidad !== 0) {
        let user = await sessionMongodb.getSession()
        .then((x)=> {
            let data = JSON.stringify(x)
            return data
        })
        .then((data)=>{
            let stringData = JSON.parse(data).session
            let jsonData = JSON.parse(stringData)
            return jsonData.passport
        })
        .then((e)=>{
            let element = e.user
            return element
        })
        return user
    }
}

async function destroySession() {
    let eliminado = await sessionMongodb.deleteAll()
    return eliminado
}

async function getActiveUserInfo(){
    let sessionName = await getUser()
    let name = await usersMongodb.getbyUsername(sessionName)
    let userInfo = name[0]
    return userInfo
}

    

export {
    productMongodb, 
    carritoMongodb, 
    usersMongodb, 
    sessionMongodb, 
    assignedNewUserId, 
    checkId, 
    checkChartId, 
    assignedNewId, 
    assignedNewChartId, 
    checkIfNewProductExist,
    destroySession,
    getUser,
    cantSesiones,
    getActiveUserInfo
};
