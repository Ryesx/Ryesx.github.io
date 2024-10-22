<?php
session_start(); // Inicia la sesión

$host = 'localhost';
$dbname = 'tienda_online'; // Nombre de tu base de datos
$username = 'root';
$password = '';

// Conectar a la base de datos
$conn = new mysqli($host, $username, $password, $dbname);

// Comprobar si la conexión fue exitosa
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Procesar el formulario cuando el método es POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['username'];
    $contraseña = $_POST['password'];

    // Verificar si el usuario existe
    $sql = "SELECT * FROM usuarios WHERE nombre_usuario = ? OR email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $usuario, $usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verificar la contraseña
        if (password_verify($contraseña, $user['contraseña'])) {
            // Guardar la información del usuario en la sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['nombre_usuario'];

            // Redireccionar a la página principal o al carrito
            header("Location: index.html");
            exit;
        } else {
            echo "Contraseña incorrecta.";
        }
    } else {
        echo "Usuario no encontrado.";
    }
}
?>
