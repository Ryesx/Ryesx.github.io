<?php
session_start();

$host = 'localhost';
$dbname = 'tienda'; // Nombre de tu base de datos
$username = 'root';
$password = '';

// Conectar a la base de datos
$conn = new mysqli($host, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos del formulario
$direccion = $_POST['direccion'];
$correo = $_POST['correo'];
$carrito = json_decode($_POST['carrito'], true); // Decodificar el carrito

// Insertar datos de la compra en la base de datos
$sqlCompra = "INSERT INTO compras (direccion, correo, fecha) VALUES (?, ?, NOW())";
$stmtCompra = $conn->prepare($sqlCompra);
$stmtCompra->bind_param("ss", $direccion, $correo);
$stmtCompra->execute();

// Obtener el ID de la compra insertada
$compra_id = $conn->insert_id;

// Insertar los productos en la tabla `detalle_compra`
foreach ($carrito as $producto) {
    $sqlDetalle = "INSERT INTO detalle_compra (compra_id, producto_nombre, precio, cantidad) VALUES (?, ?, ?, 1)";
    $stmtDetalle = $conn->prepare($sqlDetalle);
    $stmtDetalle->bind_param("isd", $compra_id, $producto['nombre'], $producto['precio']);
    $stmtDetalle->execute();
}

echo "Compra realizada con éxito.";

// Cerrar conexión
$stmtCompra->close();
$stmtDetalle->close();
$conn->close();
?>
