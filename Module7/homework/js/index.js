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

	createLine(svg, margin, entries, { color: colors(0), name: 'Open' }, {
		x: x, y: y,
		data: (e) => {
			return [e[0], e[1]]
		}
	})

	createLine(svg, margin, entries, { color: colors(1), name: 'High' }, {
		x: x, y: y,
		data: (e) => { return [e[0], e[2]] }
	})

	createLine(svg, margin, entries, { color: colors(2), name: 'Low' }, {
		x: x, y: y,
		data: (e) => { return [e[0], e[3]] }
	})
}

function createLine(svgSelection, margin, entries, legend, plotter) {
	let data = entries.map(plotter.data)
	svgSelection.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", legend.color)
		.attr("stroke-width", 1.2)
		.attr("transform", `translate(0, ${-margin.bottom})`)
		.attr("d", d3.line()
			.x(function(d) { return plotter.x(d[0]) })
			.y(function(d) { return plotter.y(d[1]) })
		)

}


function allPrices(entries) {
	return entries.map(r => r.slice(1, r.length - 1)).reduce((a, c) => {
		return a.concat(c)
	}, [])
}