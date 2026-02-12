<?php
/**
 * Image Processing Pipeline for Workshop Galleries
 * Generates multiple sizes on demand and manages original files
 */

class ImageProcessor {
    private $baseDir;
    private $supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    private $sizes = [
        'thumb' => 400,
        'medium' => 800,
        'large' => 1200,
        'xlarge' => 2000
    ];
    private $quality = 85;
    
    public function __construct($baseDir = null) {
        if ($baseDir === null) {
            $baseDir = __DIR__ . '/../workshops/';
        }
        $this->baseDir = rtrim($baseDir, '/') . '/';
    }
    
    /**
     * Process all images in workshop directories
     */
    public function processAllWorkshops() {
        $results = [];
        $workshopDirs = glob($this->baseDir . '*', GLOB_ONLYDIR);
        
        foreach ($workshopDirs as $workshopDir) {
            $workshopName = basename($workshopDir);
            $results[$workshopName] = $this->processWorkshopImages($workshopName);
        }
        
        return $results;
    }
    
    /**
     * Process images for a specific workshop
     */
    public function processWorkshopImages($workshopName) {
        $workshopDir = $this->baseDir . $workshopName . '/';
        if (!is_dir($workshopDir)) {
            return ['error' => 'Workshop directory not found'];
        }
        
        $results = [
            'processed' => [],
            'moved_to_originals' => [],
            'errors' => []
        ];
        
        // Create directories
        $this->createDirectories($workshopDir);
        
        // Get all image files
        $imageFiles = $this->getImageFiles($workshopDir);
        
        foreach ($imageFiles as $imageFile) {
            try {
                $result = $this->processImage($workshopDir, $imageFile);
                if ($result['success']) {
                    $results['processed'][] = $imageFile;
                    if ($result['moved_original']) {
                        $results['moved_to_originals'][] = $imageFile;
                    }
                } else {
                    $results['errors'][] = $imageFile . ': ' . $result['error'];
                }
            } catch (Exception $e) {
                $results['errors'][] = $imageFile . ': ' . $e->getMessage();
            }
        }
        
        return $results;
    }
    
    /**
     * Create necessary directories
     */
    private function createDirectories($workshopDir) {
        $dirs = ['sizes', 'originals'];
        foreach ($dirs as $dir) {
            $fullDir = $workshopDir . $dir . '/';
            if (!is_dir($fullDir)) {
                mkdir($fullDir, 0755, true);
            }
        }
        
        // Create size subdirectories
        foreach (array_keys($this->sizes) as $size) {
            $sizeDir = $workshopDir . 'sizes/' . $size . '/';
            if (!is_dir($sizeDir)) {
                mkdir($sizeDir, 0755, true);
            }
        }
    }
    
    /**
     * Get all image files from directory (excluding subdirectories)
     */
    private function getImageFiles($workshopDir) {
        $imageFiles = [];
        $extensions = implode(',', $this->supportedFormats);
        
        foreach (glob($workshopDir . '*.{' . $extensions . '}', GLOB_BRACE) as $file) {
            if (is_file($file)) {
                $imageFiles[] = basename($file);
            }
        }
        
        return $imageFiles;
    }
    
    /**
     * Process a single image file
     */
    private function processImage($workshopDir, $imageFile) {
        $originalPath = $workshopDir . $imageFile;
        $info = pathinfo($imageFile);
        $baseName = $info['filename'];
        $extension = strtolower($info['extension']);
        
        // Check if already processed
        if (is_dir($workshopDir . 'sizes/') && 
            file_exists($workshopDir . 'sizes/thumb/' . $imageFile)) {
            return [
                'success' => true,
                'moved_original' => false,
                'message' => 'Already processed'
            ];
        }
        
        // Load original image
        $source = $this->loadImage($originalPath, $extension);
        if (!$source) {
            return ['success' => false, 'error' => 'Failed to load image'];
        }
        
        // Apply EXIF orientation correction for JPEG images
        if (in_array($extension, ['jpg', 'jpeg'])) {
            $orientation = $this->getExifOrientation($originalPath);
            if ($orientation > 1) {
                $source = $this->applyExifRotation($source, $orientation);
            }
        }
        
        $originalWidth = imagesx($source);
        $originalHeight = imagesy($source);
        
        // Generate different sizes
        foreach ($this->sizes as $sizeName => $maxWidth) {
            if ($originalWidth <= $maxWidth) {
                // If original is smaller than target size, just copy it
                copy($originalPath, $workshopDir . 'sizes/' . $sizeName . '/' . $imageFile);
            } else {
                // Resize image
                $ratio = min($maxWidth / $originalWidth, $maxWidth / $originalHeight);
                $newWidth = intval($originalWidth * $ratio);
                $newHeight = intval($originalHeight * $ratio);
                
                $resized = imagecreatetruecolor($newWidth, $newHeight);
                
                // Preserve transparency for PNG
                if ($extension === 'png') {
                    imagealphablending($resized, false);
                    imagesavealpha($resized, true);
                    $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
                    imagefill($resized, 0, 0, $transparent);
                }
                
                imagecopyresampled($resized, $source, 0, 0, 0, 0, 
                                 $newWidth, $newHeight, $originalWidth, $originalHeight);
                
                $outputPath = $workshopDir . 'sizes/' . $sizeName . '/' . $imageFile;
                $this->saveImage($resized, $outputPath, $extension);
                imagedestroy($resized);
            }
        }
        
        imagedestroy($source);
        
        // Move original to originals folder
        $originalDestination = $workshopDir . 'originals/' . $imageFile;
        $moveSuccess = rename($originalPath, $originalDestination);
        
        return [
            'success' => true,
            'moved_original' => $moveSuccess,
            'message' => 'Processed successfully'
        ];
    }
    
    /**
     * Load image based on type
     */
    private function loadImage($path, $extension) {
        switch ($extension) {
            case 'jpg':
            case 'jpeg':
                return imagecreatefromjpeg($path);
            case 'png':
                return imagecreatefrompng($path);
            case 'webp':
                return imagecreatefromwebp($path);
            default:
                return false;
        }
    }
    
    /**
     * Save image based on type
     */
    private function saveImage($image, $path, $extension) {
        switch ($extension) {
            case 'jpg':
            case 'jpeg':
                return imagejpeg($image, $path, $this->quality);
            case 'png':
                return imagepng($image, $path);
            case 'webp':
                return imagewebp($image, $path, $this->quality);
            default:
                return false;
        }
    }
    
    /**
     * Get EXIF orientation value from JPEG image
     * Returns orientation value (1-8) or 0 if not available
     */
    private function getExifOrientation($imagePath) {
        if (!extension_loaded('exif')) {
            return 0;
        }
        
        try {
            $exif = @exif_read_data($imagePath, 'IFD0');
            if ($exif && isset($exif['Orientation'])) {
                return (int)$exif['Orientation'];
            }
        } catch (Exception $e) {
            // If EXIF reading fails, just return 0
        }
        
        return 0;
    }
    
    /**
     * Apply EXIF orientation rotation to image
     * Handles orientations 1-8 based on EXIF standard
     */
    private function applyExifRotation($image, $orientation) {
        $width = imagesx($image);
        $height = imagesy($image);
        
        switch ($orientation) {
            case 2:
                // Flipped horizontally
                $this->imageFlipHorizontal($image);
                break;
            case 3:
                // Rotated 180°
                $image = imagerotate($image, 180, 0);
                break;
            case 4:
                // Flipped vertically
                $this->imageFlipVertical($image);
                break;
            case 5:
                // Rotated 90° CCW + Flipped
                $image = imagerotate($image, 90, 0);
                $this->imageFlipHorizontal($image);
                break;
            case 6:
                // Rotated 90° CW
                $image = imagerotate($image, -90, 0);
                break;
            case 7:
                // Rotated 90° CW + Flipped
                $image = imagerotate($image, -90, 0);
                $this->imageFlipHorizontal($image);
                break;
            case 8:
                // Rotated 90° CCW
                $image = imagerotate($image, 90, 0);
                break;
        }
        
        return $image;
    }
    
    /**
     * Flip image horizontally
     */
    private function imageFlipHorizontal(&$image) {
        $width = imagesx($image);
        $height = imagesy($image);
        
        for ($y = 0; $y < $height; $y++) {
            for ($x = 0; $x < $width / 2; $x++) {
                $pixel1 = imagecolorat($image, $x, $y);
                $pixel2 = imagecolorat($image, $width - 1 - $x, $y);
                imagesetpixel($image, $x, $y, $pixel2);
                imagesetpixel($image, $width - 1 - $x, $y, $pixel1);
            }
        }
    }
    
    /**
     * Flip image vertically
     */
    private function imageFlipVertical(&$image) {
        $width = imagesx($image);
        $height = imagesy($image);
        
        for ($x = 0; $x < $width; $x++) {
            for ($y = 0; $y < $height / 2; $y++) {
                $pixel1 = imagecolorat($image, $x, $y);
                $pixel2 = imagecolorat($image, $x, $height - 1 - $y);
                imagesetpixel($image, $x, $y, $pixel2);
                imagesetpixel($image, $x, $height - 1 - $y, $pixel1);
            }
        }
    }
    
    /**
     * Generate srcset for responsive images
     */
    public function generateSrcset($workshopName, $imageFile) {
        $workshopDir = $this->baseDir . $workshopName . '/';
        $srcset = [];
        
        foreach ($this->sizes as $sizeName => $width) {
            $sizePath = $workshopDir . 'sizes/' . $sizeName . '/' . $imageFile;
            if (file_exists($sizePath)) {
                $webPath = '/workshops/' . $workshopName . '/sizes/' . $sizeName . '/' . $imageFile;
                $srcset[] = $webPath . ' ' . $width . 'w';
            }
        }
        
        return implode(', ', $srcset);
    }
    
    /**
     * Get manifest of all processed images
     */
    public function generateManifest() {
        $manifest = [];
        $workshopDirs = glob($this->baseDir . '*', GLOB_ONLYDIR);
        
        foreach ($workshopDirs as $workshopDir) {
            $workshopName = basename($workshopDir);
            $sizesDir = $workshopDir . '/sizes/thumb/';
            
            if (is_dir($sizesDir)) {
                $images = $this->getImageFiles($sizesDir);
                foreach ($images as $image) {
                    $manifest[$workshopName][] = [
                        'filename' => $image,
                        'srcset' => $this->generateSrcset($workshopName, $image),
                        'sizes' => '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    ];
                }
            }
        }
        
        return $manifest;
    }
}

// API endpoint handling
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $processor = new ImageProcessor();
    $action = $_GET['action'] ?? 'manifest';
    
    switch ($action) {
        case 'process':
            $workshop = $_GET['workshop'] ?? null;
            if ($workshop) {
                $result = $processor->processWorkshopImages($workshop);
            } else {
                $result = $processor->processAllWorkshops();
            }
            echo json_encode($result);
            break;
            
        case 'manifest':
        default:
            $manifest = $processor->generateManifest();
            echo json_encode($manifest);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>