# Aplicación para cargar Facturas

### Instalar dependencias
```
npm install
```

### Compilar para desarrollo
```
npm run serve
```

### Compilar y minificar para producción
```
npm run build
```

### Deployar a producción (Luego de configurar Firebase)
```
npm run deploy
```

### Ejecutar test
```
npm run test
```

### Verificar y corregir código fuente
```
npm run lint
```

### Personalizar configuración
Ver [Referencia de Configuración](https://cli.vuejs.org/config/).

## Configurar Firebase

### Crear proyecto

1. Ingresar a la siguiente url https://firebase.google.com/

2. Hacer click en el botón `Ir a la consola` (El cual se encuentra en la esquina superior derecha)

    ![imagen](/README/img1.png)

3. Luego hacer click en `Añadir proyecto`

    ![imagen](/README/img2.png)

4. Completar el nombre del proyecto

    ![imagem](/README/img3.png)

5. Aceptamos los terminos y condiciones

    ![imagem](/README/img4.png)

5. Luego hacemos click en `Crear proyecto`

    ![imagem](/README/img5.png)

6. Esperamos a que finalice la creación, luego hacemos click en continuar

    ![imagem](/README/img6.png)

7. A continuación nos muestra la siguiente pantalla

    ![imagem](/README/img7.png)

### Configurar SDK de Firebase para la web

1. Hacemos click en el siguiente botón ![imagen](/README/img8.png)

    Este botón se encuentra en la pantalla inicial

    ![imagem](/README/img9.png)

2. Añadimos el apodo de la aplicación (Parte de la url a mostrarse en producción)

    ![imagem](/README/img10.png)

3. Luego hacemos click en `Registrar aplicación`

    ![imagem](/README/img11.png)

4. A continuación se muestra los datos del SDK a configurar para la web

    ![imagem](/README/img12.png)

5. Copiar o renombrar el archivo llamado `.env` a `.env.local` y reemplazar los valores del SDK a su correspondiente variable

    ![imagem](/README/img13.png)

### Configurar Firebase Functions

1. Ingresar a la url https://firebase.google.com/docs/database/admin/start?hl=es-419

2. Luego hacer click en el link [configurar el SDK de administrador de Firebase](https://firebase.google.com/docs/admin/setup?hl=es-419#add_firebase_to_your_app)

    ![imagem](/README/img14.png)

3. Ir a la sección [Inicializa el SDK](https://firebase.google.com/docs/admin/setup?hl=es-419#initialize_the_sdk)

    ![imagem](/README/img15.png)

4. Luego hacer click en link [Cuentas de servicio](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk?hl=es-419)

    ![imagem](/README/img16.png)

5. Elegir el proyecto creado

    ![imagem](/README/img17.png)

6. A continuación se muestra la siguiente pantalla

    ![imagem](/README/img18.png)

7. Hacer click en el botón `Generar nueva clave privada`

    ![imagem](/README/img19.png)

8. Se mostrará la siguiente ventana

    ![imagem](/README/img20.png)

9. Hacer click en el botón `Generar clave`

    ![imagem](/README/img21.png)

10. Luego de descargarse el archivo debe moverlo a la carpeta `functions` del repositorio con el nombre cambiado a `serviceAccountKey.json`. Con esto concluye la configuración.
