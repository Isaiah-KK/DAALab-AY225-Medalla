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