var punto4 = document.querySelectorAll(".destacado")

punto4.forEach((elemento) => {
    elemento.style.backgroundColor = "yellow"
})

var punto4f = document.querySelectorAll("#menu a")
punto4f.forEach((elemento) => {
    elemento.classList.add("activo")
})

var punto4g = document.querySelectorAll("img[alt]")
punto4g.forEach((elemento) => {
    elemento.style.border = "3px solid blue"
})
// nota: la interpretacion de numeros impares sera la de los indices de los elementos de la lista
//ya que imprime la lista como un arreglo aunque en el html se vea como si se aplicara a numeros pares.
var punto4h = document.querySelectorAll(".tareas li")
for (let i = 0; i < punto4h.length; i++) {
    if (i % 2 != 0) {
        punto4h[i].style.fontWeight = "bold"
    }
}

function punto4i() {
    var selector = document.querySelectorAll('input[type="checkbox"]')
    selector.forEach((elemento) => {
        if (elemento.checked) {
            elemento.checked = false
        }
    })
}

punto4i()
var contador = 1;

function crearLista() {
    var evaluadorLista = document.querySelector('#lista-tareas ul')
    if (!evaluadorLista) {
        let lista = document.createElement('ul')
        return lista
    }
    else {
        return evaluadorLista
    }
}

var agregarTarea = document.getElementById("agregar-tarea")
agregarTarea.addEventListener("click", function () {
    const tarea = document.createElement('li')
    tarea.textContent = "Nueva tarea " + contador
    contador++;
    var contenedor = document.getElementById('lista-tareas')
    var lista = crearLista()
    contenedor.appendChild(lista)
    lista.appendChild(tarea)
})

let numero1 = Math.random() * 11
console.log("Numero entre 0 y 10: "+ numero1)

let numero2 = Math.floor(Math.random() * 11)
console.log("Numero entero entre 0 y 10: "+ numero2)

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let numero3 = random(10,100)
console.log("Numero entero entre 10 y 100: "+ numero3)
let redondeoRound = Math.round(10.5555)

console.log("Redondeo con round: "+ redondeoRound)
let redondeoFloor = Math.floor(10.5555)
console.log("Redondeo con floor: "+ redondeoFloor)

let redondeoCeil = Math.ceil(10.5555)
console.log("Redondeo con ceil: "+ redondeoCeil)

let potenciaA= Math.pow(4,3)
console.log("Potencia de 4 elevado a 3: "+ potenciaA)

let potenciaB= Math.pow(5,2)
console.log("Potencia de 5 elevado a 2: "+ potenciaB)

let potenciaC= Math.pow(5,-2)
console.log("Potencia de 5 elevado a -2: "+ potenciaC)

let raizA= Math.sqrt(9)
console.log("Raíz cuadrada de 9: "+ raizA)

let raizB= Math.sqrt(64)
console.log("Raíz cuadrada de 64: "+ raizB)

let raizC= Math.sqrt(25)
console.log("Raíz cuadrada de 25: "+ raizC)

console.log(punto4h)
