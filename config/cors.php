<?php

return [
'paths' => ['api/*', 'login', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'], // ganti dengan port React-mu
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'supports_credentials' => true,   // <--- ini penting
];
