const DATA = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";

const margin = { top: 40, right: 10, bottom: 10, left: 10 },
  width = 1260 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom,
  color = d3.scaleOrdinal().range(d3.schemeDark2);

const treemap = d3.treemap().size([width, height]);

const tooltip = d3.select("body").append("div").attr("class", "tooltip").attr("id", "tooltip").style("opacity", 0);

const div = d3
  .select("#chartContainer")
  .append("div")
  .style("position", "relative")
  .style("width", width + margin.left + margin.right + "px")
  .style("height", height + margin.top + margin.bottom + "px")
  .style("left", margin.left + "px")
  .style("top", margin.top + "px");

d3.json(DATA, (error, data) => {
  if (error) throw error;

  const root = d3.hierarchy(data, (d) => d.children).sum((d) => d.value);

  const tree = treemap.paddingInner(3)(root);

  // Helper functions
  function formatDollars(strNum) {
    return Number(strNum).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
  }

  const mouseover = (d) => {
    tooltip.style("opacity", 0.9);
    tooltip
      .html(
        "Name: <strong>" +
          d.data.name +
          "</strong><br>" +
          "Category: <strong>" +
          d.data.category +
          "</strong><br>" +
          "Value: <strong>" +
          formatDollars(d.data.value) +
          "</strong>"
      )
      .attr("data-value", d.data.value)
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY - 95 + "px");
  };

  const mouseout = (d) => {
    tooltip.style("opacity", 0);
  };

  div
    .datum(root)
    .selectAll(".tile")
    .data(tree.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .style("left", (d) => d.x0 + "px")
    .style("top", (d) => d.y0 + "px")
    .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
    .style("height", (d) => Math.max(0, d.y1 - d.y0 - 1) + "px")
    .style("background", (d) => color(d.parent.data.name))
    .attr("fill", (d) => color(d.data.category))
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .text((d) => d.data.name)
    .on("mousemove", mouseover)
    .on("mouseout", mouseout);

  // ===========================================================================
  // // Legend
  // ===========================================================================
  // get categories
  const categories = root
    .leaves()
    .map((leaf) => leaf.data.category)
    .filter((category, i, arr) => arr.indexOf(category) === i);

  var size = 20;

  const legend = d3.select("#chartContainer").append("svg").attr("x", 10).attr("y", 10).attr("id", "legend");

  legend
    .selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", 100)
    .attr("y", (d, i) => 50 + i * (size + 5))
    .attr("width", size)
    .attr("height", size)
    .style("fill", (d) => color(d));

  legend
    .selectAll("text")
    .data(categories)
    .enter()
    .append("text")
    .attr("x", 100 + size * 1.2)
    .attr("y", (d, i) => 50 + i * (size + 5) + size / 2)
    .style("fill", (d) => color(d))
    .text((d) => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
});
