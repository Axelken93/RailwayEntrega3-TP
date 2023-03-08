import { carritoMongodb } from '../src/containers/containerMongoDB.js'
import { getActiveUserInfo } from '../src/containers/containerMongoDB.js'
import { sendTwilioWAPP, sendTwilioSMS } from '../utils/twilio.js'
import { sendMailPurchase } from '../utils/nodemailer.js'
import logger from '../utils/winston-config.js'

async function compraFinalizada(num) {
    try {
        //obtengo los datos de productos
        const carrito = await carritoMongodb.getbyID(num)
        const productos = carrito[0].productos

        //Mensaje del cuerpo del mail
        const mensaje = crearHtml(productos)

        //obtengo los datos del usuario
        const userInfo = await getActiveUserInfo()
        const name = userInfo.nombre
        const mail = userInfo.mail

        //asunto del mail y wapp
        const asunto = `Nuevo pedido de ${name} | ${mail}`

        await sendMailPurchase(asunto, mensaje)
        await sendTwilioWAPP(asunto)
        await sendTwilioSMS("El pedido ha sido recibido y se encuentra en proceso")

        return logger.info("Proceso de compra finalizado con exito")
    } catch (error) {
        logger.error("No se pudo finalizar la compra -> Error:" + error)
    }
}


function crearHtml(array) {
    let contenido = `<div>
    <table>
        <tr style="color: blue;"> <th>Nombre</th> <th>Precio</th> <th>Foto</th></tr>`
    
    for (const e of array) {
        contenido += `    <tr>
        <td>${e.nombre}</td>
        <td>${e.Precio}</td>
        <td><img src=${e.Foto} style="width: 30px;" ></img></td>
    </tr>`
    }
    
    contenido += `</table>
    </div>`
    return contenido
}

export {compraFinalizada};
