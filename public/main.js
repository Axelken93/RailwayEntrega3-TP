const socket = io()

socket.on('login', data => {
    let contenido = `<h2 style="color:white;" class="m-3 p-3 text-capitalize fw-bold">Bienvenido ${data}</h2>
    <button onclick="location.href= '/logout'" class="btn btn-warning m-2 text-light">Desloguear</button>`
    document.getElementById("loginUser").innerHTML = contenido
})

socket.on('logout', data => {
    let contenido = `<h2 style="color:white;" class="m-3 p-3 text-capitalize fw-bold">Hasta Luego ${data}</h2>`
    document.getElementById("logoutUser").innerHTML = contenido
})

socket.on('signin', data => {
    let contenido = `${data}`
    document.getElementById("loginUser").innerHTML = contenido
})

socket.on('userInfo', data => {
    contenido = `<div>
    <div class="form-group">
        <p><b>Nombre:</b> ${data.nombre}</p>
    </div>
    <div class="form-group">
    <img src=${data.foto} class="img-fluid" width="100">
    </div>
    <div class="form-group">
        <p><b>Dirección:</b> ${data.direccion}</p>
    </div>
    <div class="form-group">
        <p><b>Edad:</b> ${data.edad}</p>
    </div>
    <div class="form-group">
    <p><b>Telefono:</b> ${data.telefono}</p>
    </div>
    <div class="form-group">
    <p><b>Email:</b> ${data.mail}</p>
    </div>
    <div class="form-group">
    <p><b>ID:</b> ${data.id}</p>
    </div>



</div>`
    document.getElementById("userInformation").innerHTML = contenido
})

function finalizarCompra() {
    const numCarrito = document.getElementById("hola").value
    //const numCarrito = 33
    socket.emit('finalizar-compra', numCarrito)
}