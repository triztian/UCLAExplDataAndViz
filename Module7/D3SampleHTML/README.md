# D3 Sample Project

## Overview

This sample visualization uses the Zoom Stock data that was obtained in
`Module 2`.

It's a HTML page that is rendered using python [Jinja2](https://jinja.palletsprojects.com/en/2.11.x/) 
templates to read the CSV data and generate the HTML table with the data. 

> NOTE: The data is included in the `data/` directory.

Then using D3.js the HTML table is parsed and the data extracted into JavaScript
for transformation and plotting.

The page uses [Material Design Lite](https://getmdl.io/index.html) to provide 
basic style and formatting. 

All of the CSS and JS sources are embedded in the HTML file, meaning it's a self 
contained visualization; no need for a network connection to serve any JS/CSS
assets.

### Generating the HTML

At the root of the project there is `Makefile` simply run the following command
to clean and create the `D3SampleHTML.html` file:

```
make clean build
```

The python script that generates the page can be run independently like so:

```
python3 ./generate.py index.html data/zm_01-10_04-09.csv > D3SampleHTML.html
```

The file can be then easily opend by any Safari, Chrome or Firefox

```
# opens the default browser
open ./D3SampleHTML.html
```

### D3 Resources

  * [Simple Line Chart](https://www.d3-graph-gallery.com/graph/line_cursor.html)
  * [Multiline Chart](https://bl.ocks.org/LemoNode/a9dc1a454fdc80ff2a738a9990935e9d)
  * [Working with Time](http://learnjsdata.com/time.html)