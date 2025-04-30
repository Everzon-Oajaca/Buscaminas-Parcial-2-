
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
      cell.addEventListener('click', () => {
        if (!juegoTerminado) ingresarNumero(x, y);
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

  function ingresarNumero(x, y) {
    const celda = board[x][y];

    if (celda.estado === 'revelado') return;

    const numero = parseInt(prompt("¿Cuántas minas hay alrededor de esta casilla (0-8)?"));
    if (isNaN(numero) || numero < 0 || numero > 8) return;

    celda.estado = 'revelado';
    celda.element.classList.add('revealed');
    celda.element.textContent = numero;
    celda.valor = numero;

    iniciarCronometro();

    const vecinos = obtenerVecinos(x, y);
    const posibles = [...vecinos];
    shuffle(posibles);
    const minas = posibles.slice(0, numero);

    minas.forEach(([i, j]) => {
      board[i][j].esMina = true;
    });

    actualizarNumeros();
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
  }
  
  function perder() {
    resetButton.textContent = '💀';
    juegoTerminado = true;
    clearInterval(intervalo);
    mostrarMinasSecuencial();
    const mensaje = document.getElementById('mensaje-final');
mensaje.textContent = '¡Perdiste!';
mensaje.classList.remove('mensaje-oculto');
mensaje.classList.add('mensaje-perdiste');



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
mensaje.textContent = '¡Ganaste!';
mensaje.classList.remove('mensaje-oculto');
mensaje.classList.add('mensaje-ganaste');
guardarMejorTiempo("10x10", tiempo);


    }
  }

  function deducir() {
    let cambios = true;
    while (cambios) {
      cambios = false;
      for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
          const celda = board[x][y];
          if (celda.estado !== 'revelado' || celda.valor === 0) continue;

          const vecinos = obtenerVecinos(x, y);
          const ocultos = vecinos.filter(([i, j]) => board[i][j].estado === 'oculto' && !board[i][j].esBandera);
          const banderas = vecinos.filter(([i, j]) => board[i][j].esBandera).length;

          if (celda.valor - banderas === ocultos.length) {
            ocultos.forEach(([i, j]) => {
              if (!board[i][j].esBandera) {
                board[i][j].esBandera = true;
                board[i][j].element.textContent = '🚩';
                board[i][j].element.classList.add('flag');
                minasRestantes--;
                minasRestantesDisplay.textContent = minasRestantes.toString().padStart(2, '0');
                cambios = true;
              }
            });
          }

          if (banderas === celda.valor) {
            ocultos.forEach(([i, j]) => {
              revelar(i, j);
              cambios = true;
            });
          }
        }
      }
    }
  }

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
