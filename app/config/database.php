<?php
class Database {
    private $host = "127.0.0.1";   // always use 127.0.0.1 on Windows
    private $port = "3307";        // match your MySQL port
    private $db_name = "food";     // your database name
    private $username = "root";    // XAMPP default
    private $password = "";        // XAMPP default (empty)
    public $conn;

    public function connect() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};port={$this->port};dbname={$this->db_name}",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "✅ Database connected successfully!";
        } catch(PDOException $e) {
            echo "❌ Connection error: " . $e->getMessage();
        }
        return $this->conn;
    }
}
?>
