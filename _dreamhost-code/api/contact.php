<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit();
}

// Validation
$errors = [];

// Required fields
$required = ['name', 'email', 'message'];
foreach ($required as $field) {
    if (empty($input[$field]) || trim($input[$field]) === '') {
        $errors[$field] = ucfirst($field) . ' is required';
    }
}

// Email validation
if (!empty($input['email']) && !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address';
}

// Phone validation (if provided)
if (!empty($input['phone'])) {
    $phone = preg_replace('/[^0-9+\-\(\)\s]/', '', $input['phone']);
    if (strlen($phone) < 10) {
        $errors['phone'] = 'Please enter a valid phone number';
    }
}

// Message length validation
if (!empty($input['message']) && strlen(trim($input['message'])) < 10) {
    $errors['message'] = 'Message must be at least 10 characters long';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit();
}

// Sanitize input
$data = [
    'name' => htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8'),
    'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
    'phone' => isset($input['phone']) ? htmlspecialchars(trim($input['phone']), ENT_QUOTES, 'UTF-8') : '',
    'service' => isset($input['service']) ? htmlspecialchars(trim($input['service']), ENT_QUOTES, 'UTF-8') : '',
    'event_date' => isset($input['event_date']) ? htmlspecialchars(trim($input['event_date']), ENT_QUOTES, 'UTF-8') : '',
    'location' => isset($input['location']) ? htmlspecialchars(trim($input['location']), ENT_QUOTES, 'UTF-8') : '',
    'budget' => isset($input['budget']) ? htmlspecialchars(trim($input['budget']), ENT_QUOTES, 'UTF-8') : '',
    'message' => htmlspecialchars(trim($input['message']), ENT_QUOTES, 'UTF-8'),
    'newsletter' => isset($input['newsletter']) && $input['newsletter'] === 'yes',
    'form_type' => isset($input['form_type']) ? $input['form_type'] : 'contact',
    'submitted_at' => date('Y-m-d H:i:s')
];

try {
    // Email configuration
    $to = getenv('CONTACT_EMAIL') ?: 'hello@jesseprojects.com';
    $from = 'noreply@jesseprojects.com';
    
    // Create email subject
    $subject = 'New Contact Form Submission';
    if (!empty($data['service'])) {
        $serviceLabels = [
            'wedding' => 'Wedding Photography',
            'portrait' => 'Portrait Session',
            'workshop' => 'Photography Workshop',
            'community' => 'Community Events',
            'other' => 'Other Service'
        ];
        $subject = 'New Inquiry: ' . ($serviceLabels[$data['service']] ?? $data['service']);
    }
    
    // Create email body
    $emailBody = "New contact form submission from JesseProjects website:\n\n";
    $emailBody .= "Name: " . $data['name'] . "\n";
    $emailBody .= "Email: " . $data['email'] . "\n";
    
    if (!empty($data['phone'])) {
        $emailBody .= "Phone: " . $data['phone'] . "\n";
    }
    
    if (!empty($data['service'])) {
        $emailBody .= "Service Interest: " . $data['service'] . "\n";
    }
    
    if (!empty($data['event_date'])) {
        $emailBody .= "Preferred Date: " . $data['event_date'] . "\n";
    }
    
    if (!empty($data['location'])) {
        $emailBody .= "Location/Story: " . $data['location'] . "\n";
    }
    
    if (!empty($data['budget'])) {
        $emailBody .= "Budget Range: " . $data['budget'] . "\n";
    }
    
    $emailBody .= "\nMessage:\n" . $data['message'] . "\n";
    
    if ($data['newsletter']) {
        $emailBody .= "\nRequested newsletter signup: Yes\n";
    }
    
    $emailBody .= "\nSubmitted: " . $data['submitted_at'] . "\n";
    
    // Email headers
    $headers = [
        'From: ' . $from,
        'Reply-To: ' . $data['email'],
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    // Send email
    $emailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));
    
    if ($emailSent) {
        // Log successful submission (optional)
        $logEntry = date('Y-m-d H:i:s') . " - Contact form submission from " . $data['email'] . "\n";
        error_log($logEntry, 3, 'logs/contact_submissions.log');
        
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! I\'ll get back to you within 24 hours.'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Sorry, there was a problem sending your message. Please try again or contact us directly at hello@jesseprojects.com'
    ]);
}
?>
