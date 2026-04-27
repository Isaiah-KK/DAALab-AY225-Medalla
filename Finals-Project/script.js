document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. Line Chart: Historical Trends
    // ==========================================
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
            datasets: [
                {
                    label: 'Global Average',
                    data: [82, 83, 84, 85, 86, 86.5],
                    borderColor: '#10B981', // Green
                    backgroundColor: '#10B981',
                    borderWidth: 3,
                    tension: 0.3, // Adds a slight curve to the line
                    pointRadius: 4
                },
                {
                    label: 'South Asia',
                    data: [71, 72, 73, 74.5, 75, 76],
                    borderColor: '#3B82F6', // Blue
                    backgroundColor: '#3B82F6',
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: 'Sub-Saharan Africa',
                    data: [64, 65, 65.5, 66, 67, 67.5],
                    borderColor: '#F59E0B', // Amber
                    backgroundColor: '#F59E0B',
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 8 }
                }
            },
            scales: {
                y: {
                    min: 50,
                    max: 100,
                    grid: { color: '#E5E7EB', drawBorder: false },
                    ticks: { color: '#6B7280' }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#6B7280' }
                }
            }
        }
    });

    // ==========================================
    // 2. Horizontal Bar Chart: Gov Expenditure
    // ==========================================
    const barCtx = document.getElementById('barChart').getContext('2d');

    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Norway', 'Costa Rica', 'South Africa', 'United States', 'India'],
            datasets: [{
                label: '% of GDP',
                data: [7.9, 7.4, 6.2, 4.9, 3.5],
                backgroundColor: '#6366F1', // Indigo
                borderRadius: 4, // Rounded corners on the bars
                barThickness: 20
            }]
        },
        options: {
            indexAxis: 'y', // This changes it from a vertical to horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false } // Hide legend since there's only one dataset
            },
            scales: {
                x: {
                    grid: { color: '#E5E7EB', drawBorder: false },
                    ticks: { color: '#6B7280' }
                },
                y: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#4B5563', font: { weight: '500' } }
                }
            }
        }
    });
});