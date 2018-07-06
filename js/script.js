/* global d3 */
(function() {
  'use strict';

  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  d3.json(url).then(function(data) {
    const dataset = data.data;

    const w = 900;
    const h = 500;
    const padding = 50;
    const barWidth = (w - 2 * padding) / dataset.length;

    // scale the data for the axes
    const dataYears = dataset.map(item => item[0].substring(0,4));
    const xScale =
      d3.scaleLinear()
        .domain([d3.min(dataYears), d3.max(dataYears)])
        .range([padding, w - padding]);

    const dataGDP = dataset.map(item => item[1]);
    const yScale =
      d3.scaleLinear()
        .domain([0, d3.max(dataGDP)])
        .range([h - padding, padding]);

    // create svg element and append it to body
    const svg =
      d3.select('body')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    // add bars to the graph
    svg.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => i * barWidth)
      .attr('y', (d) => yScale(d[1]))
      .attr('width', barWidth)
      .attr('height', (d) => h - padding - yScale(d[1]))
      .attr('transform', 'translate(' + padding + ',0)')
      .attr('fill', '#00f')
      .attr('data-date', (d, i) => dataset[i][0])
      .attr('data-gdp', (d, i) => dataset[i][1]);

    // add axis to svg canvas
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .call(xAxis.ticks(15));

    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ',0)')
      .call(yAxis.ticks(10));


  });
}());
