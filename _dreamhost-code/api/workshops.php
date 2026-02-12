<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Workshop scanning and processing
class WorkshopScanner {
    private $workshopsDir;
    
    public function __construct($workshopsDir = '../workshops') {
        $this->workshopsDir = $workshopsDir;
    }
    
    public function scanWorkshops() {
        $workshops = [];
        
        if (!is_dir($this->workshopsDir)) {
            return ['workshops' => [], 'categories' => []];
        }
        
        $projectDirs = scandir($this->workshopsDir);
        
        foreach ($projectDirs as $dir) {
            if ($dir === '.' || $dir === '..') continue;
            
            $projectPath = $this->workshopsDir . '/' . $dir;
            if (!is_dir($projectPath)) continue;
            
            $workshop = $this->processWorkshop($dir, $projectPath);
            if ($workshop && !empty($workshop['category'])) {
                $workshops[] = $workshop;
            }
        }
        
        // Sort workshops by category, then by title
        usort($workshops, function($a, $b) {
            $categoryCompare = strcmp($a['category'], $b['category']);
            if ($categoryCompare !== 0) return $categoryCompare;
            return strcmp($a['title'], $b['title']);
        });
        
        $categories = $this->extractCategories($workshops);
        
        return [
            'workshops' => $workshops,
            'categories' => $categories,
            'total_count' => count($workshops)
        ];
    }
    
    private function processWorkshop($dirName, $projectPath) {
        $yamlFile = $projectPath . '/project.yaml';
        
        if (!file_exists($yamlFile)) {
            return null;
        }
        
        // Parse YAML file
        $yamlContent = file_get_contents($yamlFile);
        $metadata = $this->parseYaml($yamlContent);
        
        // Skip if no category (required field)
        if (empty($metadata['category'])) {
            return null;
        }
        
        // Check if images need processing (no sizes directory exists)
        $this->checkAndProcessImages($projectPath, $dirName);
        
        // Get images
        $images = $this->getProjectImages($projectPath);
        
        $workshop = [
            'id' => $dirName,
            'title' => $metadata['title'] ?? ucwords(str_replace(['-', '_'], ' ', $dirName)),
            'category' => $metadata['category'],
            'hero_image' => $this->getHeroImage($projectPath, $images, $metadata),
            'images' => $images,
            'created_date' => date('Y-m-d', filemtime($projectPath))
        ];
        
        // Add optional fields only if they exist
        if (!empty($metadata['difficulty'])) {
            $workshop['difficulty'] = $metadata['difficulty'];
        }
        
        if (!empty($metadata['estimated_time'])) {
            $workshop['estimated_time'] = $metadata['estimated_time'];
        }
        
        if (!empty($metadata['short_description'])) {
            $workshop['short_description'] = $metadata['short_description'];
        }
        
        if (!empty($metadata['materials']) && is_array($metadata['materials'])) {
            $workshop['materials'] = $metadata['materials'];
        }
        
        if (!empty($metadata['tools']) && is_array($metadata['tools'])) {
            $workshop['tools'] = $metadata['tools'];
        }
        
        // Handle steps if provided
        if (!empty($metadata['steps']) && is_array($metadata['steps'])) {
            $workshop['steps'] = $metadata['steps'];
            $workshop['has_steps'] = true;
        } else {
            $workshop['has_steps'] = false;
        }
        
        // Handle NSFW flag
        if (!empty($metadata['nsfw'])) {
            $nsfwValue = strtolower($metadata['nsfw']);
            $workshop['nsfw'] = ($nsfwValue === 'true' || $nsfwValue === '1' || $nsfwValue === 'yes');
        }
        
        return $workshop;
    }
    
    private function getProjectImages($projectPath) {
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $images = [];
        
        // Priority order for finding processed images
        $imagePaths = [
            $projectPath . '/sizes/medium',  // Processed medium images (preferred)
            $projectPath . '/sizes/large',   // Processed large images
            $projectPath . '/sizes/thumb',   // Processed thumbnails
            $projectPath,                    // Original images (fallback)
            $projectPath . '/images'         // Images subdirectory (fallback)
        ];
        
        foreach ($imagePaths as $imagePath) {
            if (!is_dir($imagePath)) continue;
            
            $files = scandir($imagePath);
            foreach ($files as $file) {
                if ($file === '.' || $file === '..') continue;
                
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($extension, $imageExtensions)) {
                    $relativePath = str_replace('../', '', $imagePath) . '/' . $file;
                    $images[] = [
                        'filename' => $file,
                        'path' => $relativePath,
                        'name' => pathinfo($file, PATHINFO_FILENAME)
                    ];
                }
            }
            
            // If we found images in this directory, use them and stop checking others
            if (!empty($images)) {
                break;
            }
        }
        
        // Sort by filename
        usort($images, function($a, $b) {
            return strcmp($a['filename'], $b['filename']);
        });
        
        return $images;
    }
    
    private function getHeroImage($projectPath, $images, $metadata) {
        // If hero_image is specified in YAML, use that
        if (!empty($metadata['hero_image'])) {
            foreach ($images as $image) {
                if ($image['filename'] === $metadata['hero_image']) {
                    return $image['path'];
                }
            }
        }
        
        // Fallback: look for common hero image names
        $heroNames = ['hero.jpg', 'hero.png', 'main.jpg', 'main.png', 'finished.jpg', 'finished.png'];
        foreach ($heroNames as $heroName) {
            foreach ($images as $image) {
                if (strtolower($image['filename']) === strtolower($heroName)) {
                    return $image['path'];
                }
            }
        }
        
        // Final fallback: first image
        return !empty($images) ? $images[0]['path'] : 'https://via.placeholder.com/400x300?text=No+Image';
    }
    
    private function extractCategories($workshops) {
        $categories = [];
        foreach ($workshops as $workshop) {
            $category = $workshop['category'];
            if (!isset($categories[$category])) {
                $categories[$category] = [
                    'name' => $category,
                    'count' => 0,
                    'workshops' => []
                ];
            }
            $categories[$category]['count']++;
            $categories[$category]['workshops'][] = $workshop['id'];
        }
        
        return array_values($categories);
    }
    
    private function parseYaml($yamlContent) {
        // Simple YAML parser for basic key-value pairs and arrays
        $data = [];
        $lines = explode("\n", $yamlContent);
        $currentKey = null;
        $inArray = false;
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            
            // Handle arrays
            if (preg_match('/^-\s+(.+)$/', $line, $matches)) {
                if ($currentKey && $inArray) {
                    if (!isset($data[$currentKey])) {
                        $data[$currentKey] = [];
                    }
                    $data[$currentKey][] = trim($matches[1], '"\'');
                }
                continue;
            }
            
            // Handle key-value pairs
            if (preg_match('/^([^:]+):\s*(.*)$/', $line, $matches)) {
                $key = trim($matches[1]);
                $value = trim($matches[2]);
                
                $currentKey = $key;
                
                if (empty($value)) {
                    // Start of an array
                    $inArray = true;
                    $data[$key] = [];
                } else {
                    // Single value
                    $inArray = false;
                    $data[$key] = trim($value, '"\'');
                }
            }
        }
        
        return $data;
    }
    
    /**
     * Check if workshop needs image processing and process if needed
     */
    private function checkAndProcessImages($projectPath, $workshopName) {
        $sizesDir = $projectPath . '/sizes/';
        
        // If sizes directory doesn't exist, process images
        if (!is_dir($sizesDir)) {
            $this->processWorkshopImages($workshopName);
        }
    }
    
    /**
     * Process images for a workshop using the ImageProcessor
     */
    private function processWorkshopImages($workshopName) {
        try {
            require_once __DIR__ . '/image-processor.php';
            $processor = new ImageProcessor();
            $results = $processor->processWorkshopImages($workshopName);
            
            // Log processing results (optional)
            error_log("Auto-processed workshop '$workshopName': " . 
                     count($results['processed'] ?? []) . " images processed");
        } catch (Exception $e) {
            error_log("Image processing failed for '$workshopName': " . $e->getMessage());
        }
    }
}

// Handle different request types
try {
    $scanner = new WorkshopScanner();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to initialize workshop scanner: ' . $e->getMessage()]);
    exit;
}

if (isset($_GET['id'])) {
    // Get specific workshop
    $workshopId = $_GET['id'];
    $allData = $scanner->scanWorkshops();
    
    $workshop = null;
    foreach ($allData['workshops'] as $w) {
        if ($w['id'] === $workshopId) {
            $workshop = $w;
            break;
        }
    }
    
    if ($workshop) {
        echo json_encode(['workshop' => $workshop]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Workshop not found']);
    }
} elseif (isset($_GET['category'])) {
    // Get workshops by category
    $category = $_GET['category'];
    $allData = $scanner->scanWorkshops();
    
    $filteredWorkshops = array_filter($allData['workshops'], function($w) use ($category) {
        return $w['category'] === $category;
    });
    
    echo json_encode([
        'workshops' => array_values($filteredWorkshops),
        'category' => $category,
        'count' => count($filteredWorkshops)
    ]);
} else {
    // Get all workshops
    echo json_encode($scanner->scanWorkshops());
}
?>