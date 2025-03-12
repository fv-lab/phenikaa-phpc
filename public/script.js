// 🎯 Chart.js Setup
const ctx = document.getElementById("metricsChart").getContext("2d");
const metricsChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "CPU Usage",
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.2)",
            data: [],
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});

// 🎯 Function to Fetch Metrics from API
async function fetchMetrics() {
    try {
        const response = await fetch("https://render-ebdk.onrender.com/metrics");
        const data = await response.json();
        return data.data.result; // ✅ Return the data instead of modifying UI
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return null;
    }
}

// 🎯 Function to Update the Chart
function updateChart(metricsData) {
    if (!metricsData) return; // Skip if there's an error
    
    let time = new Date().toLocaleTimeString();
    let value = parseFloat(metricsData[0].value[1]); // Adjust as needed

    // ✅ Update the chart
    metricsChart.data.labels.push(time);
    metricsChart.data.datasets[0].data.push(value);

    if (metricsChart.data.labels.length > 20) { // Keep only recent 20 points
        metricsChart.data.labels.shift();
        metricsChart.data.datasets[0].data.shift();
    }

    metricsChart.update();
}

// 🎯 Main function to Fetch & Update Chart
async function fetchAndUpdate() {
    const metricsData = await fetchMetrics();
    updateChart(metricsData);
}

// 🎯 Auto-update every 5 seconds
setInterval(fetchAndUpdate, 5000);
document.addEventListener("DOMContentLoaded", fetchAndUpdate);
