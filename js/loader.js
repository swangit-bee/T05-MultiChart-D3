// loader.js
// Loads all chart scripts after DOM is ready

document.addEventListener('DOMContentLoaded', function() {
  // Load scatter plot
  const scatterScript = document.createElement('script');
  scatterScript.src = 'js/scatter.js';
  document.body.appendChild(scatterScript);

  // Load donut chart
  const donutScript = document.createElement('script');
  donutScript.src = 'js/donut.js';
  document.body.appendChild(donutScript);

  // Load bar chart
  const barScript = document.createElement('script');
  barScript.src = 'js/bar.js';
  document.body.appendChild(barScript);

  // Load line chart
  const lineScript = document.createElement('script');
  lineScript.src = 'js/line.js';
  document.body.appendChild(lineScript);
});
