<?php
/**
 * Support Controller
 */

$method = $_SERVER['REQUEST_METHOD'];
$path_segments = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$action = isset($path_segments[3]) ? $path_segments[3] : '';

if ($method === 'GET') {
    switch ($action) {
        case 'faqs':
            handleGetFAQs();
            break;
        default:
            Response::error('Support endpoint not found', 404);
    }
} else {
    Response::error('Method not allowed', 405);
}

function handleGetFAQs() {
    // Static FAQ data - you can move this to database later
    $faqs = [
        [
            'id' => 1,
            'category' => 'General',
            'question' => 'What is Royal Health Consult?',
            'answer' => 'Royal Health Consult is a healthcare platform that connects patients with qualified nurses for home-based care services.'
        ],
        [
            'id' => 2,
            'category' => 'Services',
            'question' => 'What services do you offer?',
            'answer' => 'We offer home nursing care, medical consultations, health monitoring, wound care, and medication administration services.'
        ],
        [
            'id' => 3,
            'category' => 'Booking',
            'question' => 'How do I book a service?',
            'answer' => 'You can book a service by creating an account, browsing available nurses, and scheduling an appointment through our platform.'
        ],
        [
            'id' => 4,
            'category' => 'Payment',
            'question' => 'What payment methods do you accept?',
            'answer' => 'We accept various payment methods including bank transfers, card payments, and mobile money.'
        ],
        [
            'id' => 5,
            'category' => 'Coverage',
            'question' => 'What areas do you serve?',
            'answer' => 'We currently serve Lagos State, Ogun State, and selected areas in Southwest Nigeria.'
        ],
        [
            'id' => 6,
            'category' => 'Emergency',
            'question' => 'Do you provide emergency services?',
            'answer' => 'For medical emergencies, please call emergency services immediately. Our platform is for scheduled care services.'
        ],
        [
            'id' => 7,
            'category' => 'Nurses',
            'question' => 'Are your nurses qualified?',
            'answer' => 'Yes, all our nurses are licensed professionals with verified credentials and experience in home healthcare.'
        ],
        [
            'id' => 8,
            'category' => 'Pricing',
            'question' => 'How is pricing determined?',
            'answer' => 'Pricing varies based on the type of service, duration, and location. You can view pricing details when booking.'
        ]
    ];
    
    Response::success($faqs, 'FAQs retrieved successfully');
}