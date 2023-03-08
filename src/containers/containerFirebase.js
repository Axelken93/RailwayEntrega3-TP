import { fb } from './../../utils/config.js'

class ContenedorFirebase {
    constructor(collection){
        this.query = fb.collection(collection)
    }

    async getAll() {
        try {
            const allItems = await this.query.get()
            const arrayItems = []
            allItems.forEach(item => {
                arrayItems.push(item.data())
            })
            return arrayItems
        }
        catch (err) {
            console.log (`Hubo un error al obtener los productos: ${err}`)
        }
    }

    async getById(num) {
        try {
            const allDocuments = await this.query.get()
            const arrayDocuments = []
            allDocuments.forEach(item => {
                arrayDocuments.push(item.data())
            })
            let document
            arrayDocuments.forEach(d => {
                if (num == d.id) {
                    document = d
                }
            })
            return document
        }
        catch (err) {
            console.log (`Hubo un error al obtener los productos: ${err}`)
        }
    }

    async save(obj) {
        try {
            await this.query.add(obj)
        }
        catch (err) {
            console.log (`Hubo un error al guardar el producto: ${err}`)
        }
    }

    async deleteByID(num) {
        try{
            let idNum = await this.findId(num)
            const doc = this.query.doc(`${idNum}`);
            const item = await doc.delete()
            console.log("Documento borrado:" + item)
        }
        catch (err) {
            console.log (`Hubo un error al eliminar el producto: ${err}`)
        }
    }

    async deleteProducByChartID(chartNum, prodNum) {
        try {
            let carritoActual = await this.getById(chartNum)
            let carritoNuevo = {id: chartNum, timestamp: new Date().toLocaleString() }
            let productosExistentes = carritoActual.productos
            let productosNuevos = []
            for (const e of productosExistentes) {
                if (e.id != prodNum) {
                    productosNuevos.push(e)
                }
            }
            carritoNuevo.productos = productosNuevos
            await this.deleteByID(chartNum)
            await this.save(carritoNuevo)
        }
        catch (err) {
            console.log (`Hubo un error al intentar eliminar el producto: ${err}`)
        }
    };

    async findId(num) {
        try {
            let QuerySnapshot = await this.query.get()
            let doc = QuerySnapshot.docs
            let arrayIds = doc.map((doc) => ({
                idFirebase: doc.id,
                id: doc.data().id
            }))
            let documentID = ""
            arrayIds.forEach((item) => {
                if (item.id == num) {
                    documentID = item.idFirebase
                }
            })
            return documentID
        }
        catch (err) {
            console.log (`Hubo un error al obtener el ID del producto: ${err}`)
        }
    }

    async checkId(num){
        try {
            const allDocuments = await this.query.get()
            const arrayID = []
            allDocuments.forEach(item => {
                arrayID.push(item.data().id)
            })

            if (arrayID.some((e) => {return e == num})) {
                return true
            } else {return false}
        }
        catch (err) {
            console.log (`Hubo un error al validar el ID: ${err}`)
        }
    }

    async assignedNewId(){
        try {
            const allDocuments = await this.query.get()
            const arrayID = []
            allDocuments.forEach(item => {
                arrayID.push(item.data().id)
            })
            const newID = Math.max(...arrayID)+1
            return newID
        }
        catch (err) {
            console.log (`Hubo un error al asignar nuevo ID: ${err}`)
        }
    }

    async checkIfNewProductExist(chartNum, prodNum){
        try {
            let carrito = await this.getById(chartNum)

            let arrayDocuments = carrito.productos
            let arrayId = []
            for (const prod of arrayDocuments) {
                arrayId.push(prod.id)
            }

            if (arrayId.some((e) => {return e == prodNum})) {
                return false
            } else {return true}
        }
        catch (err) {
            console.log (`Hubo un error al realizar la validación: ${err}`)
        }
    }
    

    // async firstCreate() {
    //     try {
    //         await this.query.add({
    //             nombre: "Cuadrado",
    //             timestamp: "no hay registros",
    //             descripcion: "Tiene cuatro lados iguales",
    //             codigo: "A22",
    //             precio: 100,
    //             stock: 10,
    //             foto: "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_crop_square_48px-512.png",
    //             id: 1
    //         })
    //         await this.query.add({
    //             nombre: "Triangulo",
    //             timestamp: "no hay registros",
    //             descripcion: "Tiene tres lados",
    //             codigo: "T33",
    //             precio: 990,
    //             stock: 5,
    //             foto: "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_crop_square_48px-512.png",
    //             id: 2
    //         })
    //         console.log("Productos creado con exito")
    //     }
    //     catch (err) {
    //         console.log (`Hubo un error al crear nuevo documento: ${err}`)
    //     }
    // }

    // async firstChartCreate() {
    //     try {
    //         await this.query.add({
    //             id: 1,
    //             timestamp: "no hay registros",
    //             productos: [
    //               {
    //                 nombre: "Triangulo",
    //                 timestamp: "no hay registros",
    //                 descripcion: "Tiene tres lados",
    //                 codigo: "T33",
    //                 Precio: 990,
    //                 Stock: 5,
    //                 Foto: "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_crop_square_48px-512.png",
    //                 id: 2
    //               }
    //             ]
    //           })
    //         await this.query.add({
    //             id: 2,
    //             timestamp: "no hay registros2",
    //             productos: [
    //               {
    //                 nombre: "Triangulo",
    //                 timestamp: "no hay registros",
    //                 descripcion: "Tiene tres lados",
    //                 codigo: "T33",
    //                 Precio: 990,
    //                 Stock: 5,
    //                 Foto: "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_crop_square_48px-512.png",
    //                 id: 2
    //               },
    //               {
    //                 nombre: "Cuadrado",
    //                 timestamp: "no hay registros",
    //                 descripcion: "Tiene cuatro lados iguales",
    //                 codigo: "A22",
    //                 Precio: 100,
    //                 Stock: 10,
    //                 Foto: "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_crop_square_48px-512.png",
    //                 id: 1
    //               }
    //             ]
    //           })
    //         console.log("Productos creado con exito")
    //     }
    //     catch (err) {
    //         console.log (`Hubo un error al crear nuevo documento: ${err}`)
    //     }
    // }
}

const fbProductos = new ContenedorFirebase("productos")
const fbCarritos = new ContenedorFirebase("carritos")

export {fbCarritos, fbProductos};
