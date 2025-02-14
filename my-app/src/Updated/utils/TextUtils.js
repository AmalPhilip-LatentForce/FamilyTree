export const appendMultilineText = (
  d3element,
  text,
  delimiter = "_",
  css_class = undefined,
  line_sep = 14,
  line_offset = undefined,
  x = 13,
  dominant_baseline = "central"
) => {
  if (!text) return;
  const d3text = d3element
    .append("text")
    .attr("class", css_class)
    .attr("dominant-baseline", dominant_baseline);
  const arr = text.split(delimiter);
  if (!line_offset) {
    line_offset = (-line_sep * (arr.length - 1)) / 2;
  }
  if (arr != undefined) {
    for (let i = 0; i < arr.length; i++) {
      d3text
        .append("tspan")
        .text(arr[i])
        .attr("dy", i == 0 ? line_offset : line_sep)
        .attr("x", x);
    }
  }
};
