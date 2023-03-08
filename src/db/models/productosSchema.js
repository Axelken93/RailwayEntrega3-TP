import mongoose from 'mongoose'

const productosCollName = 'productos'

const productosSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    codigo: {type: String, required: true, unique: true},
    precio: {type: Number, required: true},
    stock: {type: Number, required: true},
    foto: {type: String, required: true},
    timestamp: {type: String, required: true},
    id: {type: Number, required: true, unique: true}
}, {versionKey: false})

export const productos = mongoose.model(productosCollName, productosSchema)