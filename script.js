
document.addEventListener("DOMContentLoaded", () => {
  const boardSize = 10;
  const totalMinas = 15;
  const board = [];
  const boardElement = document.getElementById('board');
  const timerDisplay = document.getElementById('timer');
  const minasRestantesDisplay = document.getElementById('mines-count');
  const resetButton = document.getElementById('reset-button');
  let juegoTerminado = false;
  let tiempo = 0;
  let intervalo = null;
  let minasRestantes = totalMinas;

// NUEVO: Para advertencia antes de ingresar número manualmente
let advertenciaPendiente = null;

function mostrarAdvertencia(x, y) {
  advertenciaPendiente = { x, y };
  document.getElementById("advertencia-modal").classList.remove("oculto");
}






  function iniciarCronometro() {
    if (!intervalo) {
      intervalo = setInterval(() => {
        tiempo++;
        timerDisplay.textContent = tiempo.toString().padStart(3, '0');
      }, 1000);
    }
  }

  function reiniciarJuego() {
    location.reload();
  }

  resetButton.addEventListener('click', reiniciarJuego);

  // Crear tablero
  for (let x = 0; x < boardSize; x++) {
    board[x] = [];
    for (let y = 0; y < boardSize; y++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
     //ell.addEventListener('click', () => {
       //f (!juegoTerminado) ingresarNumero(x, y);
     //);
//FUNCION  CASI BUENA:
     //cell.addEventListener('click', () => {
      //if (juegoTerminado) return;
    
      //const celda = board[x][y];
    
      // Si ya está revelada, no hacer nada
      //if (celda.estado === 'revelado') return;
    
      // ⚠️ Si no ha sido deducida (no tiene número y no es parte de expansión segura)
      //if (celda.valor === 0 && !celda.esMina && !celda.esBandera) {
       // ingresarNumero(x, y); // Primera vez, pide número
     // } else if (celda.estado === 'oculto') {
       // const seguro = confirm("⚠️ Esta casilla no ha sido deducida como segura. ¿Deseas arriesgarte?");
      //  if (seguro) {
       //   revelar(x, y); // El jugador acepta arriesgarse
    //    }
     // }
    //  });
    
    cell.addEventListener('click', () => {
      if (juegoTerminado) return;
    
      const celda = board[x][y];
      if (celda.estado === 'revelado') return;
    
      if (celda.valor === 0 && !celda.esMina && !celda.esBandera) {
        ingresarNumero(x, y, null);// primera vez
      } else if (celda.estado === 'oculto') {
        mostrarAdvertencia(x, y); // muestra advertencia antes de permitir acción
      }
    });
    

      boardElement.appendChild(cell);

      board[x][y] = {
        estado: 'oculto',
        valor: 0,
        esMina: false,
        esBandera: false,
        element: cell
      };
    }
  }

  function obtenerVecinos(x, y) {
    const coords = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
          coords.push([nx, ny]);
        }
      }
    }
    return coords;
  }

  function ingresarNumero(x, y, numeroManual = null) {
    const celda = board[x][y];

    if (celda.estado === 'revelado') return;

   // const numero = parseInt(prompt("¿Cuántas minas hay alrededor de esta casilla (0-8)?"));
    //if (isNaN(numero) || numero < 0 || numero > 8) return;
    let numero = numeroManual;

   if (numero === null) {
     numero = parseInt(prompt("¿Cuántas minas hay alrededor de esta casilla (0-8)?"));
    }
    
  


    if (isNaN(numero) || numero < 0 || numero > 8) return;
    
    celda.estado = 'revelado';
    celda.element.classList.add('revealed');
    celda.element.textContent = numero;
    celda.valor = numero;

    iniciarCronometro();

    const vecinos = obtenerVecinos(x, y);
   // const posibles = [...vecinos];
    //shuffle(posibles);
    //const minas = posibles.slice(0, numero);




//CASI BUENA 
// Calcular un puntaje de riesgo para cada vecino
//const puntuaciones = vecinos.map(([i, j]) => {
  //let riesgo = 0;

  // Revisar los vecinos de esta casilla vecina
  //const subVecinos = obtenerVecinos(i, j);
  //subVecinos.forEach(([sx, sy]) => {
    //const celdaVecina = board[sx][sy];
    //if (celdaVecina.estado === 'revelado') {
      //riesgo += celdaVecina.valor;
    //}
  //});

  //return { coords: [i, j], riesgo };
//});

// Ordenar: menos riesgo al principio
//puntuaciones.sort((a, b) => a.riesgo - b.riesgo);

// Tomar los N más seguros como minas (menos riesgo para el jugador)
//const minas = puntuaciones.slice(0, numero).map(p => p.coords);

// Colocar las minas
//minas.forEach(([i, j]) => {
  //board[i][j].esMina = true;
//});





//CASI BUENA 2.1
//const probabilidad = numero / 8; // de 0.0 a 1.0
//const minas = [];

//vecinos.forEach(([i, j]) => {
  //const aleatorio = Math.random();
  //if (aleatorio < probabilidad && minas.length < numero) {
    //board[i][j].esMina = true;
    //minas.push([i, j]);
  //}
//});

// Si no se asignaron suficientes minas (por suerte), completar aleatoriamente
//if (minas.length < numero) {
  //const restantes = vecinos.filter(([i, j]) => !board[i][j].esMina);
  //shuffle(restantes);
  //restantes.slice(0, numero - minas.length).forEach(([i, j]) => {
    //board[i][j].esMina = true;
   // minas.push([i, j]);
  //});
//}


const probabilidad = numero / 8;
const minas = [];

// Generar una puntuación aleatoria con variabilidad controlada
const puntuaciones = vecinos.map(([i, j]) => {
  const variacion = Math.random() * 0.4 - 0.2; // rango: -0.2 a +0.2
  const score = probabilidad + variacion; // valor entre 0 y 1
  return { coords: [i, j], score };
});

// Ordenar puntuaciones de mayor a menor
puntuaciones.sort((a, b) => b.score - a.score);

// Tomar las N primeras con mejor puntuación
const seleccionadas = puntuaciones.slice(0, numero);

// Marcar las minas
// Marcar las minas, pero solo si no están reveladas
seleccionadas.forEach(({ coords }) => {
  const [i, j] = coords;
  const celdaVecina = board[i][j];

  if (celdaVecina.estado !== 'revelado') {
    celdaVecina.esMina = true;
    minas.push([i, j]);
  }
});







    actualizarNumeros();
    deducir();
    deducir();
    verificarVictoria();

    // Si la casilla donde se ingresó número es mina por error, perder
    if (celda.esMina) {
      celda.element.textContent = '💣';
      celda.element.classList.add('mine');
      perder();
    }



  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function actualizarNumeros() {
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        if (board[x][y].esMina) continue;
        const vecinos = obtenerVecinos(x, y);
        let count = 0;
        vecinos.forEach(([i, j]) => {
          if (board[i][j].esMina) count++;
        });
        board[x][y].valor = count;
      }
    }
  }

  function revelar(x, y) {
    const queue = [[x, y]];
  
    while (queue.length > 0) {
      const [cx, cy] = queue.shift();
      const celda = board[cx][cy];
  
      if (celda.estado === 'revelado' || celda.esBandera) continue;
  
      celda.estado = 'revelado';
      celda.element.classList.add('revealed');
      celda.element.dataset.num = celda.valor;
  
      if (celda.esMina) {
        celda.element.textContent = '💣';
        celda.element.classList.add('mine');
        perder();
        return;
      } else if (celda.valor === 0) {
        celda.element.textContent = '';
        const vecinos = obtenerVecinos(cx, cy);
        vecinos.forEach(([nx, ny]) => {
          if (board[nx][ny].estado === 'oculto') {
            queue.push([nx, ny]);
          }
        });
      } else {
        celda.element.textContent = celda.valor;
      }
    }
    deducir();

  }
  
  function perder() {
    resetButton.textContent = '💀';
    juegoTerminado = true;
    clearInterval(intervalo);
    mostrarMinasSecuencial();
    const mensaje = document.getElementById('mensaje-final');
    mensaje.textContent = '💥 ¡Perdiste!';
    mensaje.classList.remove('mensaje-oculto');
    mensaje.classList.add('mensaje-perdiste', 'animado');
    



  }

  function mostrarMinasSecuencial() {
    const minas = [];

    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        const celda = board[x][y];
        if (celda.esMina && celda.estado !== 'revelado') {
          minas.push(celda);
        }
      }
    }

    minas.forEach((celda, index) => {
      setTimeout(() => {
        celda.element.textContent = '💣';
        celda.element.classList.add('mine');
      }, index * 150);
    });
  }

  function verificarVictoria() {
    let todasReveladas = true;
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        const celda = board[x][y];
        if (!celda.esMina && celda.estado !== 'revelado') {
          todasReveladas = false;
        }
      }
    }
    if (todasReveladas && !juegoTerminado) {
      resetButton.textContent = '😎';
      juegoTerminado = true;
      clearInterval(intervalo);
      const mensaje = document.getElementById('mensaje-final');

      mensaje.textContent = '🎉 ¡Ganaste!';
      mensaje.classList.remove('mensaje-oculto');
      mensaje.classList.add('mensaje-ganaste', 'animado');
      


guardarMejorTiempo("10x10", tiempo);


    }
  }

 //function deducir() {
   // let cambios = true;
    //while (cambios) {
      //cambios = false;
      //for (let x = 0; x < boardSize; x++) {
        //for (let y = 0; y < boardSize; y++) {
          //const celda = board[x][y];
          //if (celda.estado !== 'revelado' || celda.valor === 0) continue;

          //const vecinos = obtenerVecinos(x, y);
          //const ocultos = vecinos.filter(([i, j]) => board[i][j].estado === 'oculto' && !board[i][j].esBandera);
          //const banderas = vecinos.filter(([i, j]) => board[i][j].esBandera).length;

          //if (celda.valor - banderas === ocultos.length) {
           // ocultos.forEach(([i, j]) => {
           ///  if (!board[i][j].esBandera) {
               // board[i][j].esBandera = true;
               // board[i][j].element.textContent = '🚩';
               // board[i][j].element.classList.add('flag');
               // minasRestantes--;
               // minasRestantesDisplay.textContent = minasRestantes.toString().padStart(2, '0');
               // cambios = true;
             // }
           // });
          //}

// Si el número de casillas ocultas alrededor equivale al valor, deben ser todas minas
//if (ocultos.length > 0 && celda.valor === ocultos.length) {
  //ocultos.forEach(([i, j]) => {
    //const vecino = board[i][j];
    //if (!vecino.esBandera && vecino.estado === 'oculto') {
      ///vecino.esBandera = true;
      //vecino.element.textContent = '🚩';
      //vecino.element.classList.add('flag');
      //minasRestantes--;
      //minasRestantesDisplay.textContent = minasRestantes.toString().padStart(2, '0');
      //cambios = true;
  //  }
  //});
//}







  //        if (banderas === celda.valor) {
    //        ocultos.forEach(([i, j]) => {
      //        revelar(i, j);
        //      cambios = true;
          //  });
//          }
  //      }
    //  }
    //}
  //}

 
  function deducir() {
    const tablaProbabilidad = {
      0: 0.00,
      1: 0.125,
      2: 0.25,
      3: 0.375,
      4: 0.5,
      5: 0.625,
      6: 0.75,
      7: 0.875,
      8: 1.0
    };
  
    let cambios = true;
  
    while (cambios) {
      cambios = false;
  
      for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
          const celda = board[x][y];
          if (!celda || celda.estado !== 'revelado' || celda.valor === 0) continue;
  
          const vecinos = obtenerVecinos(x, y);
          const ocultos = vecinos.filter(([i, j]) => board[i][j] && board[i][j].estado === 'oculto' && !board[i][j].esBandera);
          const banderas = vecinos.filter(([i, j]) => board[i][j] && board[i][j].esBandera).length;
          const restantes = celda.valor - banderas;
  
          console.log(`Celda [${x},${y}] => valor: ${celda.valor}, banderas: ${banderas}, ocultos: ${ocultos.length}, restantes: ${restantes}`);
  
          // ✅ Caso 1: deducción exacta - todas las ocultas son minas
          if (restantes > 0 && restantes === ocultos.length) {
            ocultos.forEach(([i, j]) => {
              const vecino = board[i][j];
              if (vecino && vecino.element && vecino.estado === 'oculto' && !vecino.esBandera) {
                vecino.esBandera = true;
                vecino.element.textContent = '🚩';
                vecino.element.classList.add('flag');
                minasRestantes--;
                minasRestantesDisplay.textContent = minasRestantes.toString().padStart(2, '0');
                cambios = true;
              }
            });
          }
  
          // ✅ Caso 2: deducción lógica - todas las demás son seguras
          if (banderas === celda.valor) {
            ocultos.forEach(([i, j]) => {
              revelar(i, j);
              cambios = true;
            });
          }
  
          // ✅ Caso 3: deducción por probabilidad
          if (restantes > 0 && ocultos.length > 0) {
            const probabilidadTeorica = tablaProbabilidad[celda.valor];
            const probabilidadReal = restantes / ocultos.length;
  
            if (probabilidadReal >= probabilidadTeorica && probabilidadReal >= 0.75) {
              ocultos.forEach(([i, j]) => {
                const vecino = board[i][j];
                if (vecino && vecino.element && vecino.estado === 'oculto' && !vecino.esBandera) {
                  vecino.esBandera = true;
                  vecino.element.textContent = '🚩';
                  vecino.element.classList.add('flag');
                  minasRestantes--;
                  minasRestantesDisplay.textContent = minasRestantes.toString().padStart(2, '0');
                  cambios = true;
                }
              });
            }
          }
        }
      }
    }
  }
  
  



  document.getElementById("advertencia-confirmar").addEventListener("click", () => {
    document.getElementById("advertencia-modal").classList.add("oculto");
  
    if (!advertenciaPendiente) return;
    const { x, y } = advertenciaPendiente;
    const celda = board[x][y];
  
    if (celda.esMina) {
      celda.estado = 'revelado';
      celda.element.textContent = '💣';
      celda.element.classList.add('mine');
      perder();
    } else {
      ingresarNumero(x, y, null); // correcto
    }
  
    advertenciaPendiente = null;
  });
  
  document.getElementById("advertencia-cancelar").addEventListener("click", () => {
    document.getElementById("advertencia-modal").classList.add("oculto");
    advertenciaPendiente = null;
  });
  


  // Inicializar interfaz
  timerDisplay.textContent = '000';
  minasRestantesDisplay.textContent = totalMinas.toString().padStart(2, '0');
















  




});

function guardarMejorTiempo(dificultad, tiempo) {
  const record = { dificultad, tiempo };
  let records = JSON.parse(localStorage.getItem('mejoresTiempos')) || [];

  // Si ya existe un tiempo para la misma dificultad, actualizar solo si es mejor
  const existente = records.find(r => r.dificultad === dificultad);
  if (existente) {
    if (tiempo < existente.tiempo) {
      existente.tiempo = tiempo;
    }
  } else {
    records.push(record);
  }

  localStorage.setItem('mejoresTiempos', JSON.stringify(records));
  mostrarMejoresTiempos();

// NUEVO: Manejo de botones del modal de advertencia



}

function mostrarMejoresTiempos() {
  const records = JSON.parse(localStorage.getItem('mejoresTiempos')) || [];
  const tabla = document.getElementById('high-scores');
  if (!tabla) return;
  tabla.innerHTML = '';

  records.sort((a, b) => a.tiempo - b.tiempo);

  records.forEach(r => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${r.dificultad}</td><td>${r.tiempo}</td>`;
    tabla.appendChild(fila);
  });
}

mostrarMejoresTiempos();



document.getElementById("show-scores-btn").addEventListener("click", () => {
  const panel = document.getElementById("score-panel");
  panel.classList.toggle("mensaje-oculto");
});



document.getElementById("ayuda-btn").addEventListener("click", () => {
  const nuevaVentana = window.open("", "Instrucciones", "width=600,height=600");

  nuevaVentana.document.write(`
    <html>
      <head>
        <title>Instrucciones del Juego</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f9fc;
            padding: 20px;
            line-height: 1.6;
          }
          h2 {
            color: #2c3e50;
          }
          ul, ol {
            padding-left: 20px;
          }
          li {
            margin-bottom: 10px;
          }
          .section-title {
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h2>Instrucciones del Juego: Buscaminas 10x10</h2>
  
        <div class="section-title">🎯 Objetivo del juego</div>
        <p>Descubrir todas las casillas que no contienen minas en un tablero de 10x10, utilizando la lógica y las pistas numéricas que el propio jugador proporciona al hacer clic.</p>
  
        <div class="section-title">🕹️ Cómo jugar</div>
        <ol>
          <li><strong>Inicio del juego:</strong><br>
          - Al cargar la página, se muestra un tablero vacío de 10x10 casillas ocultas.<br>
          - No hay minas colocadas automáticamente desde el inicio.</li>
  
          <li><strong>Primer clic en una casilla:</strong><br>
          - Al hacer clic por primera vez en una casilla, se te pedirá ingresar un número del 0 al 8.<br>
          - Ese número representa la cantidad de minas que tú decides que hay alrededor de esa casilla.</li>
  
          <li><strong>Colocación automática de minas:</strong><br>
          - El sistema coloca aleatoriamente la cantidad de minas indicada alrededor de esa casilla (zona 3x3).<br>
          - Si colocas una mina sobre la casilla seleccionada, pierdes automáticamente.</li>
  
          <li><strong>Deducción automática:</strong><br>
          - El juego analiza los números revelados y sus alrededores.<br>
          - Si detecta con certeza dónde hay minas, coloca banderas automáticamente (🚩).<br>
          - Si detecta que una casilla es segura, la revela automáticamente.</li>
  
          <li><strong>Advertencia:</strong><br>
          - Si haces clic en una casilla que no ha sido deducida como segura, el juego mostrará una advertencia.<br>
          - Si aceptas, puedes ingresar un número manualmente. Si resulta ser una mina, pierdes.</li>
  
          <li><strong>Perder:</strong><br>
          - Si revelas una mina (por clic o por error de entrada), el juego termina.<br>
          - Las minas se revelan una por una con animación y aparece el mensaje "💥 ¡Perdiste!".</li>
  
          <li><strong>Ganar:</strong><br>
          - Si revelas todas las casillas sin minas correctamente, aparece el mensaje "🎉 ¡Ganaste!" y se guarda tu tiempo.</li>
  
          <li><strong>Reiniciar:</strong><br>
          - Haz clic en la carita (😃) para reiniciar el juego desde cero.</li>
        </ol>
  
        <div class="section-title">✨ Extras</div>
        <ul>
          <li>El cronómetro inicia con la primera acción del jugador.</li>
          <li>El tiempo transcurrido se muestra en la parte superior junto al botón de reinicio.</li>
          <li>Puedes ver tus mejores tiempos en el botón 🏆 Ver Mejores Tiempos.</li>
          <li>También tienes acceso a esta ayuda en cualquier momento con el botón ❓ Ayuda.</li>
        </ul>
      </body>
    </html>
  `);
  
});

