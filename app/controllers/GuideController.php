<?php
require_once __DIR__ . '/../models/Guide.php';


class GuideController {
    private $guideModel;

    public function __construct($db) {
        $this->guideModel = new Guide($db);
    }

    public function index() {
        $guides = $this->guideModel->getAll();
        include 'app/views/guides/list.php';
    }

    public function create() {
        session_start();
        if ($_SESSION['role'] !== 'admin') {
            header("Location: index.php?page=guides");
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $title = $_POST['title'];
            $content = $_POST['content'];
            $user_id = $_SESSION['user_id'];
            $this->guideModel->create($title, $content, $user_id);
            header("Location: index.php?page=guides");
        } else {
            include 'app/views/guides/create.php';
        }
    }
}
?>
