<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Cho phép API và CSRF Cookie
    'allowed_methods' => ['*'], // Cho phép tất cả phương thức HTTP
    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'], // Chỉ cho phép React truy cập
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Chấp nhận tất cả header
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Cho phép gửi credentials (cookie, token)
];