import mongoose from 'mongoose'

const usersCollName = 'users'

const usersSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    direccion: {type: String, required: true},
    edad: {type: Number, required: true},
    telefono: {type: Number, required: true},
    foto: {type: String, required: true},
    mail: {type: String, required: true},
    password: {type: String, required: true},
    id: {type: Number, required: true, unique: true}
}, {versionKey: false})

export const users = mongoose.model(usersCollName, usersSchema)