<?php
class Guide {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM guides ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($title, $content, $user_id) {
        $stmt = $this->conn->prepare("INSERT INTO guides (title, content, created_by) VALUES (?, ?, ?)");
        return $stmt->execute([$title, $content, $user_id]);
    }
}
?>
