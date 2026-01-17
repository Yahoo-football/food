<?php
require_once '../app/config/database.php';

$db = new Database();
$conn = $db->connect();


if ($conn) {
    echo "✅ Connected to database successfully!";
} else {
    echo "❌ Connection failed!";
}
?>
