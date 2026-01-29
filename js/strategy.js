// js/strategy-food.js - Food Business Strategy Management
document.addEventListener('DOMContentLoaded', () => {
            // Check authentication
            if (!auth.isLoggedIn() || !auth.isAdmin()) {
                window.location.href = 'login.html';
                return;
            }

            // Initialize strategy manager
            const strategyManager = new StrategyFoodManager();

            // DOM Elements
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            const strategyModal = document.getElementById('strategyModal');
            const strategyForm = document.getElementById('strategyForm');
            const closeModalBtns = document.querySelectorAll('.close-modal');
            const swotModal = document.getElementById('swotModal');
            const swotForm = document.getElementById('swotForm');
            const closeSwotModalBtns = document.querySelectorAll('.close-swot-modal');

            // Add strategy buttons
            const addButtons = {
                menu: document.getElementById('addMenuItemStrategy'),
                pricing: document.getElementById('addPricingStrategy'),
                marketing: document.getElementById('addMarketingStrategy'),
                operations: document.getElementById('addOperationsStrategy')
            };

            // SWOT buttons
            const addSwotButtons = document.querySelectorAll('.add-swot-item');
            const updateSwotBtn = document.getElementById('updateSwot');
            const generateSwotReportBtn = document.getElementById('generateSwotReport');
            const exportSwotBtn = document.getElementById('exportSwot');

            // Initialize
            loadAllData();
            initializeCharts();

            // Event Listeners - Tab Navigation
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.dataset.tab;
                    switchTab(tabId);
                });
            });

            // Event Listeners - Add Strategy Buttons
            Object.entries(addButtons).forEach(([type, button]) => {
                button?.addEventListener('click', () => openStrategyModal(type));
            });

            // Event Listeners - Modal Controls
            closeModalBtns.forEach(btn => {
                btn.addEventListener('click', () => closeStrategyModal());
            });

            closeSwotModalBtns.forEach(btn => {
                btn.addEventListener('click', () => closeSwotModal());
            });

            strategyForm?.addEventListener('submit', handleStrategySubmit);
            swotForm?.addEventListener('submit', handleSwotSubmit);

            // Event Listeners - SWOT
            addSwotButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const type = e.target.closest('.add-swot-item').dataset.type;
                    openSwotModal(type);
                });
            });

            updateSwotBtn?.addEventListener('click', loadSwotAnalysis);
            generateSwotReportBtn?.addEventListener('click', generateSwotReport);
            exportSwotBtn?.addEventListener('click', exportSwotAnalysis);

            // Close modals on outside click
            strategyModal?.addEventListener('click', (e) => {
                if (e.target === strategyModal) {
                    closeStrategyModal();
                }
            });

            swotModal?.addEventListener('click', (e) => {
                if (e.target === swotModal) {
                    closeSwotModal();
                }
            });

            // Strategy Manager Class
            class StrategyFoodManager {
                // Strategy management
                getStrategies(type) {
                    const strategies = JSON.parse(localStorage.getItem('foodStrategies')) || {};
                    return strategies[type] || [];
                }

                saveStrategies(type, strategies) {
                    const allStrategies = JSON.parse(localStorage.getItem('foodStrategies')) || {};
                    allStrategies[type] = strategies;
                    localStorage.setItem('foodStrategies', JSON.stringify(allStrategies));
                }

                createStrategy(type, strategy) {
                    const strategies = this.getStrategies(type);
                    const newStrategy = {
                        id: Date.now(),
                        type: type,
                        ...strategy,
                        created: new Date().toISOString().split('T')[0],
                        createdBy: auth.currentUser?.name || 'Admin',
                        status: 'active'
                    };
                    strategies.push(newStrategy);
                    this.saveStrategies(type, strategies);
                    return newStrategy;
                }

                updateStrategy(type, id, updates) {
                    const strategies = this.getStrategies(type);
                    const index = strategies.findIndex(s => s.id === id);
                    if (index !== -1) {
                        strategies[index] = {...strategies[index], ...updates };
                        this.saveStrategies(type, strategies);
                        return true;
                    }
                    return false;
                }

                deleteStrategy(type, id) {
                    const strategies = this.getStrategies(type);
                    const filtered = strategies.filter(s => s.id !== id);
                    this.saveStrategies(type, filtered);
                }

                // SWOT management
                getSwotAnalysis() {
                    return JSON.parse(localStorage.getItem('swotAnalysis')) || {
                        strengths: [],
                        weaknesses: [],
                        opportunities: [],
                        threats: []
                    };
                }

                saveSwotAnalysis(swotData) {
                    localStorage.setItem('swotAnalysis', JSON.stringify(swotData));
                }

                addSwotItem(type, item) {
                    const swot = this.getSwotAnalysis();
                    const newItem = {
                        id: Date.now(),
                        ...item,
                        created: new Date().toISOString().split('T')[0]
                    };
                    swot[type].push(newItem);
                    this.saveSwotAnalysis(swot);
                    return newItem;
                }

                deleteSwotItem(type, id) {
                    const swot = this.getSwotAnalysis();
                    swot[type] = swot[type].filter(item => item.id !== id);
                    this.saveSwotAnalysis(swot);
                }

                // Menu performance data
                getMenuPerformance() {
                    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
                    const orders = JSON.parse(localStorage.getItem('orders')) || [];

                    // Calculate sales for each menu item
                    const performance = menuItems.map(item => {
                        let quantitySold = 0;
                        orders.forEach(order => {
                            order.items.forEach(orderItem => {
                                if (orderItem.id === item.id) {
                                    quantitySold += orderItem.quantity;
                                }
                            });
                        });

                        return {
                            ...item,
                            quantitySold,
                            revenue: quantitySold * item.price,
                            performance: quantitySold > 10 ? 'good' : quantitySold > 5 ? 'average' : 'poor'
                        };
                    });

                    return performance.sort((a, b) => b.quantitySold - a.quantitySold);
                }

                // Price comparison data
                getPriceComparison() {
                    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];

                    // Mock competitor prices (in a real app, this would come from a database)
                    const competitorPrices = {
                        1: 14.99, // Margherita Pizza
                        2: 12.99, // Burger Deluxe
                        3: 9.99 // Caesar Salad
                    };

                    return menuItems.map(item => {
                        const competitorPrice = competitorPrices[item.id] || item.price * 1.2;
                        const difference = item.price - competitorPrice;
                        const isCheaper = difference < 0;

                        return {
                            name: item.name,
                            ourPrice: item.price,
                            competitorPrice: competitorPrice,
                            difference: Math.abs(difference),
                            isCheaper,
                            differencePercent: ((difference / competitorPrice) * 100).toFixed(1)
                        };
                    });
                }
            }

            // Load all data
            function loadAllData() {
                loadMenuStrategies();
                loadPricingStrategies();
                loadMarketingStrategies();
                loadOperationsStrategies();
                loadSwotAnalysis();
                loadMenuPerformance();
                loadPriceComparison();
            }

            // Switch tabs
            function switchTab(tabId) {
                // Update tab buttons
                tabBtns.forEach(btn => btn.classList.remove('active'));
                document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

                // Update tab contents
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(`${tabId}Tab`)?.classList.add('active');

                // Load data for the tab if needed
                switch (tabId) {
                    case 'menu':
                        loadMenuPerformance();
                        break;
                    case 'pricing':
                        loadPriceComparison();
                        break;
                    case 'marketing':
                        initializeROIChart();
                        break;
                }
            }

            // Load menu strategies
            function loadMenuStrategies() {
                const strategies = strategyManager.getStrategies('menu');
                const container = document.getElementById('menuStrategies');

                if (!container) return;

                if (strategies.length === 0) {
                    // Add sample menu strategies
                    const sampleStrategies = [{
                            id: 1,
                            title: 'Seasonal Menu Rotation',
                            description: 'Introduce seasonal items to keep menu fresh and appealing',
                            category: 'menu',
                            priority: 'high',
                            budget: 2000,
                            goals: 'Increase seasonal sales by 30%',
                            startDate: '2024-03-01',
                            endDate: '2024-08-31'
                        },
                        {
                            id: 2,
                            title: 'Healthy Options Expansion',
                            description: 'Add more vegan and gluten-free options to attract health-conscious customers',
                            category: 'menu',
                            priority: 'medium',
                            budget: 1500,
                            goals: 'Attract 20% more health-focused customers',
                            startDate: '2024-02-15',
                            endDate: '2024-06-30'
                        }
                    ];

                    sampleStrategies.forEach(strategy => {
                        strategyManager.createStrategy('menu', strategy);
                    });

                    loadMenuStrategies(); // Reload with sample data
                    return;
                }

                container.innerHTML = strategies.map(strategy => `
            <div class="strategy-card ${strategy.category}">
                <div class="strategy-card-header">
                    <h3>${strategy.title}</h3>
                    <span class="strategy-priority priority-${strategy.priority}">
                        ${strategy.priority.charAt(0).toUpperCase() + strategy.priority.slice(1)}
                    </span>
                </div>
                
                <div class="strategy-card-body">
                    <p>${strategy.description}</p>
                    
                    <div class="strategy-meta">
                        <div>
                            <span>Created: ${strategy.created}</span>
                            ${strategy.startDate ? `<br><span>Start: ${strategy.startDate}</span>` : ''}
                            ${strategy.endDate ? `<br><span>End: ${strategy.endDate}</span>` : ''}
                        </div>
                        ${strategy.budget ? `<div class="strategy-budget">$${strategy.budget}</div>` : ''}
                    </div>
                    
                    ${strategy.goals ? `<p><strong>Goals:</strong> ${strategy.goals}</p>` : ''}
                </div>
                
                <div class="strategy-card-footer">
                    <div>
                        <span class="status active">Active</span>
                    </div>
                    <div class="strategy-actions">
                        <button class="btn btn-secondary btn-sm edit-strategy" data-type="menu" data-id="${strategy.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-strategy" data-type="menu" data-id="${strategy.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        addStrategyEventListeners('menu');
    }
    
    // Load pricing strategies
    function loadPricingStrategies() {
        const strategies = strategyManager.getStrategies('pricing');
        const container = document.getElementById('pricingStrategies');
        
        if (!container) return;
        
        if (strategies.length === 0) {
            // Add sample pricing strategies
            const sampleStrategies = [
                {
                    id: 1,
                    title: 'Competitive Pricing Analysis',
                    description: 'Regularly analyze competitor pricing and adjust accordingly',
                    category: 'pricing',
                    priority: 'high',
                    budget: 500,
                    goals: 'Maintain competitive pricing while preserving margins',
                    startDate: '2024-01-15',
                    endDate: '2024-12-31'
                },
                {
                    id: 2,
                    title: 'Bundle Pricing Strategy',
                    description: 'Create meal bundles to increase average order value',
                    category: 'pricing',
                    priority: 'medium',
                    budget: 1000,
                    goals: 'Increase average order value by 15%',
                    startDate: '2024-03-01',
                    endDate: '2024-05-31'
                }
            ];
            
            sampleStrategies.forEach(strategy => {
                strategyManager.createStrategy('pricing', strategy);
            });
            
            loadPricingStrategies(); // Reload with sample data
            return;
        }
        
        container.innerHTML = strategies.map(strategy => `
            <div class="strategy-card ${strategy.category}">
                <div class="strategy-card-header">
                    <h3>${strategy.title}</h3>
                    <span class="strategy-priority priority-${strategy.priority}">
                        ${strategy.priority.charAt(0).toUpperCase() + strategy.priority.slice(1)}
                    </span>
                </div>
                
                <div class="strategy-card-body">
                    <p>${strategy.description}</p>
                    
                    <div class="strategy-meta">
                        <div>
                            <span>Created: ${strategy.created}</span>
                            ${strategy.startDate ? `<br><span>Start: ${strategy.startDate}</span>` : ''}
                            ${strategy.endDate ? `<br><span>End: ${strategy.endDate}</span>` : ''}
                        </div>
                        ${strategy.budget ? `<div class="strategy-budget">$${strategy.budget}</div>` : ''}
                    </div>
                    
                    ${strategy.goals ? `<p><strong>Goals:</strong> ${strategy.goals}</p>` : ''}
                </div>
                
                <div class="strategy-card-footer">
                    <div>
                        <span class="status active">Active</span>
                    </div>
                    <div class="strategy-actions">
                        <button class="btn btn-secondary btn-sm edit-strategy" data-type="pricing" data-id="${strategy.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-strategy" data-type="pricing" data-id="${strategy.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        addStrategyEventListeners('pricing');
    }
    
    // Load marketing strategies
    function loadMarketingStrategies() {
        const strategies = strategyManager.getStrategies('marketing');
        const container = document.getElementById('marketingStrategies');
        
        if (!container) return;
        
        if (strategies.length === 0) {
            // Add sample marketing strategies
            const sampleStrategies = [
                {
                    id: 1,
                    title: 'Social Media Campaign',
                    description: 'Boost presence on Instagram and Facebook with food photography',
                    category: 'marketing',
                    priority: 'high',
                    budget: 3000,
                    goals: 'Gain 1000 new followers and increase engagement by 50%',
                    startDate: '2024-02-01',
                    endDate: '2024-04-30'
                },
                {
                    id: 2,
                    title: 'Loyalty Program Launch',
                    description: 'Implement a points-based loyalty program for repeat customers',
                    category: 'marketing',
                    priority: 'medium',
                    budget: 2000,
                    goals: 'Increase customer retention by 25%',
                    startDate: '2024-03-15',
                    endDate: '2024-06-30'
                }
            ];
            
            sampleStrategies.forEach(strategy => {
                strategyManager.createStrategy('marketing', strategy);
            });
            
            loadMarketingStrategies(); // Reload with sample data
            return;
        }
        
        container.innerHTML = strategies.map(strategy => `
            <div class="strategy-card ${strategy.category}">
                <div class="strategy-card-header">
                    <h3>${strategy.title}</h3>
                    <span class="strategy-priority priority-${strategy.priority}">
                        ${strategy.priority.charAt(0).toUpperCase() + strategy.priority.slice(1)}
                    </span>
                </div>
                
                <div class="strategy-card-body">
                    <p>${strategy.description}</p>
                    
                    <div class="strategy-meta">
                        <div>
                            <span>Created: ${strategy.created}</span>
                            ${strategy.startDate ? `<br><span>Start: ${strategy.startDate}</span>` : ''}
                            ${strategy.endDate ? `<br><span>End: ${strategy.endDate}</span>` : ''}
                        </div>
                        ${strategy.budget ? `<div class="strategy-budget">$${strategy.budget}</div>` : ''}
                    </div>
                    
                    ${strategy.goals ? `<p><strong>Goals:</strong> ${strategy.goals}</p>` : ''}
                </div>
                
                <div class="strategy-card-footer">
                    <div>
                        <span class="status active">Active</span>
                    </div>
                    <div class="strategy-actions">
                        <button class="btn btn-secondary btn-sm edit-strategy" data-type="marketing" data-id="${strategy.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-strategy" data-type="marketing" data-id="${strategy.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        addStrategyEventListeners('marketing');
    }
    
    // Load operations strategies
    function loadOperationsStrategies() {
        const strategies = strategyManager.getStrategies('operations');
        const container = document.getElementById('operationsStrategies');
        
        if (!container) return;
        
        if (strategies.length === 0) {
            // Add sample operations strategies
            const sampleStrategies = [
                {
                    id: 1,
                    title: 'Kitchen Efficiency Optimization',
                    description: 'Reorganize kitchen layout and workflow for faster service',
                    category: 'operations',
                    priority: 'high',
                    budget: 5000,
                    goals: 'Reduce preparation time by 20%',
                    startDate: '2024-02-01',
                    endDate: '2024-05-31'
                },
                {
                    id: 2,
                    title: 'Delivery Route Optimization',
                    description: 'Implement smart routing system for delivery drivers',
                    category: 'operations',
                    priority: 'medium',
                    budget: 2500,
                    goals: 'Reduce delivery time by 15% and fuel costs by 10%',
                    startDate: '2024-03-01',
                    endDate: '2024-06-30'
                }
            ];
            
            sampleStrategies.forEach(strategy => {
                strategyManager.createStrategy('operations', strategy);
            });
            
            loadOperationsStrategies(); // Reload with sample data
            return;
        }
        
        container.innerHTML = strategies.map(strategy => `
            <div class="strategy-card ${strategy.category}">
                <div class="strategy-card-header">
                    <h3>${strategy.title}</h3>
                    <span class="strategy-priority priority-${strategy.priority}">
                        ${strategy.priority.charAt(0).toUpperCase() + strategy.priority.slice(1)}
                    </span>
                </div>
                
                <div class="strategy-card-body">
                    <p>${strategy.description}</p>
                    
                    <div class="strategy-meta">
                        <div>
                            <span>Created: ${strategy.created}</span>
                            ${strategy.startDate ? `<br><span>Start: ${strategy.startDate}</span>` : ''}
                            ${strategy.endDate ? `<br><span>End: ${strategy.endDate}</span>` : ''}
                        </div>
                        ${strategy.budget ? `<div class="strategy-budget">$${strategy.budget}</div>` : ''}
                    </div>
                    
                    ${strategy.goals ? `<p><strong>Goals:</strong> ${strategy.goals}</p>` : ''}
                </div>
                
                <div class="strategy-card-footer">
                    <div>
                        <span class="status active">Active</span>
                    </div>
                    <div class="strategy-actions">
                        <button class="btn btn-secondary btn-sm edit-strategy" data-type="operations" data-id="${strategy.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-strategy" data-type="operations" data-id="${strategy.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        addStrategyEventListeners('operations');
    }
    
    // Add event listeners to strategy buttons
    function addStrategyEventListeners(type) {
        document.querySelectorAll(`.edit-strategy[data-type="${type}"]`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.edit-strategy').dataset.id);
                editStrategy(type, id);
            });
        });
        
        document.querySelectorAll(`.delete-strategy[data-type="${type}"]`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.delete-strategy').dataset.id);
                deleteStrategy(type, id);
            });
        });
    }
    
    // Load menu performance
    function loadMenuPerformance() {
        const performance = strategyManager.getMenuPerformance();
        const bestSellers = performance.slice(0, 5);
        const lowPerformers = performance.slice(-5).reverse();
        
        // Update best sellers list
        const bestSellersList = document.getElementById('bestSellers');
        if (bestSellersList) {
            bestSellersList.innerHTML = bestSellers.map(item => `
                <li>
                    <span>${item.name}</span>
                    <span class="item-performance">${item.quantitySold} sold</span>
                </li>
            `).join('');
        }
        
        // Update low performers list
        const lowPerformersList = document.getElementById('lowPerformers');
        if (lowPerformersList) {
            lowPerformersList.innerHTML = lowPerformers.map(item => `
                <li>
                    <span>${item.name}</span>
                    <span class="item-performance">${item.quantitySold} sold</span>
                </li>
            `).join('');
        }
    }
    
    // Load price comparison
    function loadPriceComparison() {
        const comparisons = strategyManager.getPriceComparison();
        const container = document.getElementById('priceComparison');
        
        if (!container) return;
        
        container.innerHTML = comparisons.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>$${item.ourPrice.toFixed(2)}</td>
                <td>$${item.competitorPrice.toFixed(2)}</td>
                <td class="price-difference ${item.isCheaper ? 'positive' : 'negative'}">
                    ${item.isCheaper ? '-' : '+'}$${item.difference.toFixed(2)} (${item.isCheaper ? '' : '+'}${item.differencePercent}%)
                </td>
            </tr>
        `).join('');
    }
    
    // Load SWOT analysis
    function loadSwotAnalysis() {
        const swot = strategyManager.getSwotAnalysis();
        
        // Initialize with sample data if empty
        if (swot.strengths.length === 0 && 
            swot.weaknesses.length === 0 && 
            swot.opportunities.length === 0 && 
            swot.threats.length === 0) {
            
            const sampleSwot = {
                strengths: [
                    { id: 1, item: 'Excellent food quality and consistency', impact: 'high', action: 'Maintain quality standards' },
                    { id: 2, item: 'Strong online presence and delivery system', impact: 'high', action: 'Continue digital investment' },
                    { id: 3, item: 'Loyal customer base with high retention', impact: 'medium', action: 'Enhance loyalty program' }
                ],
                weaknesses: [
                    { id: 4, item: 'Limited physical dining space', impact: 'medium', action: 'Explore expansion options' },
                    { id: 5, item: 'Higher prices than some competitors', impact: 'medium', action: 'Review pricing strategy' },
                    { id: 6, item: 'Limited marketing budget', impact: 'low', action: 'Focus on cost-effective marketing' }
                ],
                opportunities: [
                    { id: 7, item: 'Growing demand for healthy food options', impact: 'high', action: 'Expand healthy menu section' },
                    { id: 8, item: 'Partnership with corporate offices for catering', impact: 'medium', action: 'Develop corporate catering program' },
                    { id: 9, item: 'Expansion to neighboring cities', impact: 'high', action: 'Conduct market research' }
                ],
                threats: [
                    { id: 10, item: 'Increasing competition from food delivery apps', impact: 'high', action: 'Differentiate through quality' },
                    { id: 11, item: 'Rising food ingredient costs', impact: 'medium', action: 'Negotiate with suppliers' },
                    { id: 12, item: 'Changing dietary trends', impact: 'medium', action: 'Stay updated with food trends' }
                ]
            };
            
            strategyManager.saveSwotAnalysis(sampleSwot);
            loadSwotAnalysis(); // Reload with sample data
            return;
        }
        
        // Update each SWOT category
        updateSwotList('strengths', swot.strengths);
        updateSwotList('weaknesses', swot.weaknesses);
        updateSwotList('opportunities', swot.opportunities);
        updateSwotList('threats', swot.threats);
    }
    
    // Update SWOT list
    function updateSwotList(type, items) {
        const list = document.getElementById(`${type}List`);
        if (!list) return;
        
        list.innerHTML = items.map(item => `
            <li>
                ${item.item}
                ${item.impact ? `<small style="display:block;color:#666;">Impact: ${item.impact}</small>` : ''}
                ${item.action ? `<small style="display:block;color:#666;">Action: ${item.action}</small>` : ''}
                <button class="delete-swot" data-type="${type}" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `).join('');
        
        // Add delete event listeners
        list.querySelectorAll('.delete-swot').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const swotType = btn.dataset.type;
                const id = parseInt(btn.dataset.id);
                deleteSwotItem(swotType, id);
            });
        });
    }
    
    // Open strategy modal
    function openStrategyModal(type, strategy = null) {
        const modalTitle = document.getElementById('modalTitle');
        
        if (strategy) {
            modalTitle.textContent = 'Edit Strategy';
            document.getElementById('strategyId').value = strategy.id;
            document.getElementById('strategyTitle').value = strategy.title;
            document.getElementById('strategyDescription').value = strategy.description;
            document.getElementById('strategyCategory').value = strategy.category || type;
            document.getElementById('strategyPriority').value = strategy.priority;
            document.getElementById('startDate').value = strategy.startDate || '';
            document.getElementById('endDate').value = strategy.endDate || '';
            document.getElementById('strategyBudget').value = strategy.budget || '';
            document.getElementById('strategyGoals').value = strategy.goals || '';
            document.getElementById('strategyType').value = type;
        } else {
            modalTitle.textContent = 'Add New Strategy';
            strategyForm.reset();
            document.getElementById('strategyId').value = '';
            document.getElementById('strategyCategory').value = type;
            document.getElementById('strategyType').value = type;
        }
        
        strategyModal.classList.add('active');
    }
    
    // Close strategy modal
    function closeStrategyModal() {
        strategyModal.classList.remove('active');
        strategyForm.reset();
    }
    
    // Open SWOT modal
    function openSwotModal(type, item = null) {
        const modalTitle = document.getElementById('swotModalTitle');
        const typeNames = {
            strength: 'Strength',
            weakness: 'Weakness',
            opportunity: 'Opportunity',
            threat: 'Threat'
        };
        
        if (item) {
            modalTitle.textContent = `Edit ${typeNames[type]}`;
            document.getElementById('swotId').value = item.id;
            document.getElementById('swotItem').value = item.item;
            document.getElementById('swotImpact').value = item.impact || 'medium';
            document.getElementById('swotAction').value = item.action || '';
            document.getElementById('swotType').value = type;
        } else {
            modalTitle.textContent = `Add ${typeNames[type]}`;
            swotForm.reset();
            document.getElementById('swotId').value = '';
            document.getElementById('swotImpact').value = 'medium';
            document.getElementById('swotType').value = type;
        }
        
        swotModal.classList.add('active');
    }
    
    // Close SWOT modal
    function closeSwotModal() {
        swotModal.classList.remove('active');
        swotForm.reset();
    }
    
    // Handle strategy submission
    function handleStrategySubmit(e) {
        e.preventDefault();
        
        const type = document.getElementById('strategyType').value;
        const strategyId = document.getElementById('strategyId').value;
        const strategyData = {
            title: document.getElementById('strategyTitle').value,
            description: document.getElementById('strategyDescription').value,
            category: document.getElementById('strategyCategory').value,
            priority: document.getElementById('strategyPriority').value,
            startDate: document.getElementById('startDate').value || null,
            endDate: document.getElementById('endDate').value || null,
            budget: document.getElementById('strategyBudget').value ? 
                    parseFloat(document.getElementById('strategyBudget').value) : null,
            goals: document.getElementById('strategyGoals').value || null
        };
        
        if (strategyId) {
            // Update existing strategy
            strategyManager.updateStrategy(type, parseInt(strategyId), strategyData);
            showAlert('Strategy updated successfully!', 'success');
        } else {
            // Create new strategy
            strategyManager.createStrategy(type, strategyData);
            showAlert('Strategy created successfully!', 'success');
        }
        
        closeStrategyModal();
        
        // Reload the appropriate tab
        switch(type) {
            case 'menu':
                loadMenuStrategies();
                break;
            case 'pricing':
                loadPricingStrategies();
                break;
            case 'marketing':
                loadMarketingStrategies();
                break;
            case 'operations':
                loadOperationsStrategies();
                break;
        }
    }
    
    // Handle SWOT submission
    function handleSwotSubmit(e) {
        e.preventDefault();
        
        const type = document.getElementById('swotType').value;
        const swotId = document.getElementById('swotId').value;
        const swotData = {
            item: document.getElementById('swotItem').value,
            impact: document.getElementById('swotImpact').value,
            action: document.getElementById('swotAction').value || null
        };
        
        if (swotId) {
            // Update existing SWOT item
            const swot = strategyManager.getSwotAnalysis();
            const index = swot[type].findIndex(item => item.id === parseInt(swotId));
            if (index !== -1) {
                swot[type][index] = { ...swot[type][index], ...swotData };
                strategyManager.saveSwotAnalysis(swot);
                showAlert('SWOT item updated successfully!', 'success');
            }
        } else {
            // Create new SWOT item
            strategyManager.addSwotItem(type, swotData);
            showAlert('SWOT item added successfully!', 'success');
        }
        
        closeSwotModal();
        loadSwotAnalysis();
    }
    
    // Edit strategy
    function editStrategy(type, id) {
        const strategies = strategyManager.getStrategies(type);
        const strategy = strategies.find(s => s.id === id);
        if (strategy) {
            openStrategyModal(type, strategy);
        }
    }
    
    // Delete strategy
    function deleteStrategy(type, id) {
        if (confirm('Are you sure you want to delete this strategy?')) {
            strategyManager.deleteStrategy(type, id);
            showAlert('Strategy deleted successfully!', 'success');
            
            // Reload the appropriate tab
            switch(type) {
                case 'menu':
                    loadMenuStrategies();
                    break;
                case 'pricing':
                    loadPricingStrategies();
                    break;
                case 'marketing':
                    loadMarketingStrategies();
                    break;
                case 'operations':
                    loadOperationsStrategies();
                    break;
            }
        }
    }
    
    // Delete SWOT item
    function deleteSwotItem(type, id) {
        if (confirm('Are you sure you want to delete this item?')) {
            strategyManager.deleteSwotItem(type, id);
            showAlert('SWOT item deleted successfully!', 'success');
            loadSwotAnalysis();
        }
    }
    
    // Initialize charts
    function initializeCharts() {
        initializeROIChart();
    }
    
    // Initialize ROI chart
    function initializeROIChart() {
        const ctx = document.getElementById('roiChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (window.roiChart) {
            window.roiChart.destroy();
        }
        
        window.roiChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Social Media', 'Email Marketing', 'Influencers', 'Referral Program', 'Local Ads'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#e74c3c',
                        '#f39c12',
                        '#9b59b6'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}% ROI`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Generate SWOT report
    function generateSwotReport() {
        showAlert('SWOT report generation would be implemented in a real application. This is a demo.', 'info');
        
        // In a real app, this would generate a PDF report
        setTimeout(() => {
            showAlert('Report generated successfully! (Demo)', 'success');
        }, 1500);
    }
    
    // Export SWOT analysis
    function exportSwotAnalysis() {
        const swot = strategyManager.getSwotAnalysis();
        const dataStr = JSON.stringify(swot, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `swot-analysis-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showAlert('SWOT analysis exported successfully!', 'success');
    }
});

// Show alert function (from auth.js)
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.padding = '15px 20px';
    alertDiv.style.borderRadius = '8px';
    alertDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 3000);
}