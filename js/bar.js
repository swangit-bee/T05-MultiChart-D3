// =======================
// BAR CHART
// Energy Consumption by Screen Technology (55-inch TVs)
// =======================

const barWidth = 400, barHeight = 400, barMargin = { top: 40, right: 30, bottom: 60, left: 70 };
const barW = barWidth - barMargin.left - barMargin.right;
const barH = barHeight - barMargin.top - barMargin.bottom;

const barSvg = d3.select("#bar-chart")
  .append("svg")
    .attr("viewBox", `0 0 ${barWidth} ${barHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
    .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

// Load data
// CSV columns: Screen_Tech, Mean(Labelled energy consumption (kWh/year))
d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(data => {
  // Prepare data
  data.forEach(d => {
    d.energy = +d["Mean(Labelled energy consumption (kWh/year))"];
  });

  // X scale
  const x = d3.scaleBand()
    .domain(data.map(d => d.Screen_Tech))
    .range([0, barW])
    .padding(0.3);

  // Y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.energy) + 50])
    .range([barH, 0]);

  // Color scale
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.Screen_Tech))
    .range(d3.schemeCategory10);

  // X Axis
  barSvg.append("g")
    .attr("transform", `translate(0,${barH})`)
    .call(d3.axisBottom(x));

  // Y Axis
  barSvg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  barSvg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", d => x(d.Screen_Tech))
      .attr("y", d => y(d.energy))
      .attr("width", x.bandwidth())
      .attr("height", d => barH - y(d.energy))
      .attr("fill", d => color(d.Screen_Tech))
      .style("opacity", 0.85);

  // Labels
  barSvg.append("text")
    .attr("x", barW / 2)
    .attr("y", barH + 45)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Screen Technology");

  barSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -barH / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Energy Consumption (kWh/year)");

  // Tooltip
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "6px 12px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "6px")
    .style("visibility", "hidden");

  barSvg.selectAll("rect")
    .on("mouseover", (event, d) => {
      tooltip.html(
        `<b>${d.Screen_Tech}</b><br>${d.energy.toFixed(1)} kWh/year`
      )
      .style("visibility", "visible");
    })
    .on("mousemove", event => {
      tooltip
        .style("top", (event.pageY - 20) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
});
