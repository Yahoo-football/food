<?php session_start(); ?>
<h1>All Guides</h1>

<?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin'): ?>
    <a href="index.php?page=add_guide">+ Add New Guide</a>
<?php endif; ?>

<?php foreach ($guides as $g): ?>
    <h3><?= htmlspecialchars($g['title']) ?></h3>
    <p><?= nl2br(htmlspecialchars($g['content'])) ?></p>
    <hr>
<?php endforeach; ?>
