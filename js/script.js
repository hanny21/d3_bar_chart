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
    const minYear = d3.min(dataset, (d) => d[0]);
    const maxYear = d3.max(dataset, (d) => d[0]);
    const xScale =
      d3.scaleTime()
        .domain([new Date(minYear), new Date(maxYear)])
        .range([padding, w - padding]);

    const yScale =
      d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([h - padding, padding]);

    // create canvas div for svg and tooltip
    d3.select('body')
      .append('div')
      .attr('id', 'canvas')
      .attr('width', w)
      .attr('height', h);
    // create svg element and append it to body
    const svg =
      d3.select('#canvas')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    // add tooltip div
    const tooltip =
      d3.select('#canvas')
        .append('div')
        .attr('id', 'tooltip');

    // add bars to the graph
    svg.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => padding + i * ((w - 2 * padding) / dataset.length))
      .attr('y', (d) => yScale(d[1]))
      .attr('width', barWidth)
      .attr('height', (d) => h - padding - yScale(d[1]))
      .attr('fill', '#00f')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .on('mouseover', (d) => {
        tooltip.attr('data-date', d[0])
          .html(showTooltip(d[0], d[1]))
          .style('top',(d3.event.pageY - 80) + 'px')
          .style('left', (d3.event.pageX) + 'px')
          .style('visibility', 'visible');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    function showTooltip(date, value) {
      const year = date.substring(0,4);
      const month = date.substring(5,7);
      let quarter;
      switch(month) {
      case '01': quarter = 'Q1'; break;
      case '04': quarter = 'Q2'; break;
      case '07': quarter = 'Q3'; break;
      case '10': quarter = 'Q4'; break;
      }
      const gdp = Math.round((value/1000) * 100) / 100;
      return year + ' ' + quarter + '<br/> ' + gdp + ' billions';
    }

    // add axis to svg canvas
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ',0)')
      .call(yAxis);
    svg.append('text')
      .attr('id', 'text')
      .attr('y', 10)
      .attr('x', 10)
      .attr('dy', '1em')
      .style('text-anchor', 'start')
      .text('GDP in billions USD');
  });
}());
