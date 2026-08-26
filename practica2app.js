let punto1 = document.getElementById("mi-elemento")
console.log(punto1)
punto1.innerHTML = "Hola mundo!"
punto1.style.backgroundColor = "blue"

let punto2 = document.getElementsByClassName("mi-clase")

for (let i = 0; i < punto2.length; i++) {
    punto2[i].innerHTML = "Hola mundo!"
    punto2[i].style.color = "green"
}

let punto3 = document.getElementsByTagName("p")

for (let i = 0; i < punto3.length; i++) {
    punto3[i].innerHTML = "Hola mundo!"
    punto3[i].style.backgroundColor = "yellow"
    punto3[i].style.border = "1px"
}


