<?php
// Comprueba si el formulario fue enviado usando el método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // --- CONFIGURACIÓN ---
    // Cambia esto a tu propio correo electrónico
    $tu_email = "tu-correo@tuempresa.com";
    $asunto = "Nuevo Mensaje del Portafolio ALARA";

    // --- RECOLECCIÓN Y LIMPIEZA DE DATOS ---
    
    // strip_tags() y htmlspecialchars() son medidas de seguridad básicas
    // para prevenir inyecciones de HTML o XSS.
    
    $nombre = strip_tags(trim($_POST["name"]));
    $nombre = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
    
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    
    $mensaje = strip_tags(trim($_POST["message"]));
    $mensaje = htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8');

    // --- VALIDACIÓN ---
    // Verifica que los campos no estén vacíos y que el email sea válido
    if (empty($nombre) || empty($mensaje) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Si algo falla, redirige de vuelta al formulario (o muestra un error)
        header("Location: index.php?status=error");
        exit;
    }

    // --- CONSTRUCCIÓN DEL CORREO ---
    $contenido = "Nombre: $nombre\n";
    $contenido .= "Email: $email\n\n";
    $contenido .= "Mensaje:\n$mensaje\n";

    // Cabeceras del correo
    $cabeceras = "From: $nombre <$email>";

    // --- ENVÍO DEL CORREO ---
    // La función mail() de PHP se usa para enviar el correo.
    if (mail($tu_email, $asunto, $contenido, $cabeceras)) {
        // Si se envía correctamente, redirige a una página de "gracias"
        // (o de vuelta al index con un mensaje de éxito)
        header("Location: index.php?status=success#contact");
    } else {
        // Si falla el envío
        header("Location: index.php?status=error#contact");
    }

} else {
    // Si alguien intenta acceder a process.php directamente
    echo "Acceso no permitido.";
}
?>