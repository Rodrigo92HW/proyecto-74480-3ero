const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2I2OGNiNGYzZWJlZTFlZjQyMTYyNTVlYjgwYmM5NSIsIm5iZiI6MTczMDA2MDk3Mi42ODQzMzEsInN1YiI6IjY3MWVhMDk5ZmVmZDFlMDUxMDAwOGFlYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4U4d695uUKxdlQDK05Acdh99fAOwujWh1QqaZnk5kf0'
    }
};

//Holdea los valores de las peliculas
let movies = [];
let moviesDiv = document.getElementById("movies");

//Agregar y quitar elementos del carrito
let addButtons;
let subButtons;

//Manejar el estado del boton cuando se agrega un elemento
function updateButton(id, state) {
    subButtons.forEach(button => {
        if (id == button.id) {
            button.disabled = state;
        }
    });
}

function buttonSetup() {
    addButtons = document.querySelectorAll(".add");
    subButtons = document.querySelectorAll(".sub");

    //Agrega elementos
    addButtons.forEach(button => {
        button.onclick = () => addFilterMovie(button.id);
    });

    //Resta elementos
    subButtons.forEach(button => {
        button.onclick = () => removeFilterMovie(button.id);
    });

    //Revisa si existian o no peliculas previas
    cartStorage.forEach(item => {
        updateButton(item.movie.id, item.amount === 0);
    });
}

async function fetchMovies() {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
        const data = await response.json();
        movies = data.results;
        displayMovies();
        buttonSetup();
    } catch (err) {
        console.error(err);
    }
}

function displayMovies() {
    movies.forEach(movie => {
        let container = document.createElement("div");
        container.className = "movie col-2 bg-secondary card border border-3 border-dark mb-2 p-1 fs-5";
        container.innerHTML =
            `
                    <div class="card-header bg-transparent ">
                        <p class="text-primary-emphasis fs-3">${movie.title}</p>
                    </div>
                    <div class="card-body row bg-transparent">
                        <div class="col-8">
                            <img class="movie-img rounded" src=https://image.tmdb.org/t/p/original/${movie.poster_path} alt=${movie.id}/>
                        </div>
                        <div class="btn-group col-4 d-flex align-items-center bg-transparent" role="group">
                            <button class="add btn btn-primary" id=${movie.id}>+</button>
                            <button class="sub btn btn-danger" id=${movie.id} disabled>-</button>
                        </div>
                    </div>
                    <div class="card-info bg-transparent">
                        <ul class="list-group list-group-flush bg-transparent">
                            <li class="list-group-item bg-transparent"></li>
                            <li class="list-group-item bg-transparent"><b>Price:</b> $${(movie.vote_average * 2).toFixed(2)}</li>
                            <li class="list-group-item bg-transparent"><b>Rating:</b> ${(movie.vote_average).toFixed(0)}</li>
                        </ul>
                    </div>
                `
        moviesDiv.appendChild(container)
    });

    buttonSetup();
}

//Carrito
let cart = document.getElementById("cart-content");
let cartStorage = JSON.parse(localStorage.getItem("cart")) || [];

//Limpia el carrito
function clearCart() {
    Swal.fire({
        title: "¿Esta seguro de limpiar el carrito?",
        text: "Esta por eliminar todos los elementos del carro, ¿esta seguro de que desea proseguir?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Limpieza terminada!",
                text: "",
                icon: "success"
            });
            localStorage.clear();
            cartStorage = [];
            updateCartDisplay();

            subButtons = document.querySelectorAll(".sub");
            subButtons.forEach(button => {
                button.disabled = true;
            });
        }
    });
}

//Updatea el estado del carro
function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cartStorage));
}

//Updatea el display del carro
function updateCartDisplay() {
    cart.innerHTML = '';
    let cartDiv = document.getElementById("cart");

    cartStorage.forEach(item => {
        let container = document.createElement("div");
        container.className = "cart-item d-flex justify-content-evenly align-items-center border-bottom border-3 border-secondary p-1";
        container.innerHTML =
            `
                <div class="fw-bold col-2"><img class="rounded" style="width: 80px; height: 100px; object-fit: cover;" src=https://image.tmdb.org/t/p/original/${item.movie.poster_path} alt=${item.movie.id}/></div>
                <div class="fw-bold col-3">${item.movie.title}</div>
                <div class="fw-bold col-1">$${(item.movie.vote_average * 2).toFixed(2)}</div>
                <div class="fw-bold col-2">Asientos: ${item.amount}</div>
                <div class="fw-bold col-2">Total: $${((item.movie.vote_average * 2) * item.amount).toFixed(2)}</div>
                <div class="col-2">
                    <div class="btn-group col-6 d-flex align-items-center bg-transparent" role="group">
                        <button class="add btn btn-primary" id=${item.movie.id}>+</button>
                        <button class="sub btn btn-danger" id=${item.movie.id}>-</button>
                    </div>
                </div>
            `

        cart.appendChild(container)
    })

    if (cartStorage.length > 0) {
        cartDiv.className = "col-8 cart mx-auto mb-4";
    } else {
        cartDiv.className = "d-none";
    }

    let buttonContainer = document.createElement("div");
    buttonContainer.className = "cart-buttons d-flex justify-content-end align-items-end";
    buttonContainer.innerHTML =
        `
            <div class="col-6"><a href="/buyPage.html"><button id="confirm" class="btn btn-lg btn-success w-100">Confirmar</button></a></div>
            <div class="col-6"><button id="clear" class="btn btn-lg btn-danger w-100">Limpiar Carrito</button></div>
            `

    cart.appendChild(buttonContainer)

    buttonSetup();
    updateCart();

    document.getElementById("clear").onclick = () => {
        clearCart();
    }
}

//Primera carga del estado del carrito y peliculas
fetchMovies();
updateCartDisplay();

//Filtra el objeto a agregar
function addFilterMovie(id) {
    updateButton(id, false);

    const selectedMovie = movies.find(movie => movie.id == id);
    const existingEntry = cartStorage.find(entry => entry.movie.id === selectedMovie.id);

    if (existingEntry) {
        existingEntry.amount++;
    } else {
        cartStorage.push({ amount: 1, movie: selectedMovie });
    }

    Toastify({
        text: `${selectedMovie.title} ha sido agregada con exito!`,
        duration: 4000,
        style: {
            background: "linear-gradient(to right, #3eb489, #90EE90)",
            color: "black",
            fontWeight: "bold",
            fontSize: "large"
        },
    }).showToast();

    updateCartDisplay();
}

//Filtra el objeto a remover
function removeFilterMovie(id) {
    const selectedMovie = movies.find(movie => movie.id == id);
    const existingEntry = cartStorage.find(entry => entry.movie.id === selectedMovie.id);

    if (!existingEntry) return;

    existingEntry.amount--;
    if (existingEntry.amount === 0) {
        updateButton(id, true);
        cartStorage.splice(cartStorage.indexOf(existingEntry), 1);
    }

    Toastify({
        text: `${selectedMovie.title} ha sido removido exitosamente`,
        duration: 4000,
        style: {
            background: "linear-gradient(to right, #AA0000, #fd5c63)",
            fontWeight: "bold",
            fontSize: "large"
        },
    }).showToast();

    updateCartDisplay();
}