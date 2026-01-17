<?php
require_once '../app/config/database.php';
require_once '../app/models/Guide.php';

$db = (new Database())->connect();
$guide = new Guide($db);
$all = $guide->getAll();
print_r($all);
?>
