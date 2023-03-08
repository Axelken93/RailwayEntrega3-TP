import nodemailer from 'nodemailer';
import logger from "./winston-config.js"
import dotenv from 'dotenv'
dotenv.config({
    path: '.env'
})

const mailGmail = 'abalbibieco@gmail.com'

const transporter = nodemailer.createTransport({
  host:"smtp.gmail.com",
  port: 587,
  auth: {
    user: mailGmail,
    pass: process.env.MAPASSNODEMAILER
  }
})

async function sendMailNotification(asunto, mensaje) {
    try {
        const titulo = asunto
        let variable = mensaje

        let contenido =`<p><b>Nombre:</b> ${variable.nombre}</p>
        <p><b>Dirección:</b> ${variable.direccion}</p>
        <p><b>Edad:</b> ${variable.edad}</p>
        <p><b>Telefono:</b> ${variable.telefono}</p>
        <p><b>Email:</b> ${variable.mail}</p>
        <p><b>ID:</b> ${variable.id}</p>`

        const mailOptions = {
        from: 'My Servidor Node.js',
        to: [mailGmail],
        subject: titulo,
        html: contenido,
        //   attachments: [
        //     {
        //       path: './grogu.webp'
        //     }
        //   ]
        }

        await transporter.sendMail(mailOptions)
        logger.info("Mensaje enviado con exito")
    } catch(error) {
        logger.error(error)
    }
    
}


async function sendMailPurchase(asunto, mensaje) {
    try {
        const mailOptions = {
        from: 'My Servidor Node.js',
        to: [mailGmail],
        subject: asunto,
        html: mensaje,
        //   attachments: [
        //     {
        //       path: './grogu.webp'
        //     }
        //   ]
        }

        await transporter.sendMail(mailOptions)
        logger.info("Mensaje enviado con exito")
    } catch(error) {
        logger.error(error)
    }
    
}

export {sendMailNotification, sendMailPurchase};

