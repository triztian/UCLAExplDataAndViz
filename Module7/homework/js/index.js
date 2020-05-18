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
		.each(function () {
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

	let	margin = { top: 15, right: 35, bottom: 15, left: 35 },
		width = containerBBox.width - margin.left - margin.right,
		height = containerBBox.height - margin.top - margin.bottom;
	
	svg.attr("width", containerBBox.width)
	svg.attr("height", containerBBox.height)

	console.log('SVG Prices', svg)

	let x = d3.scaleTime()
		.domain(d3.extent(entries, d => d[0]))
		.rangeRound([margin.left, width - margin.right])

	let y = d3.scaleLinear()
		.domain(d3.extent(allPrices(entries)))
		.rangeRound([height, 0])

	let z = d3.scaleOrdinal(d3.schemeCategory10);

	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + (height - margin.bottom) + ")")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %y")));

	svg.append("g")
		.attr("class", "y-axis")
		.attr("transform", "translate(" + margin.left + ",0)");

	let dataHigh = entries.map((e) => {
		return [e[0], e[1]]
	})

	// Add the line
	svg.append("path")
		.datum(dataHigh)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 1.2)
		.attr("d", d3.line()
			.x(function(d) { return x(d[0]) })
			.y(function(d) { return y(d[1]) })
		)
}

function createAveragesChart(entries) {

}

function allPrices(entries) {
	return entries.map(r => r.slice(1, r.length - 1)).reduce((a, c) => {
		return a.concat(c)
	}, [])
}