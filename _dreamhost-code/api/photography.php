<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

class PhotographyScanner {
    private $photographyDir;
    
    public function __construct($photographyDir = '../photography') {
        $this->photographyDir = $photographyDir;
    }
    
    public function scanCategories() {
        $categories = [];
        
        if (!is_dir($this->photographyDir)) {
            return ['categories' => []];
        }
        
        $categoryDirs = scandir($this->photographyDir);
        
        foreach ($categoryDirs as $dir) {
            if ($dir === '.' || $dir === '..' || $dir === '.gitkeep') continue;
            
            $categoryPath = $this->photographyDir . '/' . $dir;
            if (!is_dir($categoryPath)) continue;
            
            $category = $this->processCategory($dir, $categoryPath);
            if ($category) {
                $categories[] = $category;
            }
        }
        
        usort($categories, function($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
        
        return [
            'categories' => $categories,
            'total_count' => count($categories)
        ];
    }
    
    private function processCategory($dirName, $categoryPath) {
        // Get metadata first (needed for featured_image)
        $metadataFile = $categoryPath . '/metadata.yaml';
        $metadata = file_exists($metadataFile) ? $this->parseYaml(file_get_contents($metadataFile)) : [];
        
        // Get all images in category
        $images = $this->getCategoryImages($categoryPath);
        
        // Get featured image (from metadata or fallback)
        $featuredImage = $this->getFeaturedImage($categoryPath, $images, $metadata);
        
        if (!$featuredImage) {
            return null;
        }
        
        return [
            'id' => $dirName,
            'name' => $metadata['name'] ?? ucwords(str_replace(['-', '_'], ' ', $dirName)),
            'description' => $metadata['description'] ?? 'A collection of ' . strtolower($dirName) . ' photography',
            'featured_image' => $featuredImage,
            'photo_count' => count($images),
            'images' => $images
        ];
    }
    
    private function getCategoryImages($categoryPath) {
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $images = [];
        
        $files = scandir($categoryPath);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..' || $file === 'metadata.yaml') continue;
            
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($extension, $imageExtensions)) {
                $relativePath = str_replace('../', '', $categoryPath) . '/' . $file;
                $images[] = [
                    'filename' => $file,
                    'path' => $relativePath,
                    'name' => pathinfo($file, PATHINFO_FILENAME)
                ];
            }
        }
        
        usort($images, function($a, $b) {
            return strcmp($a['filename'], $b['filename']);
        });
        
        return $images;
    }
    
    private function getFeaturedImage($categoryPath, $images, $metadata) {
        // First check metadata for featured_image setting
        if (!empty($metadata['featured_image'])) {
            foreach ($images as $image) {
                if (strtolower($image['filename']) === strtolower($metadata['featured_image'])) {
                    return $image['path'];
                }
            }
        }
        
        // Look for common featured image names
        $featuredNames = ['featured.jpg', 'featured.png', 'cover.jpg', 'cover.png', 'hero.jpg', 'hero.png'];
        
        foreach ($featuredNames as $name) {
            foreach ($images as $image) {
                if (strtolower($image['filename']) === strtolower($name)) {
                    return $image['path'];
                }
            }
        }
        
        // Fallback: first image
        return !empty($images) ? $images[0]['path'] : null;
    }
    
    private function parseYaml($yamlContent) {
        $data = [];
        $lines = explode("\n", $yamlContent);
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            
            if (preg_match('/^([^:]+):\s*(.*)$/', $line, $matches)) {
                $key = trim($matches[1]);
                $value = trim($matches[2]);
                $data[$key] = trim($value, '"\'');
            }
        }
        
        return $data;
    }
}

try {
    $scanner = new PhotographyScanner();
    echo json_encode($scanner->scanCategories());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to scan photography categories: ' . $e->getMessage()]);
}
