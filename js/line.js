// =======================
// LINE CHART
// Spot Power Prices (1998–2024)
// =======================

const lineWidth = 500, lineHeight = 400, lineMargin = { top: 40, right: 30, bottom: 60, left: 70 };
const lineW = lineWidth - lineMargin.left - lineMargin.right;
const lineH = lineHeight - lineMargin.top - lineMargin.bottom;

const lineSvg = d3.select("#line-chart")
  .append("svg")
    .attr("viewBox", `0 0 ${lineWidth} ${lineHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

// Load data
d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(data => {
  // Convert numbers
  data.forEach(d => {
    d.Year = +d.Year;
    d.Average = +d["Average Price (notTas-Snowy)"];
  });

  // X scale
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Year))
    .range([0, lineW]);

  // Y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Average) + 20])
    .range([lineH, 0]);

  // Line generator
  const line = d3.line()
    .x(d => x(d.Year))
    .y(d => y(d.Average));

  // Draw line
  lineSvg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#0074D9")
    .attr("stroke-width", 3)
    .attr("d", line);

  // Axes
  lineSvg.append("g")
    .attr("transform", `translate(0,${lineH})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  lineSvg.append("g")
    .call(d3.axisLeft(y));

  // Labels
  lineSvg.append("text")
    .attr("x", lineW / 2)
    .attr("y", lineH + 45)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Year");

  lineSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -lineH / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Spot Price ($/MWh)");

  // Tooltip
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "6px 12px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "6px")
    .style("visibility", "hidden");

  lineSvg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.Year))
      .attr("cy", d => y(d.Average))
      .attr("r", 4)
      .attr("fill", "#0074D9")
      .style("opacity", 0.8)
      .on("mouseover", (event, d) => {
        tooltip.html(
          `<b>Year:</b> ${d.Year}<br><b>Avg Price:</b> $${d.Average}`
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
