// =======================
// SCATTER PLOT
// Energy Consumption vs Star Rating
// =======================

// Chart dimensions
const scatterMargin = { top: 30, right: 30, bottom: 60, left: 70 },
      scatterWidth = 500 - scatterMargin.left - scatterMargin.right,
      scatterHeight = 400 - scatterMargin.top - scatterMargin.bottom;

// Append SVG
const scatterSvg = d3.select("#scatter")
  .append("svg")
    .attr("viewBox", `0 0 ${scatterWidth + scatterMargin.left + scatterMargin.right} ${scatterHeight + scatterMargin.top + scatterMargin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
    .attr("transform", `translate(${scatterMargin.left},${scatterMargin.top})`);

// Load data
d3.csv("data/tv_energy.csv").then(data => {
  // Convert numbers
  data.forEach(d => {
    d.star_rating = +d.star_rating;
    d.energy_consumption = +d.energy_consumption;
  });

  // X scale
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.star_rating) + 1])
    .range([0, scatterWidth]);

  // Y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.energy_consumption) + 50])
    .range([scatterHeight, 0]);

  // Color by screen technology
  const color = d3.scaleOrdinal()
    .domain([...new Set(data.map(d => d.screen_tech))])
    .range(d3.schemeCategory10);

  // X Axis
  scatterSvg.append("g")
    .attr("transform", `translate(0, ${scatterHeight})`)
    .call(d3.axisBottom(x).ticks(5));

  // Y Axis
  scatterSvg.append("g")
    .call(d3.axisLeft(y));

  // Labels
  scatterSvg.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", scatterHeight + 45)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Star Rating");

  scatterSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -scatterHeight / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Energy Consumption (kWh)");

  // Dots
  scatterSvg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.star_rating))
      .attr("cy", d => y(d.energy_consumption))
      .attr("r", 6)
      .style("fill", d => color(d.screen_tech))
      .style("opacity", 0.8);

  // Tooltip
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "5px 10px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "6px")
    .style("visibility", "hidden");

  scatterSvg.selectAll("circle")
    .on("mouseover", (event, d) => {
      tooltip.html(
        `<b>Star:</b> ${d.star_rating}<br>
         <b>Energy:</b> ${d.energy_consumption} kWh<br>
         <b>Tech:</b> ${d.screen_tech}`
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
