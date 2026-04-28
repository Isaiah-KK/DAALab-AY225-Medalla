    document.addEventListener('DOMContentLoaded', () => {
        // Determine which page we are currently on
        const currentPage = document.body.dataset.page;
        
        // Render charts based on the page
        if (currentPage === 'literacy') {
            renderLiteracyCharts();
        } else if (currentPage === 'enrollment') {
            renderEnrollmentCharts();
        } else if (currentPage === 'expenditure') {
            renderExpenditureCharts();
        }
    });

    // ==========================================
    // Page 1: Literacy Data
    // ==========================================
    function renderLiteracyCharts() {
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
                datasets: [{
                    label: 'Global Average', 
                    data: [82, 83, 84, 85, 86, 86.5],
                    borderColor: '#00f0ff', // Neon Cyan
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                // ---> SCALES GO RIGHT HERE <---
                scales: {
                    y: { 
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
                        ticks: { color: '#94a3b8' } 
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#f8fafc' } } // Makes the legend text white
                }
            }
        });

        const barCtx = document.getElementById('barChart').getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Japan', 'Finland', 'Canada', 'South Korea'],
                datasets: [{ 
                    label: 'Literacy Rate', 
                    data: [99, 99, 99, 98], 
                    backgroundColor: '#8a2be2', // Neon Purple
                    borderRadius: 4
                }]
            },
            options: { 
                indexAxis: 'y', 
                responsive: true, 
                maintainAspectRatio: false,
                // ---> SCALES GO RIGHT HERE TOO <---
                scales: {
                    y: { 
                        grid: { display: false }, // Hide horizontal lines for bar chart
                        ticks: { color: '#94a3b8' } 
                    },
                    x: { 
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: {
                    legend: { display: false } // Hide legend for single-bar chart
                }
            }
        });
    }

    // ==========================================
    // Page 2: Enrollment Data
    // ==========================================
    function renderEnrollmentCharts() {
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
                datasets: [{
                    label: 'Tertiary Enrollment (%)', data: [36, 37.5, 38, 39, 39.5, 40.2],
                    borderColor: '#8B5CF6', tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        const barCtx = document.getElementById('barChart').getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['North America', 'Europe', 'East Asia', 'Latin America'],
                datasets: [{ label: 'Enrollment (%)', data: [88, 75, 55, 52], backgroundColor: '#8B5CF6' }]
            },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
        });
    }

    // ==========================================
    // Page 3: Expenditure Data
    // ==========================================
    function renderExpenditureCharts() {
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
                datasets: [{
                    label: 'Global Expenditure (% of GDP)', data: [4.4, 4.5, 4.5, 4.6, 4.5, 4.5],
                    borderColor: '#F59E0B', tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        const barCtx = document.getElementById('barChart').getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Norway', 'Costa Rica', 'South Africa', 'USA'],
                datasets: [{ label: 'Expenditure (%)', data: [7.9, 7.4, 6.2, 4.9], backgroundColor: '#F59E0B' }]
            },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
        });
    }

    // Add this check to your existing DOMContentLoaded listener
    document.addEventListener('DOMContentLoaded', () => {
        const currentPage = document.body.dataset.page;
        
        // Existing page checks...
        if (currentPage === 'literacy') renderLiteracyCharts();
        else if (currentPage === 'enrollment') renderEnrollmentCharts();
        else if (currentPage === 'expenditure') renderExpenditureCharts();
        
        // NEW ANALYSIS ROUTE
        else if (currentPage === 'analysis') {
            runAnalysisEngine();
        }
    });

        
    // ==========================================
    // ANALYSIS ENGINE & STATS (PART B)
    // ==========================================

    // Mock Dataset linking Expenditure (x) to Literacy (y)
    const analysisData = [
        { country: 'Norway', expenditure: 7.9, literacy: 99 },
        { country: 'Costa Rica', expenditure: 7.4, literacy: 97 },
        { country: 'South Africa', expenditure: 6.2, literacy: 87 },
        { country: 'Brazil', expenditure: 6.0, literacy: 93 },
        { country: 'United States', expenditure: 4.9, literacy: 99 },
        { country: 'India', expenditure: 3.5, literacy: 74 },
        { country: 'Chad', expenditure: 2.9, literacy: 22 },
        { country: 'Niger', expenditure: 3.8, literacy: 35 },
        { country: 'Vietnam', expenditure: 4.1, literacy: 95 },
        { country: 'Mali', expenditure: 3.1, literacy: 31 },
        { country: 'Finland', expenditure: 7.1, literacy: 99 },
        { country: 'Japan', expenditure: 3.6, literacy: 99 } // High literacy, low spend (outlier)
    ];

    // Statistical Functions
    const variance = (arr) => {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
    };

    const stdDev = (arr) => Math.sqrt(variance(arr));

    const pearsonCorr = (x, y) => {
        const n = x.length;
        const meanX = x.reduce((a, b) => a + b, 0) / n;
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        
        let numerator = 0, denomX = 0, denomY = 0;
        for (let i = 0; i < n; i++) {
            const diffX = x[i] - meanX;
            const diffY = y[i] - meanY;
            numerator += (diffX * diffY);
            denomX += (diffX * diffX);
            denomY += (diffY * diffY);
        }
        return numerator / Math.sqrt(denomX * denomY);
    };

    const linearRegression = (x, y) => {
        const r = pearsonCorr(x, y);
        const slope = r * (stdDev(y) / stdDev(x));
        const meanX = x.reduce((a, b) => a + b, 0) / x.length;
        const meanY = y.reduce((a, b) => a + b, 0) / y.length;
        const intercept = meanY - (slope * meanX);
        return { slope, intercept, rSquared: r * r };
    };

    function runAnalysisEngine() {
        const scores = analysisData.map(d => d.literacy);
        const hours = analysisData.map(d => d.expenditure); // Mapped to expenditure
        
        // Render Insights Narrative
        renderInsights(scores, hours);
        
        // Draw Charts
        drawBarChart('barChart', analysisData);
        drawScatterPlot('scatterChart', analysisData, hours, scores);
        drawDoughnut('doughnutChart', analysisData);
    }

    function renderInsights(scores, hours) {
        const r = pearsonCorr(hours, scores).toFixed(2);
        const sd = stdDev(scores).toFixed(1);
        const reg = linearRegression(hours, scores);
        
        const insightsBody = document.getElementById('insightsBody');
        insightsBody.innerHTML = `
            <p>
                Based on the dataset of 12 nations, the standard deviation for global literacy is <span style="color: var(--neon-cyan); font-weight: bold;">${sd}%</span>, indicating a wide global disparity. 
                When analyzing Government Expenditure against Literacy Rates, we observe a Pearson Correlation coefficient of <span style="color: var(--neon-cyan); font-weight: bold;">${r}</span>. 
                The linear regression model (R² = ${(reg.rSquared).toFixed(2)}) suggests that for every 1% increase in GDP expenditure on education, baseline literacy is projected to shift by <span style="color: var(--success-green); font-weight: bold;">${reg.slope.toFixed(2)}%</span>. 
                However, outliers like Japan demonstrate that systemic efficiency can outpace sheer expenditure.
            </p>
        `;
    }

    // ==========================================
    // VISUALIZATION LAYER (PART A)
    // ==========================================

    // Helper to destroy old charts
    function destroyChartIfExists(canvasId) {
        const existingChart = Chart.getChart(canvasId);
        if (existingChart) existingChart.destroy();
    }

    function drawBarChart(canvasId, data) {
        destroyChartIfExists(canvasId);
        
        // Sort descending and take top 10
        const sorted = [...data].sort((a, b) => b.literacy - a.literacy).slice(0, 10);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sorted.map(d => d.country), // Full student/country names
                datasets: [{
                    label: 'Literacy Rate',
                    data: sorted.map(d => d.literacy),
                    backgroundColor: 'rgba(217, 79, 61, 0.8)', // Coral #d94f3d at 80% opacity
                    borderWidth: 0
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    function drawScatterPlot(canvasId, data, xArr, yArr) {
        destroyChartIfExists(canvasId);
        
        // Calculate Regression Line points (min and max X)
        const reg = linearRegression(xArr, yArr);
        const minX = Math.min(...xArr);
        const maxX = Math.max(...xArr);
        const lineData = [
            { x: minX, y: (reg.slope * minX) + reg.intercept },
            { x: maxX, y: (reg.slope * maxX) + reg.intercept }
        ];

        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Countries',
                        data: data.map(d => ({ x: d.expenditure, y: d.literacy, name: d.country })),
                        backgroundColor: '#3a7d5c', // Sage green
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Trend (Regression)',
                        data: lineData,
                        type: 'line',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: false,
                        interactive: false // Non-interactive secondary dataset
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Expenditure (% of GDP)', color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { title: { display: true, text: 'Literacy Rate (%)', color: '#94a3b8' }, min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                },
                plugins: {
                    legend: { labels: { color: '#f8fafc' } },
                    tooltip: {
                        callbacks: {
                            // Tooltip callback -> dataset.label[i] translated to object property
                            label: function(context) {
                                if (context.dataset.type === 'line') return 'Trend Line';
                                const pt = context.raw;
                                return `${pt.name}: ${pt.y}% Lit, ${pt.x}% Spend`;
                            }
                        }
                    }
                }
            }
        });
    }

    function drawDoughnut(canvasId, data) {
        destroyChartIfExists(canvasId);
        
        // Categorize grades (Adapting A, B, C, D to Literacy tiers)
        let counts = { A: 0, B: 0, C: 0, D: 0 };
        data.forEach(d => {
            if (d.literacy >= 90) counts.A++;      // A: Exceptional
            else if (d.literacy >= 75) counts.B++; // B: High
            else if (d.literacy >= 50) counts.C++; // C: Medium
            else counts.D++;                       // D: Low/Critical
        });

        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Exceptional (>90%)', 'High (75-89%)', 'Medium (50-74%)', 'Critical (<50%)'],
                datasets: [{
                    data: [counts.A, counts.B, counts.C, counts.D],
                    backgroundColor: ['#2a7a50', '#3a6ea8', '#b5820d', '#d94f3d'], // Exact requested colors
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '60%', // Specific constraint
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#94a3b8' } },
                    tooltip: {
                        callbacks: {
                            // Show count + % in tooltip
                            label: function(context) {
                                const val = context.raw;
                                const total = context.chart._metasets[context.datasetIndex].total;
                                const percentage = Math.round((val / total) * 100);
                                return `${context.label}: ${val} countries (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /* ── PART A: CHART FUNCTIONS ────────────────────────────────────── */

    // Ensure global CHARTS object exists to track and destroy instances
    window.CHARTS = window.CHARTS || {};

    // Fallback helper in case Student 1's mean() isn't globally available
    const getMean = (arr) => (typeof mean === 'function') ? mean(arr) : arr.reduce((a, b) => a + b, 0) / arr.length;

    function initCharts() {
    drawBarChart('barChart', window.DS);
    drawScatterPlot('scatterChart', window.DS);
    drawDoughnut('doughnutChart', window.DS);
    }

    function drawBarChart(canvasId, data) {
    // 1 & 2: Sort descending and slice top 10
    const top10 = [...data].sort((a, b) => b.score - a.score).slice(0, 10);

    // 3: Destroy old chart
    if (window.CHARTS[canvasId]) {
        window.CHARTS[canvasId].destroy();
    }

    // 4 & 5: Setup chart
    const ctx = document.getElementById(canvasId).getContext('2d');
    const options = chartTheme();
    options.indexAxis = 'y';
    options.plugins.legend.display = false; // Hide legend for single dataset

    // 6, 7, & 8: Build and store instance
    window.CHARTS[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: top10.map(d => d.name),
        datasets: [{
            label: 'Score',
            data: top10.map(d => d.score),
            backgroundColor: 'rgba(217, 79, 61, 0.82)',
            borderColor: 'rgba(217, 79, 61, 1)',
            borderWidth: 1
        }]
        },
        options: options
    });

    // 9: Toggle visibility
    document.getElementById('barPlaceholder').style.display = 'none';
    document.getElementById(canvasId).style.display = 'block';
    }

    function drawScatterPlot(canvasId, data) {
    if (window.CHARTS[canvasId]) {
        window.CHARTS[canvasId].destroy();
    }
    const ctx = document.getElementById(canvasId).getContext('2d');

    // 1. Build points array
    const scatterPoints = data.map(d => ({ x: d.attendance, y: d.score }));

    // Compute Regression Line Data
    const xVals = data.map(d => d.attendance);
    const yVals = data.map(d => d.score);
    const reg = linearRegression(xVals, yVals);
    
    const linePoints = [
        { x: 55, y: reg.slope * 55 + reg.intercept },
        { x: 100, y: reg.slope * 100 + reg.intercept }
    ];

    const options = chartTheme();
    
    // 6: Custom tooltip callback
    options.plugins.tooltip.callbacks = {
        label: (context) => {
        // Differentiate between scatter points and regression line
        if (context.datasetIndex === 1) return `Trend Line`;
        return `${data[context.dataIndex].name}: ${context.parsed.y}`;
        }
    };

    window.CHARTS[canvasId] = new Chart(ctx, {
        type: 'scatter',
        data: {
        datasets: [
            {
            label: 'Students',
            data: scatterPoints,
            backgroundColor: '#3a7d5c',
            pointRadius: 7,
            pointHoverRadius: 10
            },
            {
            label: 'Trend Line',
            data: linePoints,
            type: 'line', // Mixed chart
            borderColor: '#d94f3d',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0
            }
        ]
        },
        options: options
    });

    document.getElementById('scatterPlaceholder').style.display = 'none';
    document.getElementById(canvasId).style.display = 'block';
    }

    function drawDoughnut(canvasId, data) {
    if (window.CHARTS[canvasId]) {
        window.CHARTS[canvasId].destroy();
    }
    const ctx = document.getElementById(canvasId).getContext('2d');

    // 1: Count grades
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    data.forEach(d => {
        if (counts[d.grade] !== undefined) counts[d.grade]++;
    });

    const options = chartTheme();
    options.cutout = '60%';
    
    // 7: Tooltip callback for count and percentage
    options.plugins.tooltip.callbacks = {
        label: (context) => {
        const val = context.parsed;
        const pct = ((val / data.length) * 100).toFixed(1);
        return ` Grade ${context.label}: ${val} students (${pct}%)`;
        }
    };

    window.CHARTS[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [{
            data: [counts.A, counts.B, counts.C, counts.D],
            backgroundColor: ['#2a7a50', '#3a6ea8', '#b5820d', '#d94f3d'],
            borderWidth: 0
        }]
        },
        options: options
    });

    document.getElementById('doughnutPlaceholder').style.display = 'none';
    document.getElementById(canvasId).style.display = 'block';
    }


    /* ── PART B: STATISTICAL ANALYSIS FUNCTIONS ─────────────────────── */

    function variance(arr) {
    if (!arr || arr.length === 0) return 0;
    const mu = getMean(arr);
    const sumSqDiffs = arr.map(x => Math.pow(x - mu, 2)).reduce((a, b) => a + b, 0);
    const result = sumSqDiffs / arr.length;
    // Round to 2 decimal places
    return Math.round(result * 100) / 100;
    }

    function stdDev(arr) {
    return Math.round(Math.sqrt(variance(arr)) * 100) / 100;
    }

    function pearsonCorr(x, y) {
    if (!x.length || !y.length) return 0;
    const mx = getMean(x);
    const my = getMean(y);
    
    let num = 0, denomX = 0, denomY = 0;
    
    for (let i = 0; i < x.length; i++) {
        const diffX = x[i] - mx;
        const diffY = y[i] - my;
        num += (diffX * diffY);
        denomX += (diffX * diffX);
        denomY += (diffY * diffY);
    }
    
    const r = num / Math.sqrt(denomX * denomY);
    // Round to 4 decimal places
    return Math.round(r * 10000) / 10000;
    }

    function linearRegression(x, y) {
    const mx = getMean(x);
    const my = getMean(y);
    
    let num = 0, denomX = 0;
    for (let i = 0; i < x.length; i++) {
        const diffX = x[i] - mx;
        const diffY = y[i] - my;
        num += (diffX * diffY);
        denomX += (diffX * diffX);
    }
    
    const slope = num / denomX;
    const intercept = my - (slope * mx);
    const rSquared = Math.pow(pearsonCorr(x, y), 2);

    // Round to 4 decimal places
    return {
        slope: Math.round(slope * 10000) / 10000,
        intercept: Math.round(intercept * 10000) / 10000,
        rSquared: Math.round(rSquared * 10000) / 10000
    };
    }

    function renderAnalysis(data) {
    const scores = data.map(d => d.score);
    const hours  = data.map(d => d.studyHours);
    const attend = data.map(d => d.attendance);

    // Helper for interpretation
    const getInterp = (r) => {
        const absR = Math.abs(r);
        const strength = absR >= 0.7 ? "Strong" : (absR >= 0.4 ? "Moderate" : "Weak");
        const direction = r > 0 ? "Positive" : "Negative";
        return `${strength} ${direction} Correlation`;
    };

    // Descriptive Stats
    document.getElementById('an').innerText = data.length;
    document.getElementById('aMin').innerText = Math.min(...scores);
    document.getElementById('aMax').innerText = Math.max(...scores);
    document.getElementById('aRange').innerText = Math.max(...scores) - Math.min(...scores);
    document.getElementById('aVariance').innerText = variance(scores);
    document.getElementById('aStdDev').innerText = stdDev(scores);

    // Correlation Tile
    const rHrs = pearsonCorr(hours, scores);
    const rAtt = pearsonCorr(attend, scores);
    
    document.getElementById('rPearson').innerText = rHrs;
    document.getElementById('rInterp').innerText = getInterp(rHrs);
    document.getElementById('rPearson2').innerText = rAtt;
    document.getElementById('rInterp2').innerText = getInterp(rAtt);

    document.getElementById('rStronger').innerText = Math.abs(rHrs) > Math.abs(rAtt) ? "Study Hours" : "Attendance";

    let dirBoth = "Mixed";
    if (rHrs > 0 && rAtt > 0) dirBoth = "Both positive";
    else if (rHrs < 0 && rAtt < 0) dirBoth = "Both negative";
    document.getElementById('rDirection').innerText = dirBoth;

    // Regression Tile
    const reg = linearRegression(hours, scores);
    document.getElementById('regEquation').innerText = `score = ${reg.slope}·hours + ${reg.intercept}`;
    document.getElementById('regSlope').innerText = reg.slope;
    document.getElementById('regIntercept').innerText = reg.intercept;
    document.getElementById('regR2').innerText = reg.rSquared;

    let fitStr = "Weak fit";
    if (reg.rSquared >= 0.9) fitStr = "Excellent fit";
    else if (reg.rSquared >= 0.7) fitStr = "Good fit";
    document.getElementById('regInterp').innerText = fitStr;

    document.getElementById('regPredict').innerText = (reg.slope * 15 + reg.intercept).toFixed(1);
    }

    function renderInsights(data) {
    const scores = data.map(d => d.score);
    const hours  = data.map(d => d.studyHours);
    
    const meanScore = getMean(scores).toFixed(1);
    const passRate = ((data.filter(d => ['A', 'B', 'C'].includes(d.grade)).length / data.length) * 100).toFixed(1);
    
    const rHrs = pearsonCorr(hours, scores);
    const absR = Math.abs(rHrs);
    const rStr = absR >= 0.7 ? "Strong Positive" : (absR >= 0.4 ? "Moderate Positive" : "Weak Positive");
    
    const reg = linearRegression(hours, scores);
    const predicted = (reg.slope * 15 + reg.intercept).toFixed(1);
    
    // Safe extraction for the part-time jobs observation 
    const noJobData = data.filter(d => d.hasPartTimeJob === false);
    const meanNoJob = noJobData.length > 0 
        ? getMean(noJobData.map(d => d.score)).toFixed(1) 
        : "N/A";

    const narrative = `
        The cohort achieved a mean final score of <span class='highlight'>${meanScore}</span>, 
        resulting in an overall pass rate of <span class='highlight'>${passRate}%</span>. 
        Study hours showed a <span class='highlight'>${rStr}</span> correlation with final performance. 
        Using our linear regression model, it is predicted that a student dedicating 15 hours per week will achieve a score of <span class='highlight'>${predicted}</span>. 
        Interestingly, students without part-time jobs averaged a score of <span class='highlight'>${meanNoJob}</span>, highlighting the potential impact of external time commitments.
    `;

    document.getElementById('insightsBody').innerHTML = `<p class="insight-text">${narrative}</p>`;
    }
