(function() {
	// Executed after DOMContentLoaded has fired
	// Line charts based on the following example
	// https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91

	let entries = loadDataFromTable()

	createPricesChart(entries)
	createAveragesChart(entries)

	console.log('Row Data', entries)
})();

/**
 * Loads the data from the HTML table. The page only has 1 HTML table
 * 
 * @see{https://github.com/d3/d3-selection}
 * @see{https://www.d3indepth.com/selections/}
 */
function loadDataFromTable() {
	let rowData = []
	d3.select("table")
		.select('tbody')
		.selectAll('tr')
		.each(function() {
			let row = []
			d3.select(this).selectAll('td').each(function (p, j) {
				if (j === 0) {
					row.push(Date.parse(d3.select(this).text()))
				} else {
					row.push(parseFloat(d3.select(this).text()))
				}
			})

			rowData.push(row)
		})

	return rowData
}

/**
 * @param {*} entries 
 */
function createPricesChart(entries) {
	let svg = d3.select("#price-chart .chart")
	let svgContainer = d3.select(svg.node().parentNode)
	let containerBBox = svgContainer.node().getBoundingClientRect()

	svg.attr("width", containerBBox.width)
	svg.attr("height", containerBBox.height)

	let	margin = { top: 20, right: 20, bottom: 5, left: 20 },
		width = containerBBox.width - margin.left - margin.right,
		height = containerBBox.height - margin.top - margin.bottom;
	
	console.log('SVG Prices', svg)

	// X-Axis
	let x = d3.scaleTime()
		.domain(d3.extent(entries, d => d[0]))
		.rangeRound([margin.left, width - margin.right])
	svg.append('g')
		.attr('class', 'x-axis')
		.attr('transform', `translate(0, ${(height - margin.bottom)})`)
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m/%d")));

	// Y-Axis
	let y = d3.scaleLinear()
		.domain(d3.extent(allPrices(entries)))
		.rangeRound([height, 0])
	svg.append('g')
		.attr('class', 'y-axis')
		.attr("transform", `translate(${margin.left}, 0)`)
		.call(d3.axisLeft(y));

	let colors = d3.scaleOrdinal(d3.schemeCategory10);

	let groups = [
		{ name: 'Open', color: colors(0), data: e => [e[0], e[1]] },
		{ name: 'High', color: colors(1), data: e => [e[0], e[2]] },
		{ name: 'Low', color: colors(2), data: e => [e[0], e[3]] }
	]

	groups.forEach(g => {
		createLine(svg, margin, entries, 
			{color: g.color, name: g.name}, {x, y, data: g.data})
	})

	// Create the legends for the lines. These have to be created separately
	// and as a group in order to calculate the spacing correctly.
	createLegends(svg, {
		width: width, height: height, margin: margin
	}, groups.map(g => {return {color: g.color, name: g.name}}))
}

/**
 * Creates a line in the plot.
 */
function createLine(svgSelection, margin, entries, legend, plotter) {
	let data = entries.map(plotter.data)
	svgSelection.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", legend.color)
		.attr("stroke-width", 1.2)
		.attr("transform", `translate(0, ${-margin.bottom})`)
		.attr("d", d3.line()
			.x(d => plotter.x(d[0]) )
			.y(d => plotter.y(d[1]) )
		)
}

/**
 * Creates a list of lengends on the top-right corner of the plot.
 */
function createLegends(svgSelection, container, plotters) {
	const radius = 5, legendHeight = radius * 2.5

	plotters.forEach((plt, i) => {
		let circleCenterX = container.width - container.margin.right - radius
		let circleCenterY = container.margin.top + radius +
			i * legendHeight - legendHeight / 2

		let legend = svgSelection.append('g')
		legend.append('circle')
			.attr('cx', circleCenterX)
			.attr('cy', circleCenterY)
			.attr('r', radius)
			.style('fill', plt.color)

		legend.append('text')
			.attr('x', circleCenterX + radius + 4)
			.attr('y', circleCenterY)
			.attr("text-anchor", "left")
			.attr("font-size", '9')
			.attr("alignment-baseline", "middle")
			.text(plt.name)
	})
}

/**
 * Obtains all of the prices for open, high, low, close and adjusted close.
 */
function allPrices(entries) {
	return entries
		.map(r => r.slice(1, r.length - 1)) // Remove Date and Volume columns
		.reduce((a, c) => a.concat(c), [])  // flatten all of the prices 
}