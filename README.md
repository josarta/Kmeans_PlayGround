# 👾 K-Means Interactive Playground: ¡Juega con la Inteligencia Artificial!

Este repositorio contiene un simulador visual e interactivo diseñado para entender de manera intuitiva y práctica la geometría y el comportamiento del algoritmo de **Agrupación K-medias (K-Means)**. 

En lugar de leer fórmulas abstractas, este programa te permite dibujar tus propios datos en una pantalla, colocar "imanes" (centroides) de colores y ver paso a paso cómo la computadora los organiza en tiempo real.

---

## 🌐 Simulador Web en Vivo
Se desplego una aplicación web interactiva donde puedes dibujar tus propios datos y ver cómo funciona el algoritmo de K-medias paso a paso.

👉 **[Entrar al K-Means Playground en Vivo](https://josarta.github.io/Kmeans_PlayGround/)**

---

## 🧪 2. Análisis con Python y Scikit-Learn
Para complementar la experiencia visual,  dispongo  un cuaderno de Jupyter que toma los datos que exportas de la web y los analiza utilizando librerías científicas de Python.


### ¿Cómo ver y ejecutar el análisis?
* **Vista Rápida (Estática):** Puedes ver el código y las gráficas generadas haciendo clic directamente en: [Ver analisis_kmeans.ipynb](notebooks/Analisis_kmeans.ipynb).
* **Ejecutar en la Nube (Interactivo):** Haz clic en el siguiente botón para abrir el código en Google Colab, donde podrás correr el modelo en tiempo real e interactuar con el simulador embebido:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/josarta/Kmeans_PlayGround/blob/main/analisis_kmeans.ipynb)



## 🎮 ¿Cómo Funciona el Juego?

El simulador recrea las fases reales de optimización del algoritmo K-medias a través de una interfaz interactiva construida en `tkinter`:

1. **✍️ Dibuja tus Datos (Puntos Gris):**
   * Selecciona **"Dibujar Puntos"** y haz clic en el lienzo negro para colocar tus datos donde quieras.
   * *¿Prefieres automatizarlo?* Haz clic en **"Generar Aleatorios"** para que el sistema cree nubes gaussianas de puntos perfectas.

2. **📍 Coloca tus Centroides (Líderes de Grupo):**
   * Cambia al modo **"Dibujar Centroides"** y haz clic en la pantalla para posicionar tus representantes (rojo, azul, verde, etc.).
   * Alternativamente, haz clic en **"Centroides Aleatorios"** para que el algoritmo elija las posiciones iniciales automáticamente.

3. **👟 Siguiente Paso (Fase de Asignación y Actualización):**
   * **Paso 1 (Asignar):** Cada punto gris calcula su distancia euclídea hacia todos los centroides y se pinta del color de su centroide más cercano.
   * **Paso 2 (Actualizar):** Cada centroide calcula el promedio geométrico (la media) de sus puntos asignados y se desliza físicamente hacia esa nueva coordenada.
   * **¡Convergencia!** Sigue haciendo clic hasta que los centroides dejen de moverse. ¡En ese momento, el algoritmo ha terminado de entrenar!

4. **⚡ Ejecución Rápida:**
   * Si no quieres ir paso a paso, haz clic en este botón para ver la animación automática y cómo el sistema encuentra la solución en segundos.

---

## 🛠️ Requisitos e Instalación

Este simulador está desarrollado utilizando la biblioteca estándar de Python, por lo que **no requiere instalar dependencias adicionales** (como PyGame o librerías pesadas). Solo necesitas Python instalado en tu computadora.

### **Instrucciones para Jugar:**
1. Descarga el archivo `kmeans_playground.py` desde el panel de **Studio**.
2. Abre tu terminal o consola de comandos en el directorio donde guardaste el archivo.
3. Ejecuta el siguiente comando:
   ```bash
   python kmeans_playground.py
   ```
4. ¡Diviértete diseñando nubes de puntos complejas y viendo cómo bailan los centroides!

---

## 🧠 Teoría de Agrupación detrás del Juego (Grounded Conceptos)

El juego ilustra de manera directa los conceptos clave que estudias en el curso de **Aprendizaje No Supervisado**:

* **Minimización del Error Cuadrático (SSE):** Cada vez que los centroides se mueven en la fase de "Actualización", están calculando matemáticamente el centro promedio para minimizar la suma de errores al cuadrado relativa a sus prototipos.
* **Sensibilidad a la Inicialización:** Si intentas colocar los centroides muy cerca unos de otros o en esquinas aisladas, verás cómo el algoritmo puede quedar atrapado en óptimos locales extraños. Esto demuestra de forma práctica por qué la inicialización inteligente (como K-means++) es tan importante.
* **Maldición de la Dimensionalidad:** El juego opera en un espacio bidimensional (2D: X e Y), lo que nos permite visualizar la distancia euclídea de manera perfecta. En la realidad, las agrupaciones se realizan en cientos de dimensiones donde esta geometría visual es imposible de trazar.
