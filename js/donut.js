// =======================
// DONUT CHART
// Energy Consumption by Screen Technology (All TVs)
// =======================

const donutWidth = 400, donutHeight = 400, donutMargin = 40;
const donutRadius = Math.min(donutWidth, donutHeight) / 2 - donutMargin;

// Create a container for the chart and legend
const donutChartContainer = d3.select("#donut-chart")
  .style("display", "flex")
  .style("flexDirection", "column")
  .style("alignItems", "center");

const donutSvg = donutChartContainer
  .append("svg")
    .attr("viewBox", `0 0 ${donutWidth} ${donutHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
    .attr("transform", `translate(${donutWidth / 2},${donutHeight / 2})`);

// Legend container (below chart)
const legendContainer = donutChartContainer
  .append("div")
  .attr("class", "donut-legend")
  .style("marginTop", "20px")
  .style("display", "flex")
  .style("justifyContent", "center");

// Load data
// CSV columns: Screen_Tech, Mean(Labelled energy consumption (kWh/year))
d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
  // Prepare data
  const chartData = {};
  let total = 0;
  data.forEach(d => {
    chartData[d.Screen_Tech] = +d["Mean(Labelled energy consumption (kWh/year))"];
    total += +d["Mean(Labelled energy consumption (kWh/year))"];
  });

  // Color scale
  const color = d3.scaleOrdinal()
    .domain(Object.keys(chartData))
    .range(d3.schemeCategory10);

  // Pie generator
  const pie = d3.pie()
    .value(d => d[1]);

  const data_ready = pie(Object.entries(chartData));

  // Arc generator
  const arc = d3.arc()
    .innerRadius(donutRadius * 0.6)
    .outerRadius(donutRadius);

  // Draw arcs
  donutSvg.selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data[0]))
      .attr('stroke', '#fff')
      .style('stroke-width', '2px')
      .style('opacity', 0.85);

  // Add labels: Technology only
  donutSvg.selectAll('text')
    .data(data_ready)
    .enter()
    .append('text')
      .text(d => d.data[0])
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '15px')
      .style('fill', '#222');

  // Tooltip
  const tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('background', 'white')
    .style('padding', '6px 12px')
    .style('border', '1px solid #ccc')
    .style('border-radius', '6px')
    .style('visibility', 'hidden');

  donutSvg.selectAll('path')
    .on('mouseover', (event, d) => {
      tooltip.html(
        `<b>${d.data[0]}</b><br>${d.data[1].toFixed(1)} kWh/year<br>${((d.data[1]/total)*100).toFixed(1)}% of total`
      )
      .style('visibility', 'visible');
    })
    .on('mousemove', event => {
      tooltip
        .style('top', (event.pageY - 20) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('visibility', 'hidden'));

  // Legend
  legendContainer.selectAll('div')
    .data(data_ready)
    .enter()
    .append('div')
      .style('display', 'flex')
      .style('alignItems', 'center')
      .style('marginRight', '20px')
      .html(d => `
        <span style="display:inline-block;width:16px;height:16px;background:${color(d.data[0])};margin-right:8px;border-radius:3px;"></span>
        <span>${d.data[0]}: ${d.data[1].toFixed(1)} kWh/year (${((d.data[1]/total)*100).toFixed(1)}%)</span>
      `);
});
