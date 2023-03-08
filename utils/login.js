let admin = true

function onlyAdmin(req, res, next) {
    if (admin) { // si es admin
    next()
    } else { // si no es admin, devuelvo el error
    res.status(401).json({error:-1,descripcion:`Ruta ${req.originalUrl} metodo ${req.method} no autorizado`});
    }
}

export {admin, onlyAdmin}