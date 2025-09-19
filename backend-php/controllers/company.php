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
        'phones' => ['+234 808 374 7339', '+234 706 332 5184', '+234 803 404 7213'],
        'email' => 'support@royalhealthconsult.com',
        'emails' => ['support@royalhealthconsult.com', 'care@royalhealthconsult.com', 'info@royalhealthconsult.com'],
        'website' => 'https://royalhealthconsult.com',
        'hours' => [
            'monday' => '8:00 AM - 6:00 PM',
            'tuesday' => '8:00 AM - 6:00 PM',
            'wednesday' => '8:00 AM - 6:00 PM',
            'thursday' => '8:00 AM - 6:00 PM',
            'friday' => '8:00 AM - 6:00 PM',
            'saturday' => '9:00 AM - 4:00 PM',
            'sunday' => 'Closed'
        ],
        'businessHours' => [
            'weekdays' => 'Mon - Fri: 8:00 AM - 6:00 PM',
            'saturday' => 'Sat: 9:00 AM - 4:00 PM',
            'sunday' => 'Sun: Closed'
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
        ],
        'socialMedia' => [
            'facebook' => 'https://facebook.com/royalhealthconsult',
            'twitter' => 'https://twitter.com/royalhealthng',
            'instagram' => 'https://instagram.com/royalhealthconsult',
            'linkedin' => 'https://linkedin.com/company/royal-health-consult',
            'whatsapp' => 'https://wa.me/2349012345678'
        ]
    ];
    
    Response::success($contactInfo, 'Company contact information retrieved');
}