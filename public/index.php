<?php
require_once '../app/config/database.php';
require_once '../app/controllers/GuideController.php';
require_once '../app/controllers/AuthController.php';

$db = (new Database())->connect();

$page = $_GET['page'] ?? 'guides';
switch ($page) {
    case 'guides':
        (new GuideController($db))->index();
        break;
    case 'add_guide':
        (new GuideController($db))->create();
        break;
    case 'login':
        (new AuthController($db))->login();
        break;
    case 'register':
        (new AuthController($db))->register();
        break;
    default:
        (new GuideController($db))->index();
}
?>
