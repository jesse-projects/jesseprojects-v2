<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JesseProjects - Photography, Workshops & Community</title>
    <meta name="description" content="Professional photography, creative workshops, and community events by Jesse. Specializing in weddings, portraits, and artistic development.">
    
    <!-- Critical CSS - Inline for fast first paint -->
    <style>
        <?php include 'css/critical.css'; ?>
    </style>
    
    <!-- Preload key resources -->
    <link rel="preload" href="css/deferred.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="css/deferred.css"></noscript>
    
    <!-- FullCalendar CSS -->
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css" rel="stylesheet">
    
    <!-- PhotoSwipe CSS -->
    <link href="https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe.css" rel="stylesheet">
    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
<body>
    <!-- Skip Links -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#navigation" class="skip-link">Skip to navigation</a>

    <!-- Hidden Navigation -->
    <nav id="navigation" class="nav-overlay" aria-label="Main navigation">
        <div class="nav-container">
            <button class="nav-close" aria-label="Close navigation">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <ul class="nav-menu">
                <li><a href="./">Home</a></li>
                <li><a href="./photography">Photography</a></li>
                <li><a href="./workshop">Workshop</a></li>
                <li><a href="./about">About</a></li>
            </ul>
        </div>
    </nav>

    <!-- Navigation Toggle -->
    <button class="nav-toggle" aria-label="Open navigation" aria-expanded="false">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    </button>

    <main id="main-content">
        <!-- Hero Carousel Section -->
        <section id="home" class="hero-section" aria-label="Featured work showcase">
            <div class="carousel-container" role="region" aria-label="Image carousel">
                <div class="carousel-slides" id="carousel-slides">
                    <!-- Slides will be populated dynamically from JSON -->
                </div>

                <!-- Carousel Controls -->
                <div class="carousel-controls" aria-label="Carousel controls">
                    <button class="carousel-btn prev" aria-label="Previous slide">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    
                    <div class="carousel-indicators" role="tablist" aria-label="Slide indicators">
                        <!-- Indicators will be populated dynamically from JSON -->
                    </div>

                    <button class="carousel-btn next" aria-label="Next slide">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </button>
                    
                    <button class="carousel-play-pause" aria-label="Pause slideshow" data-playing="true">
                        <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                        <svg class="play-icon hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </section>

        <!-- Sticky Section Header -->
        <div id="section-header" class="section-header" style="display: none;">
            <div class="container">
                <h2 id="current-section-title">Photography</h2>
            </div>
        </div>

        <!-- Dynamic Content Sections -->
        <div id="content-sections">
            <!-- Photography Section -->
            <section id="photography-content" class="content-section dynamic-section" data-section="photography">
                <!-- Photography Categories - Full Width -->
                <div class="photography-categories">
                    <div class="category-grid" id="photography-grid">
                        <!-- Categories will be populated by JavaScript -->
                    </div>
                </div>
                
                <div class="container">
                    <!-- Subsection anchors for deep linking -->
                    <div id="weddings" class="subsection-anchor"></div>
                    <div id="portraits" class="subsection-anchor"></div>
                    <div id="events" class="subsection-anchor"></div>
                </div>
            </section>

            <!-- Workshop Section -->
            <section id="workshop-content" class="content-section dynamic-section" data-section="workshop" style="display: none;">
                <div class="container">
                    <div class="workshop-grid" id="workshop-grid">
                        <!-- Workshop items will be populated by JavaScript/PHP -->
                    </div>
                    
                    <!-- Subsection anchors for deep linking -->
                    <div id="woodworking" class="subsection-anchor"></div>
                    <div id="metalwork" class="subsection-anchor"></div>
                    <div id="crafts" class="subsection-anchor"></div>
                </div>
            </section>

            <!-- Community Section - DISABLED -->
            <section id="community-content" class="content-section dynamic-section" data-section="community" style="display: none !important;">
                <div class="container">
                    <!-- Calendar -->
                    <div class="calendar-container">
                        <div id="community-calendar"></div>
                    </div>

                    <!-- Community Intake Form -->
                    <div class="community-form">
                        <h3>Join Our Community</h3>
                        <form id="community-intake-form">
                            <div class="form-group">
                                <label for="community-name">Full Name *</label>
                                <input type="text" id="community-name" name="name" required>
                            </div>

                            <div class="form-group">
                                <label for="community-email">Email *</label>
                                <input type="email" id="community-email" name="email" required>
                            </div>

                            <div class="form-group">
                                <label for="community-phone">Phone</label>
                                <input type="tel" id="community-phone" name="phone">
                            </div>

                            <div class="form-group">
                                <label for="community-interests">Photography Interests</label>
                                <select id="community-interests" name="interests" multiple>
                                    <option value="wedding">Wedding Photography</option>
                                    <option value="portrait">Portrait Photography</option>
                                    <option value="landscape">Landscape Photography</option>
                                    <option value="street">Street Photography</option>
                                    <option value="studio">Studio Photography</option>
                                    <option value="editing">Photo Editing</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="community-experience">Experience Level</label>
                                <select id="community-experience" name="experience">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="professional">Professional</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="community-message">Tell us about yourself</label>
                                <textarea id="community-message" name="message" rows="4"></textarea>
                            </div>

                            <button type="submit" class="submit-btn">Join Community</button>
                        </form>
                        <div id="community-form-message" class="form-message" role="alert" aria-live="assertive"></div>
                    </div>
                </div>
            </section>

            <!-- About Section -->
            <section id="about-content" class="content-section dynamic-section" data-section="about" style="display: none;">
                <div class="container">
                    <div class="about-content">
                        <div class="about-text">
                            <p>Welcome to JesseProjects, where photography meets passion and creativity flourishes through community.</p>
                            
                            <p>With over a decade of experience capturing life's most precious moments, I specialize in wedding photography, intimate portraits, and creative storytelling through the lens. My approach combines technical expertise with an artistic eye, ensuring every image tells a unique story.</p>
                            
                            <p>Beyond client work, I'm passionate about sharing knowledge through hands-on workshops and building a supportive photography community. Whether you're just starting your photography journey or looking to refine your skills, there's a place for you here.</p>
                            
                            <p>When I'm not behind the camera, you'll find me exploring new locations, experimenting with creative techniques, or mentoring emerging photographers in our vibrant community.</p>
                        </div>
                        
                        <div class="about-contact">
                            <h3>Get In Touch</h3>
                            <div class="contact-links">
                                <a href="mailto:jesse@jesseprojects.com" class="contact-link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="m4 4 16 0 0 16-16 0z"></path>
                                        <path d="m4 4 8 8 8-8"></path>
                                    </svg>
                                    jesse@jesseprojects.com
                                </a>
                                
                                <a href="tel:+1234567890" class="contact-link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    (916) 258-2297
                                </a>
                                
                                <a href="#" class="contact-link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                        <rect x="8" y="21" width="8" height="2" rx="1" ry="1"></rect>
                                    </svg>
                                    @jesseprojects
                                </a>
                                
                                <a href="https://jesseprojects.com/resume" class="contact-link" target="_blank" rel="noopener">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    View My Resume
                                </a>
                            </div>
                            
                            <!-- Contact Form -->
                            <div class="contact-form" id="contact-section">
                                <h4>Send a Message</h4>
                                <form id="contact-form" action="sticker.php" method="post">
                                    <div class="form-group">
                                        <label for="contact-name">Name *</label>
                                        <input type="text" id="contact-name" name="name" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="contact-email">Email *</label>
                                        <input type="email" id="contact-email" name="email" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="contact-subject">Subject</label>
                                        <input type="text" id="contact-subject" name="subject">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="contact-message">Message *</label>
                                        <textarea id="contact-message" name="message" rows="5" required></textarea>
                                    </div>
                                    
                                    <button type="submit" class="submit-btn">Send Message</button>
                                </form>
                                <div id="contact-form-message" class="form-message" role="alert" aria-live="assertive"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <p>&copy; 2025 JesseProjects. All rights reserved.</p>
            <p><a href="./about">About & Contact</a></p>
        </div>
    </footer>

    <!-- PhotoSwipe Lightbox -->
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe-lightbox.esm.min.js" type="module"></script>
    <script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe.esm.min.js" type="module"></script>
    
    <script src="js/carousel.js"></script>
    <script src="js/scroll-manager.js"></script>
    <script src="js/router.js"></script>
    <script src="js/photography.js"></script>
    <script src="js/workshop.js"></script>
    <script src="js/community.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
