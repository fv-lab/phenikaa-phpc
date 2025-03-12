const API_URL = "https://render-ebdk.onrender.com/metrics";
let cpuChart;

async function fetchMetrics() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data || !data.data || !data.data.result) {
            console.error("Invalid data format:", data);
            return;
        }

        // 📌 Step 1: Organize Data by CPU Cores
        let cpuData = {};
        data.data.result.forEach(entry => {
            const cpu = entry.metric.cpu;
            const mode = entry.metric.mode;
            const value = parseFloat(entry.value[1]); // Convert to number

            if (!cpuData[cpu]) {
                cpuData[cpu] = {};
            }
            cpuData[cpu][mode] = value;
        });

        // 📌 Step 2: Prepare Data for Chart.js
        const cpuLabels = Object.keys(cpuData).sort((a, b) => a - b);
        const modes = ["user", "system", "idle", "iowait", "irq", "softirq", "steal", "nice"];
        let datasets = modes.map(mode => ({
            label: mode,
            data: cpuLabels.map(cpu => cpuData[cpu][mode] || 0), // Fill missing modes with 0
            borderWidth: 1,
            backgroundColor: getColor(mode), // Dynamic colors
        }));

        updateChart(cpuLabels, datasets);
    } catch (error) {
        console.error("Failed to fetch metrics:", error);
    }
}

// 📌 Step 3: Function to Update Chart
function updateChart(labels, datasets) {
    if (!cpuChart) {
        const ctx = document.getElementById("metricsChart").getContext("2d");
        cpuChart = new Chart(ctx, {
            type: "bar", // Use Bar Chart for clear visualization
            data: { labels, datasets },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } else {
        cpuChart.data.labels = labels;
        cpuChart.data.datasets = datasets;
        cpuChart.update();
    }
}

// 📌 Step 4: Assign Colors to CPU Modes
function getColor(mode) {
    const colors = {
        user: "rgba(255, 99, 132, 0.6)",
        system: "rgba(54, 162, 235, 0.6)",
        idle: "rgba(75, 192, 192, 0.6)",
        iowait: "rgba(255, 206, 86, 0.6)",
        irq: "rgba(153, 102, 255, 0.6)",
        softirq: "rgba(255, 159, 64, 0.6)",
        steal: "rgba(201, 203, 207, 0.6)",
        nice: "rgba(50, 205, 50, 0.6)"
    };
    return colors[mode] || "rgba(128, 128, 128, 0.6)"; // Default color
}

// 📌 Step 5: Auto-Refresh Every 5s
setInterval(fetchMetrics, 5000);
document.addEventListener("DOMContentLoaded", fetchMetrics);