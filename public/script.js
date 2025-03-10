async function fetchMetrics() {
    const response = await fetch("http://10.20.9.200:9090/api/v1/query?query=node_cpu_seconds_total");
    const data = await response.json();
    let html = "<h2>Real-Time Prometheus Metrics</h2><table border='1'><tr><th>Metric</th><th>Value</th></tr>";
    data.data.result.forEach(entry => {
        html += `<tr><td>${entry.metric.__name__}</td><td>${entry.value[1]}</td></tr>`;
    });
    html += "</table>";
    document.getElementById("metrics").innerHTML = html;
}
setInterval(fetchMetrics, 5000); // Refresh every 5 seconds