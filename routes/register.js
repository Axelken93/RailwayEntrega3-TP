import express from 'express'
const app = express()

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { usersMongodb, sessionMongodb, assignedNewUserId, destroySession, getUser, cantSesiones } from '../src/containers/containerMongoDB.js'

import logger from "../utils/winston-config.js"
import { sendMailNotification }from "../utils/nodemailer.js"
import bcrypt from 'bcryptjs'

import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://axelken93:Racing200793@backend32190.e4b0dmz.mongodb.net/ecommerce?retryWrites=true&w=majority",
        mongoOptions: advancedOptions
    }),
    secret: "myKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}))



passport.use('register', new LocalStrategy({
    passReqToCallback: true    
}, async (req, username, password, done) => {

    let usuarios = await usersMongodb.getAll()
    let usuario = await usuarios.find(usuario => usuario.mail == username)

    if (usuario) {
        logger.error('ERROR: el nombre de usuario ya esta registrado')
        return done(null,false)
    }

    let hashPassword = await bcrypt.hash(req.body.password, 8)
    let userID = await assignedNewUserId()

    let newUser = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        edad: req.body.edad,
        telefono: req.body.telefono,
        foto: req.body.foto,
        mail: username,
        password: hashPassword,
        id: userID
    }
    usersMongodb.save(newUser)
    sendMailNotification('Nuevo Registro', newUser)


    done(null, newUser)
}))

passport.use('login', new LocalStrategy(async (username, password, done) => {
    
    let usuarios = await usersMongodb.getAll()
    let usuario = await usuarios.find(usuario => usuario.mail == username)
    if (!usuario) {
        logger.error("ERROR: Usuario Inexistente")
        return done(null, false)
    }

    let compare = await bcrypt.compare(password, usuario.password)
    if(compare) {
        return done(null, usuario)
    } else {
        logger.error("ERROR: Password Incorrecto")
        return done(null, false)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.mail)
})

passport.deserializeUser(async (username, done) => {
    let usuarios = await usersMongodb.getAll()
    let usuario = await usuarios.find(usuario => usuario.mail == username)
    done(null, usuario)
})


// CONFIGURACION RUTAS REGISTER

app.get('/register', (req, res) => {
    res.sendFile('C:/Users/flopi/Desktop/Axel/Programacion/Curso-CoderHouse/Backend/TP/Desafios/Entrega3-TP/public/register.html')
})

app.post('/register', passport.authenticate('register', { 
    failureRedirect: '/failregister', 
    successRedirect: '/login'
}))

app.get('/failregister', (req, res) => {
    res.sendFile('C:/Users/flopi/Desktop/Axel/Programacion/Curso-CoderHouse/Backend/TP/Desafios/Entrega3-TP/public/failregister.html')
})


//Configuración Rutas de Login
app.get('/login', (req, res) => {
    destroySession();
    res.sendFile('C:/Users/flopi/Desktop/Axel/Programacion/Curso-CoderHouse/Backend/TP/Desafios/Entrega3-TP/public/login.html');
})

// function postlogin() {
//     const username = req.body.username
//     req.session.user = username
//     res.redirect("/home")
// }

app.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin',
    successRedirect: '/home'})
    )


app.get('/faillogin', (req, res) => {
    res.sendFile('C:/Users/flopi/Desktop/Axel/Programacion/Curso-CoderHouse/Backend/TP/Desafios/Entrega3-TP/public/faillogin.html')
})

//Configuración Rutas de Logout
app.get('/logout', (req, res) => {
    res.sendFile('C:/Users/flopi/Desktop/Axel/Programacion/Curso-CoderHouse/Backend/TP/Desafios/Entrega3-TP/public/logout.html')
})

//Prueba Home
app.get('/home', function (req, res) {
    cantSesiones().then((cantidad) => {
        if (cantidad == 0){
            res.redirect('/login')
        } else {
            res.sendFile('C:/Users/flopi/Desktop/Axel/Programacion/Curso-CoderHouse/Backend/TP/Desafios/Entrega3-TP/public/index.html')
        }
    })
})


export {app};