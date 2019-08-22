// VARIABLES=================================
const canvas = document.getElementById("canvas");
const marcador = document.querySelectorAll(".marcador")[0];
const iniciar = document.getElementById("iniciar");
var ctx = canvas.getContext('2d');
const ancho = 700;
const alto = 300;
var imgAvatar, imgSuelo, imgObstaculo, imgObstaculo2, imgOvni;
const FPS = 50;
const suelo = 200;
var ramdom; 
// OBJETOS===================================
var avatar = {
    y: suelo,
    vy: 0,
    gravedad: 2,
    salto: 28,
    vymax: 9,
    saltando: false
};

var nivel = {
    velocidad: 9,
    puntuacion: 0,
    muerto: false
}

var obstaculo = {
    x: ancho + 100,
    y: suelo - 20
}

var obstaculo2 = {
    x: 100,
    y: suelo - 20
}

var ovni = {
    x: 680,
    y: 25,
    velocidad: 3,
    aparicion() {
        if(ramdom >= 300) {
            this.y = 25;
            return this.y;
        }else {
            this.y = -100;
            return this.y;
        }
    }
}

var fondo = {
    x: -700,
    y:60,
    velocidad: nivel.velocidad - (nivel.velocidad / 1.1)
}

var terreno = {
    x:0,
    y: 236
}

var nube = {
    x: ancho + 300,
    y: 35
}

var nube2 = {
    x: ancho + 300,
    y: 85
}
// EVENTLISTENER=============================
// JUGABILIDAD
//detecta si se preciona "barra espaciadora", "R", "click" o "bobleClick"
ctx.font = "75px impact";
ctx.fillStyle = '#088';
ctx.fillText(`LLEGA MÄS LEJOS`, 115,140);
ctx.font = "30px impact";
ctx.fillStyle = '#044';
ctx.fillText(`Juega presionando "espacio" ó haciendo "click"` , 55,200);

iniciar.addEventListener("click", function (e) {
    e.preventDefault();
    iniciarJuego(principal);
    iniciar.disabled = true;

    document.addEventListener("keyup", function (e) {
        if (e.keyCode == 32 || e.keyCode == 82) {
            if (nivel.muerto == false) {
                if (avatar.saltando !== true) {
                    saltar();
                }
            }else {
                if (e.keyCode == 82) {
                    puntajeMasAlto();
                    nivel.velocidad = 9;
                    fondo.velocidad = 2;
                    obstaculo.x = ancho + 100;
                    nivel.muerto = false;
                    nivel.puntuacion = 0;
                }
            }
        }
    });
    canvas.addEventListener("click", function (e) {
        e.preventDefault();
        if (nivel.muerto == false) {
            if (avatar.saltando !== true) {
                saltar();
            }
        }else {
            if (e.keyCode == 82) {
                puntajeMasAlto();
                nivel.velocidad = 9;
                fondo.velocidad = 2;
                obstaculo.x = ancho + 100;
                nivel.muerto = false;
                nivel.puntuacion = 0;
            }
        }
    });
    canvas.addEventListener("dblclick", function (e) {
        e.preventDefault();
        if (nivel.muerto == true) {   
            puntajeMasAlto();
            nivel.velocidad = 9;
            fondo.velocidad = 2;
            obstaculo.x = ancho + 100;
            nivel.muerto = false;
            nivel.puntuacion = 0;
        }
    });
});
// FUNCIONES=================================
//funcion donde todo se ejecuta.
function principal() {
    borrarCanvas();
    
    dibujarFondo();
    dibujarOvni();
    dibujarNube();
    dibujarNube2();
    dibujarSuelo();
    dibujarObstaculo();
    dibujarObstaculo2();
    dibujarAvatar();

    gravedad();
    logicaObstaculo();
    logicaOvni();
    logicaSuelo();
    logicaFondo();
    logicaNube();
    logicaNube2();
    
    colicion();
    puntuacion();
}

//limpiar canvas
function borrarCanvas() {
    canvas.width = ancho;
    canvas.height = alto;
}

//cargar imagenes
cargarAssets();
function cargarAssets(params) {
    imgAvatar = new Image();
    imgSuelo = new Image();
    imgObstaculo = new Image();
    imgObstaculo2 = new Image();
    imgOvni = new Image();
    imgFondo = new Image();
    imgNube = new Image();
    
    imgAvatar.src = "assets/roberto.png";
    imgSuelo.src = "assets/piso.png";
    imgObstaculo.src = "assets/obstaculo.png";
    imgObstaculo2.src = "assets/obstaculo.png";
    imgOvni.src = "assets/ovni2.png";
    imgFondo.src = "assets/fondo.png";
    imgNube.src = "assets/nube.png";
}

//dibujar objetos
function dibujarAvatar() {
    ctx.drawImage(imgAvatar, 0, 0, 68, 68, 80, avatar.y, 40, 40);
}

function dibujarObstaculo() {
    ctx.drawImage(imgObstaculo, 0, 0, 65, 65, obstaculo.x, obstaculo.y, 65, 65);
}

function dibujarObstaculo2() {
    ctx.drawImage(imgObstaculo2, 0, 0, 65, 65, obstaculo2.x + ramdom, obstaculo2.y, 65, 65);
}

function dibujarOvni() {
    ctx.drawImage(imgOvni, 0, 0, 60, 60, ovni.x, ovni.aparicion(), 50, 40);
}

function dibujarSuelo() {
    ctx.drawImage(imgSuelo, terreno.x,0, 700, 100, 0, terreno.y, 700, 100);
}

function dibujarFondo() {
    ctx.drawImage(imgFondo, fondo.x,0, 1400, 200, 0, fondo.y, 1400, 200);  
}

function dibujarNube() {
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube.x + 130, nube.y + 15, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube.x -100, nube.y - 10, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube.x -180, nube.y, 100, 40); 

    ctx.drawImage(imgNube, 0, 0, 100, 43, nube.x, nube.y, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube.x +200, nube.y - 30, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube.x +280, nube.y + 20, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube.x -80, nube.y, 100, 40);    
}

function dibujarNube2() {
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube2.x + 120, nube2.y + 50, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube2.x -100, nube2.y - 30, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube2.x -180, nube2.y, 100, 40); 

    ctx.drawImage(imgNube, 0, 0, 100, 43, nube2.x, nube2.y, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube2.x +280, nube2.y - 40, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube2.x +210, nube2.y + 40, 100, 40);
    ctx.drawImage(imgNube, 0, 0, 100, 43, nube2.x -70, nube2.y + 15, 100, 40);    
}

// gravedad 
function gravedad() {
    // si el avatar esta saltando, aplica gravedad, de lo contrario no. 
    if (avatar.saltando == true) {
        if (avatar.y - avatar.vy - avatar.gravedad > suelo) {
            // si esta en el suelo, ahi lo deja.
            avatar.saltando = false;
            avatar.vy = 0;
            avatar.y = suelo;
        }else {
            // de lo contrario, lo atrae al suelo.
            avatar.vy -= avatar.gravedad;
            avatar.y -= avatar.vy;                
        }
    }        
}
// obstaculo
function logicaObstaculo() {
    if (obstaculo.x < -100) {
        obstaculo.x = ancho + 100;
        nivel.puntuacion += 1;
    }else {
        obstaculo.x -= nivel.velocidad;
    }
    
    if (obstaculo2.x < -500) {
        obstaculo2.x = ancho + 400;
        ramdom = Math.floor(Math.random() * 500);
        nivel.puntuacion += 1;
    }else {
        obstaculo2.x -= nivel.velocidad;
    }

}
// suelo
function logicaSuelo() {
    if (terreno.x > ancho) {
        terreno.x = 0;
    }else {
        terreno.x += nivel.velocidad;
    }
}
// fondo
function logicaFondo() {
    if (fondo.x > 2000) {
        fondo.x = -1500;
    }else {
        fondo.x += fondo.velocidad;
    }
}
// ovni
function logicaOvni() {
    if (ovni.x < -100) {
        ovni.x = ancho + 10;
    }else {
        ovni.x -= ovni.velocidad;
    }
}

function logicaNube() {
    if (nube.x < -450) {
        nube.x = ancho + 300;
    }else {
        nube.x -= fondo.velocidad /2;
    }
}

function logicaNube2() {
    if (nube2.x < -450) {
        nube2.x = ancho + 300;
    }else {
        nube2.x -= fondo.velocidad * 1.2;
    }
}

// saltar
function saltar() {
    avatar.saltando = true;
    avatar.vy = avatar.salto;
}

// colision 
function colicion() {
    if (obstaculo.x >= 100 && obstaculo.x <= 110 && avatar.y >= suelo - 20) {
            nivel.muerto = true;
            nivel.velocidad = 0;
            fondo.velocidad = 0;            
        }
    if (obstaculo2.x >= 100 - ramdom && obstaculo2.x <= 110 -ramdom && avatar.y >= suelo - 20) {
        nivel.muerto = true;
        nivel.velocidad = 0;
        fondo.velocidad = 0;
    }
}

// puntuacion 
function puntuacion() {
    ctx.font = "30px impact";
    ctx.fillStyle = '#000';
    ctx.fillText(`${nivel.puntuacion}`, 600,50);
    
    if (nivel.muerto == true) {
        ctx.font = "50px impact";
        ctx.fillStyle = '#000';
        ctx.fillText(`GAMER OVER`, 230, 150);
        ctx.font = "30px impact";
        ctx.fillStyle = '#900';
        ctx.fillText(`-Preciona ( R ) para volver a intentar-`, 140, 180);  
        ctx.fillText(`-ó clickea dos veces-`, 230, 210);
    }

    if (nivel.muerto == false) {
        switch (nivel.puntuacion) {
            case 5:
                nivel.velocidad = 12;
            break;
        case 10:
            nivel.velocidad = 15;
            break;

        case 15:
            nivel.velocidad = 18;
            break;
        case 20:
            nivel.velocidad = 21;
            break;
        case 25:
            nivel.velocidad = 24;
            break;                
        }
    }
}

// Guardar puntuacion mas alta=============
puntajeMasAlto();
function puntajeMasAlto() {
    let ultimoHighScore = sessionStorage.getItem("highScore");

    if (nivel.puntuacion > ultimoHighScore) {
        sessionStorage.setItem("highScore", nivel.puntuacion);
    }
    nuevoHighScore = sessionStorage.getItem("highScore");
    marcador.innerHTML = `<h2 class="text-warning">${nuevoHighScore}</h2>`;
}
// BUCLE PRINCIPAL=========================
function iniciarJuego(activar) {
    setInterval(() => {
        activar();
    }, 1000/FPS);
}