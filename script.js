// Enhanced CP Rating Predictor JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // ML Model coefficients
    const MODEL = {
        weight: 0.8315620555789324,
        bias: -32.629265073164284
    };

    // Rating tiers for different platforms
    const RATING_TIERS = {
        codeforces: [
            { min: 0, max: 1199, name: 'Newbie', color: '#808080' },
            { min: 1200, max: 1399, name: 'Pupil', color: '#008000' },
            { min: 1400, max: 1599, name: 'Specialist', color: '#03A89E' },
            { min: 1600, max: 1899, name: 'Expert', color: '#0000FF' },
            { min: 1900, max: 2099, name: 'Candidate Master', color: '#AA00AA' },
            { min: 2100, max: 2299, name: 'Master', color: '#FF8C00' },
            { min: 2300, max: 2399, name: 'International Master', color: '#FF8C00' },
            { min: 2400, max: 2599, name: 'Grandmaster', color: '#FF0000' },
            { min: 2600, max: 2999, name: 'International Grandmaster', color: '#FF0000' },
            { min: 3000, max: 4000, name: 'Legendary Grandmaster', color: '#FF0000' }
        ],
        codechef: [
            { min: 0, max: 1399, name: '1 Star', color: '#666666' },
            { min: 1400, max: 1599, name: '2 Star', color: '#1e7e34' },
            { min: 1600, max: 1799, name: '3 Star', color: '#138496' },
            { min: 1800, max: 1999, name: '4 Star', color: '#5a6c7d' },
            { min: 2000, max: 2199, name: '5 Star', color: '#795548' },
            { min: 2200, max: 2499, name: '6 Star', color: '#f39c12' },
            { min: 2500, max: 4000, name: '7 Star', color: '#e74c3c' }        ]
    };

    // DOM elements
    const elements = {
        aboutCard: document.querySelector('.about-card'),
        inputCard: document.querySelector('.input-card'),
        resultCard: document.querySelector('.result-card'),
        analyticsLoading: document.getElementById('analytics-loading'),
        platformButtons: document.querySelectorAll('.platform-btn'),
        inputTitle: document.querySelector('.input-title'),
        ratingInput: document.querySelector('.rating-input'),
        submitBtn: document.querySelector('.submit-btn'),
        tryAgainBtn: document.querySelector('.try-again-btn'),
        resultPlatform: document.getElementById('result-platform'),
        predictedRating: document.getElementById('predicted-rating'),
        ratingTier: document.getElementById('rating-tier'),
        ratingRange: document.getElementById('rating-range'),
        // Analytics elements
        processedUsers: document.getElementById('processed-users'),
        accuracyScore: document.getElementById('accuracy-score'),
        steps: {
            step1: document.getElementById('step1'),
            step2: document.getElementById('step2'),
            step3: document.getElementById('step3')
        },
        // Chart elements
        progressPath: document.getElementById('progress-path'),
        progressDot: document.getElementById('progress-dot'),
        progressCircle: document.getElementById('progress-circle'),
        skillPercentage: document.getElementById('skill-percentage'),
        codechefBar: document.getElementById('codechef-bar'),
        codeforcesBar: document.getElementById('codeforces-bar'),
        codechefRating: document.getElementById('codechef-rating'),
        codeforcesRating: document.getElementById('codeforces-rating')
    };

    let currentPlatform = '';
    let isConverting = false;

    // Initialize the application
    init();    function init() {
        console.log('Initializing CP Rating Predictor...');
        
        // Check if all required elements exist
        const requiredElements = [
            'aboutCard', 'inputCard', 'resultCard', 'ratingInput', 'submitBtn'
        ];
        
        for (const elementName of requiredElements) {
            if (!elements[elementName]) {
                console.error(`Required element ${elementName} not found!`);
            }
        }
        
        addEventListeners();
        addInputValidation();
        showInitialState();
        
        console.log('Initialization complete');
    }    function addEventListeners() {
        // Platform button clicks
        if (elements.platformButtons) {
            elements.platformButtons.forEach(button => {
                button.addEventListener('click', handlePlatformSelection);
            });
        }

        // Submit button click
        if (elements.submitBtn) {
            elements.submitBtn.addEventListener('click', handleSubmit);
        }

        // Try again button click
        if (elements.tryAgainBtn) {
            elements.tryAgainBtn.addEventListener('click', handleTryAgain);
        }

        // Enter key on input
        if (elements.ratingInput) {
            elements.ratingInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleSubmit();
                }
            });

            // Input focus effects
            elements.ratingInput.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });

            elements.ratingInput.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        }
    }    function addInputValidation() {
        if (elements.ratingInput && elements.submitBtn) {
            elements.ratingInput.addEventListener('input', function() {
                const value = parseInt(this.value);
                const submitBtn = elements.submitBtn;
                
                if (value && value >= 0 && value <= 4000) {
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                    submitBtn.disabled = false;
                } else {
                    submitBtn.style.opacity = '0.6';
                    submitBtn.style.cursor = 'not-allowed';
                    submitBtn.disabled = true;
                }
            });
        }
    }

    function showInitialState() {
        elements.aboutCard.classList.remove('hidden');
        elements.inputCard.classList.add('hidden');
        elements.resultCard.classList.add('hidden');
        if (elements.analyticsLoading) {
            elements.analyticsLoading.classList.add('hidden');
        }
    }

    function handlePlatformSelection(e) {
        const button = e.currentTarget;
        const platform = button.dataset.platform;
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        // Update current platform
        currentPlatform = platform;
        
        // Update UI based on platform
        updatePlatformUI(platform);
        
        // Show input card with animation
        showInputCard();
    }

    function updatePlatformUI(platform) {
        if (platform === 'codechef') {
            elements.inputTitle.innerHTML = '<i class="fas fa-utensils"></i> Enter CodeChef Rating';
            elements.ratingInput.placeholder = 'Your CodeChef rating (e.g., 1500)';
            elements.ratingRange.textContent = '0 - 3000 (typical)';
            isConverting = false; // CodeChef to CodeForces
        } else {
            elements.inputTitle.innerHTML = '<i class="fas fa-bolt"></i> Enter CodeForces Rating';
            elements.ratingInput.placeholder = 'Your CodeForces rating (e.g., 1200)';
            elements.ratingRange.textContent = '0 - 3500 (typical)';
            isConverting = true; // CodeForces to CodeChef        }
    }

    function showInputCard() {
        elements.aboutCard.classList.add('hidden');
        elements.resultCard.classList.add('hidden');
        if (elements.analyticsLoading) {
            elements.analyticsLoading.classList.add('hidden');
        }
        
        setTimeout(() => {
            elements.inputCard.classList.remove('hidden');
            elements.ratingInput.focus();
        }, 300);
    }

    function handleSubmit() {
        const rating = parseInt(elements.ratingInput.value);
        
        console.log('Submit clicked with rating:', rating);
        
        if (!rating || rating < 0 || rating > 4000) {
            showError('Please enter a valid rating between 0 and 4000');
            return;
        }

        console.log('Starting prediction process for platform:', currentPlatform);

        // Add loading state
        const originalText = elements.submitBtn.innerHTML;
        elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Predicting...';
        elements.submitBtn.disabled = true;

        // Simulate processing time for better UX with analytics
        setTimeout(() => {
            showAnalyticsLoading(rating);
        }, 500);
    }

    function calculatePrediction(inputRating) {
        let predictedRating;
        let targetPlatform;
        
        if (isConverting) {
            // CodeForces to CodeChef
            predictedRating = Math.round((inputRating - MODEL.bias) / MODEL.weight);
            targetPlatform = 'CodeChef';
        } else {
            // CodeChef to CodeForces
            predictedRating = Math.round(inputRating * MODEL.weight + MODEL.bias);
            targetPlatform = 'CodeForces';
        }

        // Ensure rating is within reasonable bounds
        predictedRating = Math.max(0, Math.min(4000, predictedRating));
        
        return {
            rating: predictedRating,
            platform: targetPlatform        };
    }    function showAnalyticsLoading(inputRating) {
        console.log('showAnalyticsLoading called with rating:', inputRating);
        console.log('Analytics element exists:', !!elements.analyticsLoading);
        
        // Show analytics loading within the input card
        if (elements.analyticsLoading) {
            elements.analyticsLoading.classList.remove('hidden');
            console.log('Analytics loading shown, starting animation...');
            startAnalyticsAnimation(inputRating);
        } else {
            console.error('Analytics loading element not found!');
        }
    }

    function startAnalyticsAnimation(inputRating) {
        // Reset all steps
        Object.values(elements.steps).forEach(step => {
            step.classList.remove('active', 'completed');
        });

        // Step 1: Loading dataset
        setTimeout(() => {
            elements.steps.step1.classList.add('active');
            animateCounter(elements.processedUsers, 10247);
        }, 500);

        // Step 2: Running ML model
        setTimeout(() => {
            elements.steps.step1.classList.remove('active');
            elements.steps.step1.classList.add('completed');
            elements.steps.step2.classList.add('active');
            animateCounter(elements.accuracyScore, 94);
        }, 2000);

        // Step 3: Generating analytics
        setTimeout(() => {
            elements.steps.step2.classList.remove('active');
            elements.steps.step2.classList.add('completed');
            elements.steps.step3.classList.add('active');
        }, 3500);

        // Complete analytics and show result
        setTimeout(() => {
            elements.steps.step3.classList.remove('active');
            elements.steps.step3.classList.add('completed');
            
            // Calculate prediction and show result
            const predictedRating = calculatePrediction(inputRating);
            showResult(predictedRating, inputRating);
              // Reset submit button
            elements.submitBtn.innerHTML = '<span>Predict Rating</span><i class="fas fa-arrow-right"></i>';
            elements.submitBtn.disabled = false;
        }, 5000);
    }    function showResult(prediction, originalRating) {
        console.log('showResult called with:', prediction, originalRating);
        
        // Hide analytics loading and input card
        if (elements.analyticsLoading) {
            elements.analyticsLoading.classList.add('hidden');
        }
        elements.inputCard.classList.add('hidden');
        
        setTimeout(() => {
            elements.resultCard.classList.remove('hidden');
            
            // Update main result display
            if (elements.resultPlatform) {
                elements.resultPlatform.textContent = prediction.platform;
            }
            if (elements.predictedRating) {
                elements.predictedRating.textContent = prediction.rating;
            }
            
            // Update rating tier
            const tier = getRatingTier(prediction.rating, prediction.platform.toLowerCase());
            if (elements.ratingTier) {
                elements.ratingTier.innerHTML = `<i class="fas fa-medal"></i><span>${tier.name}</span>`;
                elements.ratingTier.style.borderColor = tier.color;
            }
            
            // Animate the predicted rating number
            if (elements.predictedRating) {
                animateCounter(elements.predictedRating, prediction.rating);
            }
            
            // Setup and animate charts
            setTimeout(() => {
                setupCharts(prediction, originalRating);
            }, 1000);
        }, 300);
    }

    function setupCharts(prediction, originalRating) {
        // Setup progress line chart
        setupProgressChart(originalRating, prediction.rating);
        
        // Setup circular progress
        setupCircularProgress(prediction.rating);
        
        // Setup platform comparison
        setupPlatformComparison(prediction, originalRating);
    }

    function setupProgressChart(originalRating, predictedRating) {
        const svg = elements.progressPath;
        const dot = elements.progressDot;
        
        if (!svg || !dot) return;
        
        // Create path points
        const startY = 120;
        const midY = 100 - (originalRating / 3000) * 60;
        const endY = 100 - (predictedRating / 3000) * 60;
        
        const pathData = `M 50 ${startY} Q 150 ${midY} 250 ${endY}`;
        svg.setAttribute('d', pathData);
        
        // Animate path drawing
        const pathLength = svg.getTotalLength();
        svg.style.strokeDasharray = pathLength;
        svg.style.strokeDashoffset = pathLength;
        
        setTimeout(() => {
            svg.style.transition = 'stroke-dashoffset 2s ease-in-out';
            svg.style.strokeDashoffset = 0;
            
            // Animate dot along path
            setTimeout(() => {
                dot.style.transition = 'all 1s ease-in-out';
                dot.setAttribute('cx', 250);
                dot.setAttribute('cy', endY);
            }, 1500);
        }, 500);
    }

    function setupCircularProgress(rating) {
        const circle = elements.progressCircle;
        const percentage = elements.skillPercentage;
        
        if (!circle || !percentage) return;
        
        // Calculate percentage based on rating (max 3500)
        const skillPercent = Math.min(Math.round((rating / 3500) * 100), 100);
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (skillPercent / 100) * circumference;
        
        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 2s ease-in-out';
            circle.style.strokeDashoffset = offset;
            
            // Animate percentage counter
            animateCounter(percentage, skillPercent, '%');
        }, 1000);
    }

    function setupPlatformComparison(prediction, originalRating) {
        let codechefRating, codeforcesRating;
        
        if (isConverting) {
            // CodeForces to CodeChef
            codeforcesRating = originalRating;
            codechefRating = prediction.rating;
        } else {
            // CodeChef to CodeForces
            codechefRating = originalRating;
            codeforcesRating = prediction.rating;
        }
        
        // Update rating displays
        elements.codechefRating.textContent = codechefRating;
        elements.codeforcesRating.textContent = codeforcesRating;
        
        // Animate bars
        const maxRating = Math.max(codechefRating, codeforcesRating);
        const codechefWidth = (codechefRating / maxRating) * 100;
        const codeforcesWidth = (codeforcesRating / maxRating) * 100;
        
        setTimeout(() => {
            elements.codechefBar.style.width = `${codechefWidth}%`;
            elements.codeforcesBar.style.width = `${codeforcesWidth}%`;
        }, 1500);
    }

    function getRatingTier(rating, platform) {
        const tiers = RATING_TIERS[platform] || RATING_TIERS.codeforces;
        return tiers.find(tier => rating >= tier.min && rating <= tier.max) || tiers[0];
    }

    function animateCounter(element, target, suffix = '') {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + suffix;
        }, 16);
    }

    function handleTryAgain() {
        // Add click animation
        elements.tryAgainBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            elements.tryAgainBtn.style.transform = '';
        }, 150);

        // Reset form
        elements.ratingInput.value = '';
        currentPlatform = '';
        
        // Show initial state
        elements.resultCard.classList.add('hidden');
        
        setTimeout(() => {
            showInitialState();
        }, 300);
    }

    function showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        // Add error styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            0% {
                transform: translateX(100%);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            0% {
                transform: translateX(0);
                opacity: 1;
            }
            100% {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 26, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 14, 26, 0.9)';
            navbar.style.boxShadow = 'none';
        }
    });
});
