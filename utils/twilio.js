import twilio from 'twilio'
import logger from "./winston-config.js"
import dotenv from 'dotenv'
dotenv.config({
    path: '.env'
})

const accountSid = process.env.MAKEYTWILIO;
const authToken = process.env.MAPASSTWILIO;

const twilioClient = twilio(accountSid, authToken)

async function sendTwilioSMS(mensaje) {
    try {
        const from = '+15674065654'
        const to = '+541134972020'
        const body = mensaje
        
        await twilioClient.messages.create({body, from, to})
        logger.info("Mensaje de texto enviado con exito")
    } catch(error) {
        logger.error(error)
    }
}

async function sendTwilioWAPP(mensaje) {
    try {
        const from = 'whatsapp:+14155238886'
        const to = 'whatsapp:+5491134972020'
        const body = mensaje
        
        await twilioClient.messages.create({body, from, to})
        logger.info("Mensaje de WhatsApp enviado con exito")
    } catch(error) {
        logger.error(error)
    }
}

export {sendTwilioSMS, sendTwilioWAPP};
