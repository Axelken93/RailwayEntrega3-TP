import express from 'express'
import fs from 'fs';
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


//Constructor de Clase Productos
class Productos {
    constructor (fileName) {
        this.fileName = fileName
    };

    async save(obj) {   
        try {
            let data = await readFile(`public/${this.fileName}`)
            data.push(obj)
            let strData = JSON.stringify(data, null, 2)
            await fs.promises.writeFile(`public/${this.fileName}`, strData)
            return obj.id
        }
        catch (err) {
            console.log (`Hubo el siguiente error al agregar el objeto: ${err}`)
        }
    };

    async getById(num) {   
        try {  
            let filtred = await readFile(`public/${this.fileName}`).filter( x => {return x.id === num});
            return filtred;
        }
        catch (err) {
            console.log (`El ID buscado no existe. \nDetalle del ${err}`)
        }
    };

    async getAll() {   
        try {  
            let reading = await readFile(`public/${this.fileName}`);
            return reading;
        }
        catch (err) {
            console.log (`Hubo un error al intentar obtener todos los objetos: ${err}`)
        }
    };

    async deleteById(num) {   
        try {
            const data = await readFile(`public/${this.fileName}`).filter( x => {return x.id !== num});
            let stringData = JSON.stringify(data, null, 2)
            await fs.promises.writeFile(`public/${this.fileName}`, stringData);
        }
        catch (err) {
            console.log (`Se presenta el siguiente ${err}`)
        }
    };

    async deleteAll() {   
        try {  
            await fs.promises.writeFile(`public/${this.fileName}`, '');
        }
        catch (err) {
            console.log (`Se presenta el siguiente ${err}`)
        }
    };
};


//Funciones auxiliares
function readFile(fileName) {
    let fileRead = JSON.parse(fs.readFileSync(fileName, 'utf-8'))
    return fileRead;
}

function readFileProducts() {
    let fileRead = JSON.parse(fs.readFileSync('./public/productos.txt', 'utf-8'))
    return fileRead;
}

function readFileArrayId() {
    let fileRead = JSON.parse(fs.readFileSync('./public/productos.txt', 'utf-8')).map((x) => {return x.id})
    return fileRead
}

function assignedNewId(){
   return Math.max(...readFileArrayId())+1
}

function checkId (num) {
    const arrayID = JSON.parse(fs.readFileSync('./public/productos.txt', 'utf-8')).map((x) => {return x.id})
    if (arrayID.some((e) => {return e == num})) {
        return true
    } else {return false}
}

const productos = new Productos('productos.txt');


export {checkId,readFile,readFileProducts,readFileArrayId,assignedNewId,productos,};