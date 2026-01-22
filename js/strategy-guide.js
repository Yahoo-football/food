// js/strategy-guide.js - Strategy Guide Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is a client
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize all functionality
    initStrategyGuide();
    initNavigation();
    initCalculators();
    initChecklists();
    initModal();
    updateClientBadge();

    // Set up circle metrics
    setupCircleMetrics();
});

// Initialize strategy guide
function initStrategyGuide() {
    console.log('Strategy Guide initialized for client:', auth.currentUser ? .name);

    // Show protected notice for first-time visitors
    const hasSeenNotice = localStorage.getItem('hasSeenStrategyNotice');
    if (!hasSeenNotice) {
        document.getElementById('protectedNotice').style.display = 'block';
    }
}

// Initialize navigation
function initNavigation() {
    // Smooth scroll for navigation links
    document.querySelectorAll('.strategy-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Update active nav link
                document.querySelectorAll('.strategy-nav a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Smooth scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.strategy-section');
        const navLinks = document.querySelectorAll('.strategy-nav a');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize calculators
function initCalculators() {
    // Profit margin calculator
    window.calculateProfit = function() {
        const foodCost = parseFloat(document.getElementById('foodCost').value) || 0;
        const sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;
        const overhead = parseFloat(document.getElementById('overhead').value) || 0;

        if (sellingPrice <= 0) {
            showAlert('Please enter a valid selling price', 'error');
            return;
        }

        const grossProfit = sellingPrice - foodCost;
        const netProfit = grossProfit - overhead;
        const foodCostPercentage = (foodCost / sellingPrice) * 100;
        const grossMargin = (grossProfit / sellingPrice) * 100;
        const netMargin = (netProfit / sellingPrice) * 100;

        const resultsHTML = `
            <div class="result-item">
                <span class="result-label">Food Cost Percentage:</span>
                <span class="result-value ${foodCostPercentage <= 35 ? 'profit' : 'loss'}">
                    ${foodCostPercentage.toFixed(1)}%
                </span>
            </div>
            <div class="result-item">
                <span class="result-label">Gross Margin:</span>
                <span class="result-value ${grossMargin >= 65 ? 'profit' : 'loss'}">
                    ${grossMargin.toFixed(1)}%
                </span>
            </div>
            <div class="result-item">
                <span class="result-label">Net Profit per Dish:</span>
                <span class="result-value ${netProfit >= 0 ? 'profit' : 'loss'}">
                    $${netProfit.toFixed(2)}
                </span>
            </div>
            <div class="result-item">
                <span class="result-label">Net Margin:</span>
                <span class="result-value ${netMargin >= 20 ? 'profit' : 'loss'}">
                    ${netMargin.toFixed(1)}%
                </span>
            </div>
            <div class="result-item">
                <span class="result-label">Recommendation:</span>
                <span class="result-value ${netMargin >= 20 ? 'profit' : 'loss'}">
                    ${getPricingRecommendation(netMargin)}
                </span>
            </div>
        `;

        document.getElementById('profitResults').innerHTML = resultsHTML;
    };

    // Calculate on input change
    document.getElementById('foodCost') ? .addEventListener('input', calculateProfit);
    document.getElementById('sellingPrice') ? .addEventListener('input', calculateProfit);
    document.getElementById('overhead') ? .addEventListener('input', calculateProfit);
}

// Get pricing recommendation
function getPricingRecommendation(netMargin) {
    if (netMargin >= 30) {
        return 'Excellent margin!';
    } else if (netMargin >= 20) {
        return 'Good margin - maintain';
    } else if (netMargin >= 10) {
        return 'Consider price increase';
    } else if (netMargin >= 0) {
        return 'Low margin - review costs';
    } else {
        return 'Loss - immediate action needed';
    }
}

// Initialize checklists
function initChecklists() {
    // Load saved checklist states
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const savedState = localStorage.getItem(`checklist_${checkbox.id}`);
        if (savedState === 'true') {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', function() {
            localStorage.setItem(`checklist_${this.id}`, this.checked);

            // Update progress
            updateChecklistProgress();
        });
    });

    // Initial progress update
    updateChecklistProgress();
}

// Update checklist progress
function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const progress = total > 0 ? (checked / total) * 100 : 0;

    // You could update a progress bar here if needed
    console.log(`Checklist progress: ${progress.toFixed(0)}% (${checked}/${total})`);
}

// Setup circle metrics
function setupCircleMetrics() {
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        const { value } = circle.dataset; // Using object destructuring as suggested
        circle.style.setProperty('--value', `${value}%`);
    });
}

// Initialize modal
function initModal() {
    const modal = document.getElementById('consultationModal');
    const form = document.getElementById('consultationForm');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Close modal function
    window.closeModal = function() {
        modal.classList.remove('active');
    };

    // Open consultation modal
    window.scheduleConsultation = function() {
        modal.classList.add('active');
    };

    // Close modal on button click
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    form ? .addEventListener('submit', function(e) {
        e.preventDefault();

        const topic = document.getElementById('consultationTopic').value;
        const date = document.getElementById('preferredDate').value;
        const time = document.getElementById('preferredTime').value;
        const notes = document.getElementById('consultationNotes').value;

        // In a real app, this would send to a server
        console.log('Consultation requested:', { topic, date, time, notes });

        showAlert('Consultation scheduled successfully! We\'ll confirm via email.', 'success');
        closeModal();
        form.reset();
    });

    // Set minimum date to today
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
}

// Show loyalty calculator
window.showLoyaltyCalculator = function() {
    const customerCount = parseInt(prompt('How many active customers do you have?', '100'));
    const averageOrderValue = parseFloat(prompt('What is your average order value?', '25'));
    const retentionIncrease = parseInt(prompt('Expected retention increase (%)?', '15'));

    if (!customerCount || !averageOrderValue || !retentionIncrease) return;

    const monthlyRevenue = customerCount * averageOrderValue * 0.5; // Assuming 0.5 orders per month per customer
    const additionalRevenue = monthlyRevenue * (retentionIncrease / 100);
    const annualAdditionalRevenue = additionalRevenue * 12;

    const resultHTML = `
        <h4>Loyalty Program ROI Estimate</h4>
        <p><strong>Monthly Additional Revenue:</strong> $${additionalRevenue.toFixed(2)}</p>
        <p><strong>Annual Additional Revenue:</strong> $${annualAdditionalRevenue.toFixed(2)}</p>
        <p><strong>Recommended Program Budget:</strong> $${(annualAdditionalRevenue * 0.2).toFixed(2)} (20% of additional revenue)</p>
        <p><em>Note: This is an estimate. Actual results may vary.</em></p>
    `;

    showAlert(resultHTML, 'info', 10000);
};

// Download template
window.downloadTemplate = function(templateType) {
    const templates = {
        'financial': 'financial-projection-template.xlsx',
        'business-plan': 'business-plan-template.docx',
        'pitch-deck': 'investor-pitch-deck.pptx',
        'marketing-calendar': 'marketing-calendar-template.pdf'
    };

    const filename = templates[templateType];

    if (filename) {
        // In a real app, this would trigger a file download
        showAlert(`Downloading ${filename}... (Demo mode)`, 'info');

        // Simulate download
        setTimeout(() => {
            showAlert(`${filename} downloaded successfully!`, 'success');

            // Track download in localStorage
            const downloads = JSON.parse(localStorage.getItem('templateDownloads')) || [];
            downloads.push({
                template: templateType,
                date: new Date().toISOString(),
                client: auth.currentUser ? .name
            });
            localStorage.setItem('templateDownloads', JSON.stringify(downloads));
        }, 1000);
    }
};

// Update client badge
function updateClientBadge() {
    const clientName = auth.currentUser ? .name;
    if (clientName) {
        // You could personalize the page for the client
        console.log(`Welcome back, ${clientName}!`);
    }
}

// Close protected notice
window.closeNotice = function() {
    document.getElementById('protectedNotice').style.display = 'none';
    localStorage.setItem('hasSeenStrategyNotice', 'true');
};

// Show alert/notification
function showAlert(message, type = 'info', duration = 5000) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = message;

    // Style the alert
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(alertDiv);

    // Auto remove after duration
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, duration);

    // Add CSS animations if not already present
    if (!document.querySelector('#alert-animations')) {
        const style = document.createElement('style');
        style.id = 'alert-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Export functions for use in other files
window.strategyGuide = {
    initStrategyGuide,
    initNavigation,
    initCalculators,
    initChecklists,
    initModal,
    showAlert
};