
function buttonSetup() {
    const addButtons = document.querySelectorAll(".add");
    const subButtons = document.querySelectorAll(".sub");

    //Agrega elementos
    addButtons.forEach(button => {
        button.onclick = () => addFilterMovie(button.id);
    });

    //Resta elementos
    subButtons.forEach(button => {
        button.onclick = () => removeFilterMovie(button.id);
    });
}

//Consigue los DIV de la seccion de compras
const purchaseSideBar = document.getElementById("purchase-sidebar-list");
const purchase = document.getElementById("purchase-total");

//Carrito
let cartStorage = JSON.parse(localStorage.getItem("cart")) || [];
let totalAmount;

//Updatea el estado del carro
function updateCart(cartStorage) {
    localStorage.setItem("cart", JSON.stringify(cartStorage));
}

//Updatea el valor total de los productos del carrito
function updateCartValue() {
    let totalAmount = 0;

    cartStorage.forEach(item => (
        totalAmount += ((item.movie.vote_average * 2) * item.amount)
    ));

    console.log(totalAmount)
    return totalAmount;
}

//Updatea los datos de la seccion de compras
function updatedPurchaseDisplay() {
    purchaseSideBar.innerHTML = '';

    const cartStorage = JSON.parse(localStorage.getItem("cart")) || [];

    totalAmount = updateCartValue();

    cartStorage.forEach(item => {
        const priceTotal = (item.movie.vote_average * 2) * item.amount;

        let container = document.createElement("div");
        container.className = "cart-item row align-items-center border-bottom border-3 border-dark mb-2 p-1 fs-4";
        container.innerHTML =
            `
                <div class="col-3"><img class="rounded" style="width: 100px; height: 150px; object-fit: cover;" src=https://image.tmdb.org/t/p/original/${item.movie.poster_path} alt=${item.movie.id}/></div>
                <div class="col-2">$${(item.movie.vote_average * 2).toFixed(2)}</div>
                <div class="col-3"><u>Asientos</u>: ${item.amount}</div>
                <div class="col-2"><u>Total</u>: $${priceTotal.toFixed(2)}</div>
                <div class="col-1 btn-group" role="group">
                    <button class="add btn btn-primary fs-4" id=${item.movie.id}>+</button>
                    <button class="sub btn btn-danger fs-4" id=${item.movie.id}>-</button>
                </div>                
            `

        purchaseSideBar.appendChild(container)
    })

    purchase.innerHTML = `<div class="fw-bolder fs-2"><u>Total</u>: $${totalAmount.toFixed(2)}</div>`

    buttonSetup();
}

//Primera carga del estado del carrito
updatedPurchaseDisplay();
updateCartValue();

//Filtra el objeto a agregar
function addFilterMovie(id) {
    const selectedMovie = cartStorage.find(target => target.movie.id == id);

    if (selectedMovie) {
        selectedMovie.amount++;
    }

    updateCart(cartStorage);
    updateCartValue();
    updatedPurchaseDisplay();
}

//Filtra el objeto a remover
function removeFilterMovie(id) {
    const selectedMovie = cartStorage.find(movie => movie.movie.id == id);

    if (!selectedMovie) return;

    selectedMovie.amount--;
    if (selectedMovie.amount === 0) {
        cartStorage.splice(cartStorage.indexOf(selectedMovie), 1);
    }

    updateCart(cartStorage);
    updateCartValue();
    updatedPurchaseDisplay();
}

//Forma para completar la compra
const purchaseSection = document.getElementById("purchase-card");
purchaseSection.innerHTML =
    `
        <form class="row g-3" id="purchase-form">
        <div class="col-md-5 fs-4">
            <label for="name" class="form-label fw-bolder">Nombre</label>
            <input type="text" class="form-control" id="name" required>
        </div>
        <div class="col-md-5 fs-4">
            <label for="lastname" class="form-label fw-bolder">Apellido</label>
            <input type="text" class="form-control" id="lastname" required>
        </div>
        <div class="col-md-10 fs-4">
            <label for="mail" class="form-label fw-bolder">Mail</label>
            <div class="input-group">
                <input type="email" class="form-control" id="mail" required>
            </div>
        </div>
        <div class="col-md-3 fs-4">
            <label for="card-type" class="form-label fw-bolder">Tarjeta</label>
            <select class="form-select" id="card-type" required>
                <option selected disabled value="">Elija...</option>
                <option>Visa</option>
                <option>Mastercard</option>
                <option>American Express</option>
            </select>
        </div>
        <div class="col-md-7 fs-4">
            <label for="card-code" class="form-label fw-bolder">Codigo</label>
            <input type="text" class="form-control" id="card-code" value="8456-4156-5465-7891" readonly>
        </div>
        <div class="d-none">
            <button type="submit" id="submit-form"></button>
        </div>
    </form>
    `

//Boton de compras
const purchaseButton = document.getElementById("purchase");

//Establece la funcionalidad del boton con Sweet Alert
purchaseButton.onclick = (e) => {
    e.preventDefault();

    totalAmount = updateCartValue();

    const userName = document.getElementById("name").value;
    const userMail = document.getElementById("mail").value;
    const form = document.getElementById("purchase-form");

    //Chequea que la forma este completada
    switch (form.checkValidity()) {
        case true:
            Swal.fire({
                title: "Confirmar la compra",
                text: `Está por realizar una compra de: $${totalAmount.toFixed(2)}`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, comprar!",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    cartStorage = [];
                    Swal.fire({
                        title: `Felicidades ${userName} por tu compra!`,
                        text: `Las entradas han sido enviadas a tu correo (${userMail}).`,
                        icon: "success"
                    })
                        .then(() => {

                            window.location.href = "./index.html";
                        });
                }
            });
            break;
        case false:
            Swal.fire({
                title: "Error!",
                text: "Por favor complete todos los campos requeridos correctamente.",
                icon: "error"
            });
            break;
    }
};