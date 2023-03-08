import mongoose from 'mongoose'

const sessionCollName = 'session'
const sessionSchema = new mongoose.Schema({}, {versionKey: false})

export const sessionDB = mongoose.model(sessionCollName, sessionSchema)