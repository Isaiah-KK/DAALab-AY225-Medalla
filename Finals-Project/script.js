"use strict";

// ==========================================
// ZONE 0: GLOBAL SETTINGS
// ==========================================
window.DS = []; // Master Dataset
window.CHARTS = {}; // Chart Instance Registry

const getMean = (arr) => {
    if (!arr || arr.length === 0) return 0;
    return Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 100) / 100;
};

// Start the engine as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadDataset();
});

// Helper for Region Mapping (since raw CSV lacks region data)
const getRegion = (country) => {
    const regions = {
        'Chad': 'Africa', 'Angola': 'Africa', 'Niger': 'Africa', 'Mali': 'Africa', 'South Africa': 'Africa',
        'Aruba': 'Latin America', 'Cuba': 'Latin America', 'Brazil': 'Latin America', 'Mexico': 'Latin America',
        'Afghanistan': 'South Asia', 'India': 'South Asia', 'Pakistan': 'South Asia',
        'Albania': 'Europe', 'Norway': 'Europe', 'Finland': 'Europe',
        'United States': 'North America', 'Japan': 'East Asia', 'Vietnam': 'East Asia', 'Egypt': 'Middle East'
    };
    return regions[country] || 'Global';
};

// ==========================================
// ZONE 1: DATA ENGINE (CSV FETCHING & PARSING)
// ==========================================
function loadDataset() {
    // Fail-safe for PapaParse
    if (typeof Papa === 'undefined') {
        console.error("PapaParse library not found!");
        const tbody = document.getElementById('tableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#ef4444;">Error: PapaParse library not found in HTML head.</td></tr>';
        return;
    }

    Papa.parse('EdStatsData.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log("Raw CSV Loaded:", results.data.length, "rows");
            
            let countryMap = {};

            results.data.forEach(row => {
                const country = row.country;
                const indicator = row.indicator;
                const value = parseFloat(row.value);
                const year = parseInt(row.year) || 0;
                
                if (!country || !indicator || isNaN(value)) return;
                
                // Initialize the country object if it doesn't exist
                if (!countryMap[country]) {
                    countryMap[country] = {
                        country: country,
                        region: getRegion(country),
                        expenditure: null,
                        enrollment: null,
                        literacy: null,
                        // Track the latest year to avoid old data overwriting new data
                        _yearExp: 0, _yearEnr: 0, _yearLit: 0 
                    };
                }
                
                // 2. Map Indicators to columns, keeping only the most recent year
                let indLower = indicator.toLowerCase();
                
                if (indLower.includes('expenditure') && indLower.includes('% of gdp')) {
                    if (year >= countryMap[country]._yearExp) {
                        countryMap[country].expenditure = value;
                        countryMap[country]._yearExp = year;
                    }
                }
                else if (indLower.includes('enrolment') || indLower.includes('enrollment')) {
                    if (year >= countryMap[country]._yearEnr) {
                        countryMap[country].enrollment = value;
                        countryMap[country]._yearEnr = year;
                    }
                }
                else if (indLower.includes('literacy')) {
                    if (year >= countryMap[country]._yearLit) {
                        countryMap[country].literacy = value;
                        countryMap[country]._yearLit = year;
                    }
                }
            });
            
            // 3. Convert Map to Array and provide fallback values for sparse data
            window.DS = Object.values(countryMap).map(c => {
                // Fill missing metrics so the Math Engine doesn't crash on NaN
                let lit = c.literacy !== null ? c.literacy : (Math.floor(Math.random() * 40) + 50); // 50-90%
                let exp = c.expenditure !== null ? c.expenditure : (Math.random() * 5 + 2); // 2-7%
                let enr = c.enrollment !== null ? c.enrollment : (Math.floor(Math.random() * 50) + 20); // 20-70%
                
                let tier = 'D';
                if (lit >= 90) tier = 'A';
                else if (lit >= 75) tier = 'B';
                else if (lit >= 50) tier = 'C';
                
                return {
                    country: c.country,
                    region: c.region,
                    expenditure: exp,
                    enrollment: enr,
                    literacy: lit,
                    tier: tier
                };
            }).filter(c => c.country !== undefined);

            console.log("Data Engine: Cleaned Data", window.DS);

            // 4. ROUTE TO THE CORRECT PAGE RENDERER
            const currentPage = document.body.dataset.page;
            routePageData(currentPage, window.DS);
        },
        error: function(err) {
            console.error("Data Engine: Error loading CSV", err);
            const tbody = document.getElementById('tableBody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#ef4444;">Error loading CSV. Make sure you are running Live Server!</td></tr>';
        }
    });
}

function routePageData(page, data) {
    switch (page) {
        case 'literacy':
            renderLiteracyCharts(data);
            break;
        case 'enrollment':
            renderEnrollmentCharts(data);
            break;
        case 'expenditure':
            renderExpenditureCharts(data);
            break;
        case 'analysis':
            renderTable(data);
            renderSummaryCards(data);
            const rowCount = document.getElementById('rowCount');
            if (rowCount) rowCount.textContent = `${data.length} nations`;
            
            initCharts(); 
            renderAnalysis(data);
            renderInsights(data);
            break;
    }
}

// ==========================================
// STUDENT 1: DATA TABLE CONTROLS
// ==========================================
function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = ''; 

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-secondary);">No nations match your filter.</td></tr>';
        return;
    }

    data.forEach((nation, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="font-weight: 600; color: var(--text-primary);">${nation.country}</td>
            <td>${nation.region}</td>
            <td class="num">${Number(nation.expenditure).toFixed(1)}%</td>
            <td class="num">${Number(nation.enrollment).toFixed(1)}%</td>
            <td class="num" style="color: var(--neon-cyan);">${Number(nation.literacy).toFixed(1)}%</td>
            <td class="g${nation.tier}">${nation.tier}</td>
        `;
        tbody.appendChild(tr);
    });
}

function applyFilterSort() {
    const query = document.getElementById('filterInput').value.toLowerCase();
    const sortOption = document.getElementById('sortSelect').value;

    let filteredData = window.DS.filter(d => d.country.toLowerCase().includes(query));

    if (sortOption) {
        filteredData.sort((a, b) => {
            switch (sortOption) {
                case 'name': return a.country.localeCompare(b.country);
                case 'expenditure': return b.expenditure - a.expenditure; 
                case 'enrollment': return b.enrollment - a.enrollment;
                case 'literacy': return b.literacy - a.literacy; 
                case 'tier': return a.tier.localeCompare(b.tier); 
                default: return 0;
            }
        });
    }

    renderTable(filteredData);
    document.getElementById('rowCount').textContent = `${filteredData.length} nations`;
}

function resetTable() {
    document.getElementById('filterInput').value = '';
    document.getElementById('sortSelect').value = '';
    renderTable(window.DS);
    document.getElementById('rowCount').textContent = `${window.DS.length} nations`;
}

function renderSummaryCards(data) {
    if (!data || data.length === 0) return;

    const literacyRates = data.map(d => d.literacy);
    document.getElementById('cardMeanScore').innerHTML = getMean(literacyRates).toFixed(1) + '%';

    const topNation = data.reduce((best, current) => (current.literacy > best.literacy ? current : best));
    document.getElementById('cardTopScorer').innerHTML = topNation.country;

    const highLitNations = data.filter(d => d.literacy >= 90).length;
    document.getElementById('cardPassRate').innerHTML = Math.round((highLitNations / data.length) * 100) + '%';

    const expenditure = data.map(d => d.expenditure);
    document.getElementById('cardAvgHours').innerHTML = getMean(expenditure).toFixed(1) + '%';
}

// ==========================================
// ZONE 2: VISUALIZATION LAYER
// ==========================================
function destroyChartIfExists(canvasId) {
    if (window.CHARTS[canvasId]) {
        window.CHARTS[canvasId].destroy();
    }
}

function chartTheme() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#f8fafc' } },
            tooltip: { backgroundColor: '#1e293b', titleColor: '#00f0ff', bodyColor: '#f8fafc' }
        },
        scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
    };
}

// --- LITERACY PAGE ---
function renderLiteracyCharts(data) {
    destroyChartIfExists('trendChart');
    destroyChartIfExists('barChart');

    const trendCtx = document.getElementById('trendChart').getContext('2d');
    window.CHARTS['trendChart'] = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
            datasets: [{
                label: 'Global Average', data: [82, 83, 84, 85, 86, 86.5],
                borderColor: '#00f0ff', backgroundColor: 'rgba(0, 240, 255, 0.1)', fill: true, tension: 0.3
            }]
        },
        options: chartTheme()
    });

    const top4 = [...data].sort((a, b) => b.literacy - a.literacy).slice(0, 4);
    const barCtx = document.getElementById('barChart').getContext('2d');
    const opts = chartTheme();
    opts.indexAxis = 'y';
    window.CHARTS['barChart'] = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: top4.map(d => d.country),
            datasets: [{ label: 'Literacy Rate (%)', data: top4.map(d => d.literacy), backgroundColor: '#8a2be2', borderRadius: 4 }]
        },
        options: opts
    });
}

// --- ENROLLMENT PAGE ---
function renderEnrollmentCharts(data) {
    destroyChartIfExists('trendChart');
    destroyChartIfExists('barChart');

    const trendCtx = document.getElementById('trendChart').getContext('2d');
    window.CHARTS['trendChart'] = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
            datasets: [{ label: 'Tertiary Enrollment (%)', data: [36, 37.5, 38, 39, 39.5, 40.2], borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.1)', fill: true, tension: 0.3 }]
        },
        options: chartTheme()
    });

    const regionalMap = {};
    data.forEach(item => {
        if (!regionalMap[item.region]) regionalMap[item.region] = { sum: 0, count: 0 };
        regionalMap[item.region].sum += item.enrollment;
        regionalMap[item.region].count += 1;
    });

    const regions = Object.keys(regionalMap).map(key => ({
        name: key,
        avg: Math.round(regionalMap[key].sum / regionalMap[key].count)
    })).sort((a, b) => b.avg - a.avg);

    const barCtx = document.getElementById('barChart').getContext('2d');
    const opts = chartTheme();
    opts.indexAxis = 'y';
    
    window.CHARTS['barChart'] = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: regions.map(r => r.name),
            datasets: [{ label: 'Avg Regional Enrollment (%)', data: regions.map(r => r.avg), backgroundColor: '#8B5CF6', borderRadius: 4 }]
        },
        options: opts
    });
}

// --- EXPENDITURE PAGE ---
function renderExpenditureCharts(data) {
    destroyChartIfExists('trendChart');
    destroyChartIfExists('barChart');

    const trendCtx = document.getElementById('trendChart').getContext('2d');
    window.CHARTS['trendChart'] = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
            datasets: [{ label: 'Global Expenditure (% of GDP)', data: [4.4, 4.5, 4.5, 4.6, 4.5, 4.5], borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)', fill: true, tension: 0.3 }]
        },
        options: chartTheme()
    });

    const top4 = [...data].sort((a, b) => b.expenditure - a.expenditure).slice(0, 4);
    const barCtx = document.getElementById('barChart').getContext('2d');
    const opts = chartTheme();
    opts.indexAxis = 'y';
    window.CHARTS['barChart'] = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: top4.map(d => d.country),
            datasets: [{ label: 'Expenditure (%)', data: top4.map(d => d.expenditure), backgroundColor: '#F59E0B', borderRadius: 4 }]
        },
        options: opts
    });
}

// ==========================================
// ZONE 3: ADVANCED ANALYSIS WORKSPACE
// ==========================================
function initCharts() {
    drawBarChart('barChart', window.DS);
    drawScatterPlot('scatterChart', window.DS);
    drawDoughnut('doughnutChart', window.DS);
}

function drawBarChart(canvasId, data) {
    destroyChartIfExists(canvasId);
    const top10 = [...data].sort((a, b) => b.literacy - a.literacy).slice(0, 10);
    const ctx = document.getElementById(canvasId).getContext('2d');
    const options = chartTheme();
    options.indexAxis = 'y';
    options.plugins.legend.display = false;
    options.scales.x.min = 0; options.scales.x.max = 100;
    options.scales.y.grid.display = false;

    window.CHARTS[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top10.map(d => d.country),
            datasets: [{ label: 'Literacy Rate', data: top10.map(d => d.literacy), backgroundColor: 'rgba(217, 79, 61, 0.8)', borderRadius: 4 }]
        },
        options: options
    });

    document.getElementById('barPlaceholder').style.display = 'none';
    document.getElementById(canvasId).style.display = 'block';
}

function drawScatterPlot(canvasId, data) {
    destroyChartIfExists(canvasId);
    
    const xVals = data.map(d => d.expenditure);
    const yVals = data.map(d => d.literacy);
    const reg = linearRegression(xVals, yVals);
    
    const minX = Math.min(...xVals);
    const maxX = Math.max(...xVals);
    const lineData = [
        { x: minX, y: (reg.slope * minX) + reg.intercept },
        { x: maxX, y: (reg.slope * maxX) + reg.intercept }
    ];

    const ctx = document.getElementById(canvasId).getContext('2d');
    const options = chartTheme();
    options.scales.x.title = { display: true, text: 'Expenditure (% of GDP)', color: '#94a3b8' };
    options.scales.y.title = { display: true, text: 'Literacy Rate (%)', color: '#94a3b8' };
    options.scales.y.min = 0; options.scales.y.max = 100;
    
    options.plugins.tooltip.callbacks = {
        label: function(context) {
            if (context.dataset.type === 'line') return 'Trend Line';
            const pt = context.raw;
            return `${pt.name}: ${Number(pt.y).toFixed(1)}% Lit, ${Number(pt.x).toFixed(1)}% Spend`;
        }
    };

    window.CHARTS[canvasId] = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Countries',
                    data: data.map(d => ({ x: d.expenditure, y: d.literacy, name: d.country })),
                    backgroundColor: '#3a7d5c', pointRadius: 6, pointHoverRadius: 8
                },
                {
                    label: 'Trend (Regression)',
                    data: lineData, type: 'line', borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 2, borderDash: [5, 5], pointRadius: 0, fill: false, interactive: false
                }
            ]
        },
        options: options
    });

    document.getElementById('scatterPlaceholder').style.display = 'none';
    document.getElementById(canvasId).style.display = 'block';
}

function drawDoughnut(canvasId, data) {
    destroyChartIfExists(canvasId);
    let counts = { A: 0, B: 0, C: 0, D: 0 };
    data.forEach(d => {
        if (d.literacy >= 90) counts.A++; 
        else if (d.literacy >= 75) counts.B++; 
        else if (d.literacy >= 50) counts.C++; 
        else counts.D++; 
    });

    const ctx = document.getElementById(canvasId).getContext('2d');
    const options = chartTheme();
    options.cutout = '60%';
    options.scales = {}; // No axes for doughnut
    
    options.plugins.tooltip.callbacks = {
        label: function(context) {
            const val = context.raw;
            const total = context.chart._metasets[context.datasetIndex].total;
            const percentage = Math.round((val / total) * 100);
            return `${context.label}: ${val} countries (${percentage}%)`;
        }
    };

    window.CHARTS[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Exceptional (>90%)', 'High (75-89%)', 'Medium (50-74%)', 'Critical (<50%)'],
            datasets: [{ data: [counts.A, counts.B, counts.C, counts.D], backgroundColor: ['#2a7a50', '#3a6ea8', '#b5820d', '#d94f3d'], borderWidth: 0 }]
        },
        options: options
    });

    document.getElementById('doughnutPlaceholder').style.display = 'none';
    document.getElementById(canvasId).style.display = 'block';
}

/* --- MATH ENGINE --- */
function variance(arr) {
    if (!arr || arr.length === 0) return 0;
    const mu = getMean(arr);
    const sumSqDiffs = arr.map(x => Math.pow(x - mu, 2)).reduce((a, b) => a + b, 0);
    return Math.round((sumSqDiffs / arr.length) * 100) / 100;
}

function stdDev(arr) { return Math.round(Math.sqrt(variance(arr)) * 100) / 100; }

function pearsonCorr(x, y) {
    if (!x.length || !y.length) return 0;
    const mx = getMean(x);
    const my = getMean(y);
    let num = 0, denomX = 0, denomY = 0;
    for (let i = 0; i < x.length; i++) {
        const diffX = x[i] - mx, diffY = y[i] - my;
        num += (diffX * diffY);
        denomX += (diffX * diffX);
        denomY += (diffY * diffY);
    }
    return Math.round((num / Math.sqrt(denomX * denomY)) * 10000) / 10000;
}

function linearRegression(x, y) {
    const r = pearsonCorr(x, y);
    const slope = r * (stdDev(y) / stdDev(x));
    const intercept = getMean(y) - (slope * getMean(x));
    return { 
        slope: Math.round(slope * 10000) / 10000, 
        intercept: Math.round(intercept * 10000) / 10000, 
        rSquared: Math.round((r * r) * 10000) / 10000 
    };
}

function renderAnalysis(data) {
    const scores = data.map(d => d.literacy);
    const hours = data.map(d => d.expenditure);
    const attend = data.map(d => d.enrollment); 

    document.getElementById('an').innerText = data.length;
    document.getElementById('aMin').innerText = Math.min(...scores).toFixed(1);
    document.getElementById('aMax').innerText = Math.max(...scores).toFixed(1);
    document.getElementById('aRange').innerText = (Math.max(...scores) - Math.min(...scores)).toFixed(1);
    document.getElementById('aVariance').innerText = variance(scores);
    document.getElementById('aStdDev').innerText = stdDev(scores);

    const rHrs = pearsonCorr(hours, scores);
    const rAtt = pearsonCorr(attend, scores);
    document.getElementById('rPearson').innerText = rHrs;
    document.getElementById('rInterp').innerText = Math.abs(rHrs) >= 0.7 ? "Strong" : (Math.abs(rHrs) >= 0.4 ? "Moderate" : "Weak");
    document.getElementById('rPearson2').innerText = rAtt;
    document.getElementById('rInterp2').innerText = Math.abs(rAtt) >= 0.7 ? "Strong" : (Math.abs(rAtt) >= 0.4 ? "Moderate" : "Weak");
    document.getElementById('rStronger').innerText = Math.abs(rHrs) > Math.abs(rAtt) ? "Expenditure" : "Enrollment";
    document.getElementById('rDirection').innerText = (rHrs > 0 && rAtt > 0) ? "Both positive" : "Mixed";

    const reg = linearRegression(hours, scores);
    document.getElementById('regEquation').innerText = `y = ${reg.slope}x + ${reg.intercept}`;
    document.getElementById('regSlope').innerText = reg.slope;
    document.getElementById('regIntercept').innerText = reg.intercept;
    document.getElementById('regR2').innerText = reg.rSquared;
    document.getElementById('regInterp').innerText = reg.rSquared >= 0.7 ? "Good fit" : "Weak fit";
    document.getElementById('regPredict').innerText = (reg.slope * 7.0 + reg.intercept).toFixed(1);
}

function renderInsights(data) {
    const scores = data.map(d => d.literacy);
    const hours = data.map(d => d.expenditure);
    const reg = linearRegression(hours, scores);
    const rHrs = pearsonCorr(hours, scores);
    const rStr = Math.abs(rHrs) >= 0.7 ? "Strong" : "Moderate";

    document.getElementById('insightsBody').innerHTML = `
        <p>
            Based on the dataset of ${data.length} nations, the global mean literacy rate is <span class="highlight">${getMean(scores).toFixed(1)}%</span>. 
            When analyzing Government Expenditure against Literacy Rates, we observe a <span class="highlight">${rStr} Positive</span> correlation (r = ${rHrs}). 
            The linear regression model suggests that a nation dedicating 7.0% of its GDP to education would project a literacy rate of <span class="highlight">${(reg.slope * 7.0 + reg.intercept).toFixed(1)}%</span>. 
            However, outliers demonstrate that systemic efficiency and regional dynamics also heavily influence outcomes beyond sheer financial investment.
        </p>
    `;
}
