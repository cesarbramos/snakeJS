//VARIABLES GLOBALES
let velocidad = 13;
let tamano = 10;
let array_usuarios = [];
let first = true;
let container = document.getElementById("container");
let left = document.getElementById("left");
let left_text = document.getElementById("left_text");
let idk = document.getElementById("idk");
let btn = document.getElementById("btn");
let bodyColor = "";

let music = document.createElement("audio");
music.src = "SM3DW MAIN THEME.mp3";

btn.addEventListener("click", function(){
	bodyColor = document.getElementById("color").value;
	idk.style.display = "none";
	container.className = "";
});

let body = document.getElementById("body");
body.addEventListener("keydown", function(e){
	control(e);
});

function mostrarLeft(){
	this.left.className = "left";
}
function ocultarLeft(){
	this.left.className = "left nonDisplay";
	if(first){
		playSonido(music);
	}
}
class objeto {
	constructor(){
		this.tamano = tamano;
	}
	choque(obj){
		if(obj.x == this.x && obj.y == this.y){
			return true;
		} else {
			return false;
		}
	}
}

class Cola extends objeto {
	constructor(x,y,color){
		super();
		this.x = x;
		this.y = y;
		this.color = color;
		this.siguiente = null;
		this.puntuacion = 0;
		this.nombre_usuario = null;
	}
	dibujar(ctx){
		if(this.siguiente !== null){
			this.siguiente.dibujar(ctx);
		}
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
	}
	setxy(x,y){
		if(this.siguiente != null){
			this.siguiente.setxy(this.x, this.y);
		}
		this.x = x;
		this.y = y;
	}
	meter(){
		if(this.siguiente == null){
			this.siguiente = new Cola(this.x, this.y, bodyColor);
		}else{
			this.siguiente.meter();
		}
	}
	verSiguiente(){
		return this.siguiente;
	}
}

class Comida extends objeto {
	constructor(){
		super();
		this.x = this.generar();
		this.y = this.generar();
	}
	generar(){
		let num = (Math.floor(Math.random() * 59))*10;
		return num;
	}
	colocar(){
		this.x = this.generar();
		this.y = this.generar();
	}
	dibujar(ctx){
		ctx.fillStyle = "crimson";
		ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
	}
}
//OBJETOS DEL JUEGO
let cabeza = new Cola(20,20, "#fff");
cabeza.meter();
let comida = new Comida();
let ejex = true;
let ejey = true;
let xdir = 0;
let ydir = 0;
function movimiento(){
	let nx = cabeza.x+xdir;
	let ny = cabeza.y+ydir;
	cabeza.setxy(nx, ny);
}
function finDelJuego(){
	this.first = true;
	mostrarLeft();
	comida = new Comida();
	ejex = true;
	ejey = true;
	xdir = 0;
	ydir = 0;
	while(cabeza.nombre_usuario == null || cabeza.nombre_usuario == "" || cabeza.nombre_usuario == 0){
		cabeza.nombre_usuario = prompt("Escribe tu nombre de usuario");
	}
	let user = {
		nombre: cabeza.nombre_usuario,
		score: cabeza.puntuacion
	}
	array_usuarios.push(user);
	array_usuarios.sort(function (a, b) {
	  if (a.score > b.score) {
	    return -1;
	  }
	  if (a.score < b.score) {
	    return 1;
	  }
	  return 0;
	});
	cabeza = new Cola(20,20, "#fff");
	cabeza.meter();
	let puntos = document.getElementById("puntos");
	puntos.innerHTML = cabeza.puntuacion;
	let template = "";
	let tbody = document.getElementById("tbody");
	let counter = 0;
	array_usuarios.forEach(usuarios =>{
		counter++;
		
		template += `<tr>
						<td>${counter}</td>
						<td>${usuarios.nombre}</td>
						<td>${usuarios.score}</td>
					</tr>`;
		
	});
	tbody.innerHTML = template; 
	this.first = true;
}
function choqueCuerpo(){
	let temp = null;
	try{
		temp = cabeza.verSiguiente().verSiguiente();
	}catch(err){
		temp = null;
	}
	while(temp != null){
		if(cabeza.choque(temp)){
			finDelJuego();
		} else{
			temp = temp.verSiguiente();
		}
	}
}
function choquePared(){
	if(cabeza.x < 0 || cabeza.x > 590 || cabeza.y < 0 || cabeza.y > 590){
		finDelJuego();
	}
}
function comidaCuerpo(){
	let temp = null;
	try{
		temp = cabeza.verSiguiente().verSiguiente();
	}catch(err){
		temp = null;
	}
	while(temp != null){
		if(comida.choque(temp)){
			comida.colocar();
		} else{
			temp = temp.verSiguiente();
		}
	}
}
function playSonido(s){
	s.currentTime = 0;
	s.loop = true;
	s.play();
}
function control(event){
	let cod = event.keyCode;
	ocultarLeft();
	if(cod == 107){
		velocidad+= 10;
	}
	if(cod == 109){
		velocidad-= 10;
	}
	if(cod == 27){
		if(confirm("¿Realmente deseas rendirte?")){
			finDelJuego();
		}else{
			alert("Rendición cancelada");
		}
	}
	if(ejex){
		if(cod == 38){
			first = false;
			ydir = -tamano;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
		if(cod == 40){
			first = false;
			ydir = tamano;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
	} else if(ejey){
		if(cod == 37){
			first = false;
			ydir = 0;
			xdir = -tamano;
			ejey = false;
			ejex = true;
		}
		if(cod == 39){
			first = false;
			ydir = 0;
			xdir = tamano;
			ejey = false;
			ejex = true;
		}
	}
}
function dibujar(){
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	ctx.clearRect(0,0, canvas.width, canvas.height);
	//AQUI ABAJO VA TODO EL DIBUJO
	cabeza.dibujar(ctx);
	comida.dibujar(ctx);
	
}
function main(){
	movimiento();
	dibujar();
	comidaCuerpo();
	choquePared();
	choqueCuerpo();
	
	if(cabeza.choque(comida)){
		cabeza.puntuacion+= 1;
		comida.colocar();
		cabeza.meter();
		let puntos = document.getElementById("puntos");
		puntos.innerHTML = cabeza.puntuacion;
	}
	
}
setInterval("main()", 1000/velocidad);