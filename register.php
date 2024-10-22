<?php
$con = new mysqli("localhost", "root", "", "tienda_online");

// Supongamos que ya tienes el nombre de usuario y contraseña desde un formulario
$nombre_usuario = $_POST['nombre_usuario'];
$correo = $_POST['correo'];
$contrasena = password_hash($_POST['contrasena'], PASSWORD_DEFAULT); // Cifrar la contraseña

$sql = "INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)";
$stmt = $con->prepare($sql);
$stmt->bind_param("sss", $nombre_usuario, $correo, $contrasena);
$stmt->execute();

echo "Usuario registrado con éxito.";
?>
