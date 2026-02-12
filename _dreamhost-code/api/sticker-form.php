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

// Get POST data
$input = $_POST;

// Validation
$errors = [];

// Required fields
$required = ['name', 'email', 'interests'];
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
    'interests' => is_array($input['interests']) ? array_map(function($interest) {
        return htmlspecialchars(trim($interest), ENT_QUOTES, 'UTF-8');
    }, $input['interests']) : [htmlspecialchars(trim($input['interests']), ENT_QUOTES, 'UTF-8')],
    'experience' => isset($input['experience']) ? htmlspecialchars(trim($input['experience']), ENT_QUOTES, 'UTF-8') : '',
    'message' => isset($input['message']) ? htmlspecialchars(trim($input['message']), ENT_QUOTES, 'UTF-8') : '',
    'form_type' => 'community',
    'submitted_at' => date('Y-m-d H:i:s')
];

try {
    // Email configuration
    $to = getenv('CONTACT_EMAIL') ?: 'hello@jesseprojects.com';
    $from = 'noreply@jesseprojects.com';
    
    $subject = 'New Community Intake Form Submission';
    
    // Create email body
    $emailBody = "New community intake form submission:\n\n";
    $emailBody .= "Name: " . $data['name'] . "\n";
    $emailBody .= "Email: " . $data['email'] . "\n";
    
    if (!empty($data['phone'])) {
        $emailBody .= "Phone: " . $data['phone'] . "\n";
    }
    
    $emailBody .= "Photography Interests: " . implode(', ', $data['interests']) . "\n";
    
    if (!empty($data['experience'])) {
        $emailBody .= "Experience Level: " . $data['experience'] . "\n";
    }
    
    if (!empty($data['message'])) {
        $emailBody .= "\nAbout themselves:\n" . $data['message'] . "\n";
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
        // Log successful submission
        $logEntry = date('Y-m-d H:i:s') . " - Community intake from " . $data['email'] . "\n";
        error_log($logEntry, 3, 'logs/community_submissions.log');
        
        echo json_encode([
            'success' => true,
            'message' => 'Welcome to the community! I\'ll be in touch soon with more information about upcoming workshops and events.'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
    
} catch (Exception $e) {
    error_log('Community form error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Sorry, there was a problem processing your submission. Please try again or contact us directly.'
    ]);
}
?>
