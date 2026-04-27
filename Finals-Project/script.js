// Variable to store the loaded data so the export button can access it
let currentDataset = []; 

document.addEventListener('DOMContentLoaded', () => {
    // Initialize empty charts
    const trendChart = initTrendChart();
    const barChart = initBarChart();

    // Trigger the data fetch
    loadAndProcessData('EdStatsData.csv', trendChart, barChart);
    
    // Setup the Export Button
    setupExportButton();
});

// ==========================================
// Data Fetching & Processing Logic
// ==========================================
function loadAndProcessData(dataSource, trendChart, barChart) {
    // Check if Papa is defined
    if (typeof Papa === 'undefined') {
        console.error("PapaParse library is missing from the HTML!");
        alert("Error: PapaParse library is not loaded.");
        return;
    }

    Papa.parse(dataSource, {
        download: true, 
        header: true,   
        dynamicTyping: true, 
        complete: function(results) {
            console.log("CSV loaded successfully!", results);
            
            // Save the data globally for the export function
            currentDataset = results.data;
            
            const newLabels = ['2015', '2016', '2017', '2018', '2019', '2020']; 
            const newTrendData = [80, 81, 83, 85, 86, 88]; 
            
            updateChartData(trendChart, newLabels, [{
                label: 'Global Average (Dynamic)',
                data: newTrendData,
                borderColor: '#10B981',
                backgroundColor: '#10B981',
            }]);
        },
        error: function(error) {
            console.error("Error loading CSV:", error);
            alert("Could not load data. Are you running this through Live Server?");
        }
    });
}

function updateChartData(chartInstance, newLabels, newDatasets) {
    chartInstance.data.labels = newLabels;
    chartInstance.data.datasets = newDatasets;
    chartInstance.update(); 
}

// ==========================================
// Export CSV Logic
// ==========================================
function setupExportButton() {
    const exportBtn = document.getElementById('exportBtn');
    
    if (!exportBtn) {
        console.error("Could not find the button with id='exportBtn'");
        return;
    }

    exportBtn.addEventListener('click', () => {
        if (!currentDataset || currentDataset.length === 0) {
            alert("No data available to export yet. Please wait for it to load.");
            return;
        }

        const csvString = Papa.unparse(currentDataset);
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", "EdStats_Exported_Data.csv"); 
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// ==========================================
// Chart Initialization Functions
// ==========================================
function initTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] }, 
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
                y: { min: 0, max: 100, grid: { color: '#E5E7EB' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function initBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: { labels: [], datasets: [] }, 
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: '#E5E7EB' } },
                y: { grid: { display: false } }
            }
        }
    });
}