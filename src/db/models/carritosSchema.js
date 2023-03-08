import mongoose from 'mongoose'

const carritosCollName = 'carritos'

const carritosSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    timestamp: {type: String, required: true},
    productos: {type: Object}
}, {versionKey: false})

export const carritos = mongoose.model(carritosCollName, carritosSchema)