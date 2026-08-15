const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
const instBox = document.getElementById('instructions');
const coordLabel = document.getElementById('coordinates');

// Botones y Elementos
const btnModePoints = document.getElementById('mode-points');
const btnModeCentroids = document.getElementById('mode-centroids');
const btnGenPoints = document.getElementById('btn-gen-points');
const btnGenCentroids = document.getElementById('btn-gen-centroids');
const btnStep = document.getElementById('btn-step');
const btnAuto = document.getElementById('btn-auto');
const btnReset = document.getElementById('btn-reset');
const btnExport = document.getElementById('btn-export');

// Paleta de colores vibrantes para clusters (Catppuccin Pastel)
const CLUSTER_COLORS = [
    '#f38ba8', // Rojo
    '#89b4fa', // Azul
    '#a6e3a1', // Verde
    '#f9e2af', // Amarillo
    '#fab387', // Naranja
    '#b4befe', // Lavanda
    '#eba0ac', // Melocotón
    '#94e2d5'  // Turquesa
];

let points = [];       // [{x, y, clusterId}]
let centroids = [];    // [{x, y, color, prevX, prevY}]
let mode = 'points';   // 'points' o 'centroids'
let nextPhase = 'assign'; // 'assign' o 'update'
let autoRunInterval = null;

// Escuchas de eventos (Event Listeners) - Buena práctica: desacoplar del HTML
btnModePoints.addEventListener('click', () => setMode('points'));
btnModeCentroids.addEventListener('click', () => setMode('centroids'));
btnGenPoints.addEventListener('click', generateRandomPoints);
btnGenCentroids.addEventListener('click', generateRandomCentroids);
btnStep.addEventListener('click', runStep);
btnAuto.addEventListener('click', toggleAutoRun);
btnReset.addEventListener('click', resetPlayground);
btnExport.addEventListener('click', exportToCSV);

// Registrar coordenadas del cursor en el canvas
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));
    coordLabel.innerText = `X: ${x}, Y: ${y}`;
});

// Manejar el clic en el canvas para dibujar
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (mode === 'points') {
        points.push({ x: x, y: y, cluster: -1 });
        updateStats();
        draw();
    } else if (mode === 'centroids') {
        if (centroids.length >= CLUSTER_COLORS.length) {
            alert(`¡Vaya! Has alcanzado el límite máximo de ${CLUSTER_COLORS.length} grupos.`);
            return;
        }
        const color = CLUSTER_COLORS[centroids.length];
        centroids.push({ x: x, y: y, color: color, prevX: x, prevY: y });
        nextPhase = 'assign';
        updateStats();
        draw();
    }
});

function setMode(newMode) {
    mode = newMode;
    btnModePoints.classList.toggle('active', mode === 'points');
    btnModeCentroids.classList.toggle('active', mode === 'centroids');

    if (mode === 'points') {
        instBox.innerText = "Modo Puntos activo: Haz clic en el lienzo negro para colocar tus datos de prueba.";
    } else {
        instBox.innerText = "Modo Centroides activo: Haz clic en el lienzo para colocar tus núcleos iniciales (cuadrados).";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar rejilla de fondo sutil
    ctx.strokeStyle = '#313244';
    ctx.lineWidth = 0.5;
    for (let i = 50; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let j = 50; j < canvas.height; j += 50) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
    }

    // Dibujar puntos de datos
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        if (p.cluster === -1) {
            ctx.fillStyle = '#a6adc8'; // Gris por defecto
            ctx.strokeStyle = '#11111b';
        } else {
            ctx.fillStyle = centroids[p.cluster].color;
            ctx.strokeStyle = '#ffffff';
        }
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
    });

    // Dibujar centroides
    centroids.forEach((c) => {
        ctx.fillStyle = c.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        const size = 14;
        ctx.fillRect(c.x - size/2, c.y - size/2, size, size);
        ctx.strokeRect(c.x - size/2, c.y - size/2, size, size);

        // Rastro de movimiento
        if (c.prevX !== c.x || c.prevY !== c.y) {
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(c.prevX, c.prevY);
            ctx.lineTo(c.x, c.y);
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });
}

function generateRandomPoints() {
    const centers = [
        { x: canvas.width * 0.25, y: canvas.height * 0.3 },
        { x: canvas.width * 0.75, y: canvas.height * 0.4 },
        { x: canvas.width * 0.5, y: canvas.height * 0.75 }
    ];

    for (let i = 0; i < 90; i++) {
        const center = centers[i % 3];
        const u1 = Math.random() || 0.0001;
        const u2 = Math.random() || 0.0001;
        const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        
        const x = center.x + randStdNormal * 45;
        const y = center.y + randStdNormal * 45;

        if (x > 10 && x < canvas.width - 10 && y > 10 && y < canvas.height - 10) {
            points.push({ x: x, y: y, cluster: -1 });
        }
    }
    updateStats();
    draw();
}

function generateRandomCentroids() {
    if (points.length === 0) {
        alert("⚠️ Primero genera o dibuja algunos puntos de datos.");
        return;
    }
    if (centroids.length >= CLUSTER_COLORS.length) {
        alert("⚠️ Límite de grupos alcanzado.");
        return;
    }

    const maxK = Math.min(4, CLUSTER_COLORS.length - centroids.length);
    for (let k = 0; k < maxK; k++) {
        const randomPoint = points[Math.floor(Math.random() * points.length)];
        const exists = centroids.some(c => c.x === randomPoint.x && c.y === randomPoint.y);
        if (!exists && centroids.length < CLUSTER_COLORS.length) {
            const color = CLUSTER_COLORS[centroids.length];
            centroids.push({
                x: randomPoint.x,
                y: randomPoint.y,
                color: color,
                prevX: randomPoint.x,
                prevY: randomPoint.y
            });
        }
    }
    nextPhase = 'assign';
    updateStats();
    draw();
}

function runStep() {
    if (points.length === 0 || centroids.length === 0) {
        alert("⚠️ Necesitas colocar al menos un punto de datos y un centroide para ejecutar el algoritmo.");
        return;
    }

    if (nextPhase === 'assign') {
        // FASE 1: ASIGNACIÓN (Distancia Euclídea)
        points.forEach(p => {
            let minDist = Infinity;
            let closestIdx = -1;

            centroids.forEach((c, idx) => {
                const dist = Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
                if (dist < minDist) {
                    minDist = dist;
                    closestIdx = idx;
                }
            });
            p.cluster = closestIdx;
        });

        nextPhase = 'update';
        instBox.innerHTML = "<strong>Fase de Asignación completada:</strong> Los puntos se pintaron según el centroide más cercano. <br><em>Siguiente paso: Actualización de centroides (promedio geométrico).</em>";
    } else {
        // FASE 2: ACTUALIZACIÓN (Media aritmética)
        let centroidsMoved = false;

        centroids.forEach((c, idx) => {
            c.prevX = c.x;
            c.prevY = c.y;

            const assignedPoints = points.filter(p => p.cluster === idx);
            if (assignedPoints.length > 0) {
                const sumX = assignedPoints.reduce((sum, p) => sum + p.x, 0);
                const sumY = assignedPoints.reduce((sum, p) => sum + p.y, 0);
                const newX = sumX / assignedPoints.length;
                const newY = sumY / assignedPoints.length;

                if (Math.abs(c.x - newX) > 0.1 || Math.abs(c.y - newY) > 0.1) {
                    centroidsMoved = true;
                }

                c.x = newX;
                c.y = newY;
            }
        });

        nextPhase = 'assign';
        if (!centroidsMoved) {
            instBox.innerHTML = "<strong>⭐ ¡CONVERGENCIA ALCANZADA! ⭐</strong><br>Los centroides ya no cambiaron de posición porque el error está en su mínimo local. ¡El entrenamiento ha terminado!";
            if (autoRunInterval) toggleAutoRun();
        } else {
            instBox.innerHTML = "<strong>Fase de Actualización completada:</strong> Los centroides se deslizaron hacia el centro de gravedad de su grupo. <br><em>Siguiente paso: Reasignar puntos con las nuevas coordenadas.</em>";
        }
    }

    updateStats();
    draw();
}

function toggleAutoRun() {
    if (autoRunInterval) {
        clearInterval(autoRunInterval);
        autoRunInterval = null;
        btnAuto.innerText = "⚡ Ejecución Automática";
        btnAuto.classList.remove('active');
    } else {
        if (points.length === 0 || centroids.length === 0) {
            alert("⚠️ Añade datos y centroides antes de iniciar.");
            return;
        }
        btnAuto.innerText = "⏸️ Pausar Simulación";
        btnAuto.classList.add('active');
        autoRunInterval = setInterval(runStep, 900);
    }
}

function calculateSSE() {
    if (centroids.length === 0 || points.length === 0) return 0;
    let sse = 0;
    points.forEach(p => {
        if (p.cluster !== -1) {
            const c = centroids[p.cluster];
            sse += Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
        }
    });
    return sse;
}

function updateStats() {
    document.getElementById('stat-points').innerText = points.length;
    document.getElementById('stat-k').innerText = centroids.length;
    
    const phaseLabel = document.getElementById('stat-phase');
    if (centroids.length === 0) {
        phaseLabel.innerText = "Añadir Centroides";
    } else if (nextPhase === 'assign') {
        phaseLabel.innerText = "Asignación";
    } else {
        phaseLabel.innerText = "Actualización";
    }

    const sse = calculateSSE();
    document.getElementById('stat-sse').innerText = sse.toLocaleString('es-ES', { maximumFractionDigits: 1 });
}

function resetPlayground() {
    if (autoRunInterval) toggleAutoRun();
    points = [];
    centroids = [];
    nextPhase = 'assign';
    updateStats();
    setMode('points');
    draw();
    instBox.innerHTML = "Modo Puntos activo: Haz clic en el lienzo negro para colocar tus datos de prueba.";
}

// ⬇️ Exportador CSV para interactuar con Python
function exportToCSV() {
    if (points.length === 0) {
        alert("⚠️ No hay puntos dibujados para exportar. ¡Dibuja o genera puntos primero!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,X,Y,Cluster\n";

    points.forEach(p => {
        csvContent += `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.cluster}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "datos_dibujados_kmeans.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

// Inicializar lienzo sutil vacío
draw();
