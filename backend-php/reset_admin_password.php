<?php
/**
 * One-time admin password reset script.
 * UPLOAD → RUN ONCE → DELETE IMMEDIATELY from the server.
 *
 * https://api.royalhealthconsult.com/reset_admin_password.php?token=RH-RESET-2026
 */

define('SECRET_TOKEN', 'RH-RESET-2026');

if (($_GET['token'] ?? '') !== SECRET_TOKEN) {
    http_response_code(403);
    die('Forbidden.');
}

require_once __DIR__ . '/config/database.php';

$message = '';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email']    ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirm  = trim($_POST['confirm']  ?? '');

    if (empty($email) || empty($password)) {
        $message = 'Email and new password are required.';
    } elseif ($password !== $confirm) {
        $message = 'Passwords do not match.';
    } elseif (strlen($password) < 10) {
        $message = 'Password must be at least 10 characters.';
    } else {
        try {
            $db   = Database::getInstance();
            $user = $db->fetch("SELECT id, role FROM users WHERE email = ?", [$email]);

            if (!$user) {
                $message = 'No account found with that email.';
            } elseif ($user['role'] !== 'admin') {
                $message = 'That account is not an admin account.';
            } else {
                $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
                $db->execute(
                    "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
                    [$hash, date('Y-m-d H:i:s'), $user['id']]
                );
                $success = true;
                $message = 'Password updated successfully. Delete this file now.';
            }
        } catch (Exception $e) {
            $message = 'Database error. Check server error log.';
            error_log('Password reset error: ' . $e->getMessage());
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Reset Admin Password — Royal Health</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 460px; margin: 60px auto; padding: 0 20px; color: #333; }
  h2  { color: #C2185B; }
  label { display: block; margin: 14px 0 4px; font-weight: bold; font-size: 14px; }
  input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 15px; box-sizing: border-box; }
  button { margin-top: 20px; width: 100%; padding: 12px; background: #C2185B; color: #fff; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; }
  button:hover { background: #a31550; }
  .msg { margin-top: 18px; padding: 12px 16px; border-radius: 6px; font-size: 14px; }
  .msg.ok  { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .msg.err { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  .warn { margin-top: 24px; padding: 12px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; font-size: 13px; }
</style>
</head>
<body>
<h2>Reset Admin Password</h2>

<?php if ($message): ?>
  <div class="msg <?= $success ? 'ok' : 'err' ?>"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>

<?php if (!$success): ?>
<form method="POST">
  <label>Admin Email *</label>
  <input type="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? 'admin@royalhealthconsult.com') ?>" required>

  <label>New Password * (min 10 characters)</label>
  <input type="password" name="password" required>

  <label>Confirm New Password *</label>
  <input type="password" name="confirm" required>

  <button type="submit">Reset Password</button>
</form>
<?php endif; ?>

<div class="warn">
  ⚠️ <strong>Delete this file immediately</strong> after resetting your password.<br>
  In cPanel File Manager, remove <code>reset_admin_password.php</code> from the server.
</div>
</body>
</html>
