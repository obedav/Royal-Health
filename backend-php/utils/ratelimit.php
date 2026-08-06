<?php
/**
 * Rate limiting utility.
 * Uses APCu when available, falls back to temp-file counters.
 */

function checkRateLimit(string $key, int $maxRequests, int $windowSeconds): bool {
    $cacheKey = 'rhl_' . md5($key);

    if (function_exists('apcu_fetch')) {
        $count = apcu_fetch($cacheKey, $success);
        if (!$success) {
            apcu_store($cacheKey, 1, $windowSeconds);
            return true;
        }
        if ((int)$count >= $maxRequests) return false;
        apcu_inc($cacheKey);
        return true;
    }

    // File-based fallback for hosts without APCu
    $tmpFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $cacheKey . '.rl';
    $now     = time();
    $data    = null;

    if (file_exists($tmpFile)) {
        $raw  = @file_get_contents($tmpFile);
        $data = $raw !== false ? json_decode($raw, true) : null;
    }

    if (!$data || ($now - (int)$data['start']) > $windowSeconds) {
        file_put_contents($tmpFile, json_encode(['count' => 1, 'start' => $now]), LOCK_EX);
        return true;
    }

    if ((int)$data['count'] >= $maxRequests) return false;

    $data['count']++;
    file_put_contents($tmpFile, json_encode($data), LOCK_EX);
    return true;
}
