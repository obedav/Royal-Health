<?php
/**
 * FAQs API Endpoint
 * Simple standalone endpoint for FAQ data
 */

// Set headers for CORS and content type
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://royalhealthconsult.com');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

try {
    // FAQ data
    $faqs = [
        [
            'id' => 1,
            'question' => 'What services do you offer?',
            'answer' => 'We offer comprehensive healthcare consultations, preventive care, specialist referrals, telemedicine services, and personalized health assessments.',
            'category' => 'services'
        ],
        [
            'id' => 2,
            'question' => 'How do I book an appointment?',
            'answer' => 'You can book an appointment through our online booking system, by calling our office directly, or through our mobile app.',
            'category' => 'booking'
        ],
        [
            'id' => 3,
            'question' => 'What are your operating hours?',
            'answer' => 'We are open Monday to Friday from 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 2:00 PM. Emergency consultations are available 24/7.',
            'category' => 'general'
        ],
        [
            'id' => 4,
            'question' => 'Do you accept insurance?',
            'answer' => 'Yes, we accept most major insurance plans including Medicare and Medicaid. Please contact us to verify your specific coverage.',
            'category' => 'billing'
        ],
        [
            'id' => 5,
            'question' => 'How long does a consultation take?',
            'answer' => 'Initial consultations typically take 45-60 minutes, while follow-up appointments are usually 20-30 minutes. Specialist consultations may take longer.',
            'category' => 'appointments'
        ],
        [
            'id' => 6,
            'question' => 'Can I get a prescription online?',
            'answer' => 'Yes, our licensed physicians can provide prescriptions during telemedicine consultations when medically appropriate and legally permitted.',
            'category' => 'services'
        ],
        [
            'id' => 7,
            'question' => 'What should I bring to my appointment?',
            'answer' => 'Please bring a valid ID, insurance card, current medications list, any relevant medical records, and a list of questions or concerns.',
            'category' => 'appointments'
        ],
        [
            'id' => 8,
            'question' => 'How do I cancel or reschedule?',
            'answer' => 'You can cancel or reschedule appointments up to 24 hours in advance through our patient portal, mobile app, or by calling our office.',
            'category' => 'booking'
        ],
        [
            'id' => 9,
            'question' => 'Are telemedicine consultations available?',
            'answer' => 'Yes, we offer secure video consultations for many types of appointments. Technical requirements and availability vary by service.',
            'category' => 'services'
        ],
        [
            'id' => 10,
            'question' => 'How do I access my medical records?',
            'answer' => 'You can access your medical records through our secure patient portal or by requesting copies at our office with proper identification.',
            'category' => 'general'
        ]
    ];
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'FAQs retrieved successfully',
        'data' => $faqs,
        'total' => count($faqs)
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    error_log("FAQ retrieval error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to retrieve FAQs',
        'error' => $e->getMessage()
    ]);
}
?>