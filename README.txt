DISTRIBUIDORA A.L.F. — INICIO

1. Subí el contenido de esta carpeta a la raíz del repositorio de GitHub.
2. Conectá el repositorio con Netlify. El archivo netlify.toml configura la carpeta pública y las funciones.
3. En Netlify > Site configuration > Environment variables, configurá:
   ALF_ADMIN_PASSWORD = una contraseña segura para el administrador
   ALF_SESSION_SECRET = una cadena larga y aleatoria
4. Volvé a desplegar el sitio.
5. Abrí /admin.html para ingresar y cargar productos.
6. Para activar pedidos, editá store.js y completá WHATSAPP_NUMBER con el número internacional sin + ni espacios.

El catálogo inicial está vacío. Los productos se agregan desde el administrador.
Este prototipo está pensado para insumos, accesorios, higiene y otros productos veterinarios no medicinales. No está diseñado para publicar ni gestionar pedidos de medicamentos veterinarios.
No compartas contraseñas ni claves secretas en chats o repositorios.
