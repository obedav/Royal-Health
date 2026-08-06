<?php
/**
 * One-time admin account creation script.
 * UPLOAD → RUN ONCE → DELETE IMMEDIATELY from the server.
 *
 * Protected by a secret token in the URL:
 *   https://api.royalhealthconsult.com/create_admin_once.php?token=RH-SETUP-2026
 */

define('SECRET_TOKEN', 'RH-SETUP-2026');

if (($_GET['token'] ?? '') !== SECRET_TOKEN) {
    http_response_code(403);
    die('Forbidden.');
}

require_once __DIR__ . '/config/database.php';

$message = '';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email     = trim($_POST['email']     ?? '');
    $password  = trim($_POST['password']  ?? '');
    $firstName = trim($_POST['firstName'] ?? 'Admin');
    $lastName  = trim($_POST['lastName']  ?? 'User');

    if (empty($email) || empty($password)) {
        $message = 'Email and password are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = 'Invalid email address.';
    } elseif (strlen($password) < 8) {
        $message = 'Password must be at least 8 characters.';
    } else {
        try {
            $db = Database::getInstance();

            $existing = $db->fetch("SELECT id FROM users WHERE email = ?", [$email]);
            if ($existing) {
                $message = "An account with that email already exists (ID: {$existing['id']}).";
            } else {
                $bytes = random_bytes(16);
                $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
                $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
                $userId = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));

                $db->insert('users', [
                    'id'            => $userId,
                    'email'         => $email,
                    'password_hash' => password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]),
                    'first_name'    => $firstName,
                    'last_name'     => $lastName,
                    'role'          => 'admin',
                    'status'        => 'active',
                    'created_at'    => date('Y-m-d H:i:s'),
                    'updated_at'    => date('Y-m-d H:i:s'),
                ]);

                $success = true;
                $message = "Admin account created successfully. ID: {$userId}";
            }
        } catch (Exception $e) {
            $message = 'Database error: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Create Admin — Royal Health</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 480px; margin: 60px auto; padding: 0 20px; color: #333; }
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
<h2>Create Admin Account</h2>

<?php if ($message): ?>
  <div class="msg <?= $success ? 'ok' : 'err' ?>"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>

<?php if (!$success): ?>
<form method="POST">
  <label>Email *</label>
  <input type="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>

  <label>Password * (min 8 characters)</label>
  <input type="password" name="password" required>

  <label>First Name</label>
  <input type="text" name="firstName" value="<?= htmlspecialchars($_POST['firstName'] ?? 'Admin') ?>">

  <label>Last Name</label>
  <input type="text" name="lastName" value="<?= htmlspecialchars($_POST['lastName'] ?? 'User') ?>">

  <button type="submit">Create Admin Account</button>
</form>
<?php endif; ?>

<div class="warn">
  ⚠️ <strong>Delete this file immediately</strong> after creating your account.<br>
  In cPanel File Manager, remove <code>create_admin_once.php</code> from the server.
</div>
</body>
</html>
