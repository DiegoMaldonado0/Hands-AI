# ProyectoIA-V2
Traductor y lector con voz de lenguaje de señas en tiempo real utilizando visión artificial y Machine Learning para el reconocimiento de cada seña

![image](https://github.com/user-attachments/assets/4808fbed-0c11-416a-8a04-8003adb28c30)

https://gaelnavarrete2004.github.io/proyecto-manos/

# Requerimientos
Recomiendo altamente ejecutar los scripts en Python 3.9, pues algunas de las librerías parecen dar problemas en versiones anteriores e incluso posteriores

Las librerias a instalar y que fueron utilizadas son:

1. opencv-python,

2. mediapipe,

3. scikit-learn,

4. pyttsx3

Las demás librerías suelen estar precargadas

# Explicación
El repositorio ya incluye un modelo entrenado con las señas incluidas en el ASL ALPHABET, por lo que solo hace falta descargar la carpeta del repositorio, extraerlo y crear una nueva carpeta que contenga el 'model.p' y el 'traductor_main.py' y desde ahí ejecutar dicho script, los siguientes pasos a seguir son para crear un nuevo dataset, entrenar un modelo que reconozca las imágenes cargadas y ponerlo en uso con información recabada en tiempo real, hacer esto puede suponer modificar el diccionario de clases, entre otros bloques de código en el script antes mencionado.

El repositorio incluye 4 archivos indispensables para crear un dataset, entrenar un modelo de IA y posteriormente usar este modelo para hacer predicciones en las señas que se muestran en cámara

-recolectar_imagenes.py: 

Es el primer archivo a ejecutar, al hacerlo veremos que se abre una ventana que usa la cámara para recolectar las imagenes de cada clase (cada clase siendo una seña en el lenguaje de señas), en el código está señalada que linea hay que modificar para elegir el número de imagenes a guardar, y el número de clases (señas) a registrar. Automaticamente están especificadas 26 clases y una recolección de 150 imagenes por cada una.

Una vez que la cámara esta abierta, hay que presionar la letra 'Q' para comenzar la detección de imágenes, mientras se está en esta fase hay que mantener a vista de la cámara la seña que queremos guardar. Este proceso se repetirá el número de veces que clases hayamos especificado en el código. Una vez terminado el proceso obtendremos una carpeta llamada 'data' con subcarpetas para cada clase, y dentro de cada una de estas carpetas tendremos todas las imágenes recien captadas por cada seña.

-crear_dataset.py:

Una vez creada la carpeta 'data' con las imágenes dentro, no hace falta más que ejecutar este nuevo script, que tomará toda la información de la carpeta para crear un archivo binario llamado 'data.pickle', este conteniene toda la información necesaria para entrenar a nuestro modelo.

-entrenar_modelo.py:

Ahora contamos con el archivo 'data.pickle', por lo que solo hace falta ejecutar este script para entrenar y testear el modelo encargado de la detección de señas. Al ejecutar el código terminaremos viendo un mensaje en consola que indica el porcentaje de datos detectado correctamente (Más información sobre este proceso se especifica en el reporte contenido en el repositorio)

-traductor_main.py:

Es el momento de ejecutar el ultimo script!, este archivo ejecutará de nueva cuenta una ventana que activa la cámara integrada de tu computador y está listo para detectar las señas que le enseñaste al modelo incluso reproducidas con voz

# Muestras del trabajo en tiempo real

Sí descargas el repositorio y deseas utilizar el traductor que yo creé, sólo es necesario que descargues 'model.p' y traductor_main.py, los mantengas en una sola carpeta y ejecutes el script de python desde ahí!, a continuación te dejo una imagen con las señas que el modelo ya reconoce, deja cualquier seña por más de 3 segundos y la aplicación dirá por medio de voz la seña que has puesto, disfrutalo!

![image](https://github.com/user-attachments/assets/56970398-fc81-4e6a-b619-0b5622aa3277)

![image](https://github.com/user-attachments/assets/01244b66-5dc0-4302-b150-5d4757227ecd)

![image](https://github.com/user-attachments/assets/2a42301e-9120-4067-9d31-9c75fcf47fe9)

![image](https://github.com/user-attachments/assets/1a624db3-f339-4c23-a0cc-a16a2407a22b)

# Muestras de la carpeta 'data' generada por medio de recolectar_imagenes.py

![image](https://github.com/user-attachments/assets/6e292cfe-a22b-4d7e-a45a-b9afb5f66b66)

![image](https://github.com/user-attachments/assets/0325026e-67e4-48cf-bbac-2bb5439c056c)
