async function fetchMetrics() {
    const response = await fetch("https://render-ebdk.onrender.com/metrics");
    const data = await response.json();
    let html = "<h2>Real-Time Prometheus Metrics</h2><table border='1'><tr><th>Metric</th><th>Value</th></tr>";
    data.data.result.forEach(entry => {
        html += `<tr><td>${entry.metric.__name__}</td><td>${entry.value[1]}</td></tr>`;
    });
    html += "</table>";
    document.getElementById("metrics").innerHTML = html;
}
setInterval(fetchMetrics, 5000); // Refresh every 5 seconds