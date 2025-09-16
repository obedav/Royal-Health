<?php
/**
 * Company Information Controller
 */

$method = $_SERVER['REQUEST_METHOD'];
$path_segments = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$action = isset($path_segments[3]) ? $path_segments[3] : '';

if ($method === 'GET') {
    switch ($action) {
        case 'contact-info':
            handleGetContactInfo();
            break;
        default:
            Response::error('Company endpoint not found', 404);
    }
} else {
    Response::error('Method not allowed', 405);
}

function handleGetContactInfo() {
    // Static company information - you can move this to database later
    $contactInfo = [
        'name' => 'Royal Health Consult',
        'address' => 'Lagos, Nigeria',
        'phone' => '+234-XXX-XXX-XXXX',
        'email' => 'support@ancerlarins.com',
        'website' => 'https://ancerlarins.com',
        'hours' => [
            'monday' => '8:00 AM - 6:00 PM',
            'tuesday' => '8:00 AM - 6:00 PM',
            'wednesday' => '8:00 AM - 6:00 PM',
            'thursday' => '8:00 AM - 6:00 PM',
            'friday' => '8:00 AM - 6:00 PM',
            'saturday' => '9:00 AM - 4:00 PM',
            'sunday' => 'Closed'
        ],
        'services' => [
            'Home Nursing Care',
            'Medical Consultations',
            'Health Monitoring',
            'Wound Care',
            'Medication Administration'
        ],
        'coverage_areas' => [
            'Lagos State',
            'Ogun State',
            'Selected areas in Southwest Nigeria'
        ]
    ];
    
    Response::success($contactInfo, 'Company contact information retrieved');
}