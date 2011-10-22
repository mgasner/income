// utility functions
function make_gensym (seed) {
  var counter = 0;
  var gensym = function () {
    var sym = seed + counter;
    counter = counter + 1;
    return seed + counter
  }
  return gensym;
}

function draw_line (ctx, x1, y1, x2, y2) {
    ctx.append("svg:line")
       .attr("x1", x1)
       .attr("y1", y1)
       .attr("x2", x2)
       .attr("y2", y2)
}

function dashed_line (ctx, x1, y1, x2, y2, dx1, dy1, dx2, dy2) {
  var ix = 0
  var iy = 0
  while ((x1 + ix <= x2) && (y1 + iy <= y2)) {
    draw_line(ctx, x1 + ix, y1 + iy, x1 + ix + dx1, y1 + iy + dy1);
    ix = ix + dx1 + dx2;
    iy = iy + dy1 + dy2;
  }
}

function add_commas(nStr) { // thieved from the internet
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function pretty_print_thousands (val) {
  if ((val / 1000) > 1) {
    return ((val / 1000).toFixed(1) + " million");
  } else { 
    return val + " thousand";
  }
}

function draw_text (ctx, specs) {
  for (i in specs) {
    var spec = specs[i];
    var x = ctx.append("svg:text")
               .attr("x", spec.x)
               .attr("y", spec.y);
    if (spec.hasOwnProperty("text")) {
      x.text(spec.text);
    }
    if (spec.hasOwnProperty("size")) {
      x.style("font-size", spec.size);
    }
    if (spec.hasOwnProperty("id")) {
      x.attr("id", spec.id);
    }
    if (spec.hasOwnProperty("col")) {
      x.attr("fill", spec.col);
    }
  }
}

function clear_text (ctx) {
  ctx.selectAll("text")
     .remove();
}

function draw_rollover_text (val) {
  clear_text(chart);
  draw_tick_labels();
  draw_text(chart, rollover_text);
  chart.select("#nhouseholds")
       .text(pretty_print_thousands(val.n));
  chart.select("#lowerbound")
       .text("$" + add_commas(val.low * 1000));
  chart.select("#upperbound")
       .text("$" + add_commas(val.high * 1000));
}

// functions to calculate percentile
function draw_income_line (income) {
  var income = income / 1000;
  if (income < _.max(all_tax_units)) {
    draw_line(chart, x(income), 0, x(income), 500);
  } else {
    return 0;
  }
}

function get_percentile (income) {
  for (i in percentiles) {
    if (income < all_tax_units[i]) {
      return percentiles[i-1];
    }
  }
  return "99.9";
}

// constants
var gensym = make_gensym("inc");

var rollover_text = [
  { x:    150,
    y:    150,
    size: "36px",
    col:  "steelblue",
    id:   "nhouseholds" },
  { x:    300,
    y:    170,
    text: "American households" },
  { x:    270,
    y:    185,
    text: "make between" },
  { x:    200,
    y:    205,
    size: "18px",
    id:   "lowerbound" },
  { x:    260,
    y:    220,
    text: "and" },
  { x:    250,
    y:    240,
    size: "18px",
    id:   "upperbound" },
  { x:    300,
    y:    255,
    text: "a year" }
]

function draw_tick_labels () {
  chart.selectAll("text")
       .data(x_ticks_location)
       .enter().append("svg:text")
       .attr("x", x)
       .text(function (d, i) {return x_ticks_print[i];})
       .attr("y", 520);
}

// make chart
var chart_specs = {
};
var chart_width = 1000;
var chart_height = 550;
var padding_bottom = 50;
var right_offset = 50;
var padding_top = 10;

// hack - fix this - need global vars or a better encapsulation
chart = d3.select("body")
              .append("svg:svg")
              .attr("class", "chart")
              .attr("width", chart_width)
              .attr("height", chart_height);

// x and y scales for chart

var x = d3.scale.linear()
                .domain([0,d3.max(upper_break)])
                .range([0, chart_width - right_offset]);

var y = d3.scale.linear()
                .domain([0, d3.max(number_of_units)])
                .range([padding_top, chart_height - padding_bottom - padding_top]);

function make_chart () {

// construct the histogram for income distribution from the data 
var histdata = [];
for (var i = 0, len = number_of_units.length; i < len; i++) {
  histdata.push({
    low: lower_break[i],
    high: upper_break[i],
    n: number_of_units[i]
  });
}

chart.selectAll(".bg")
     .data(histdata)
     .enter().append("svg:rect")
     .attr("x", function(d) { return x(d.low); })
     .attr("y", 0)
     .attr("width", function (d) { return x(d.high) - x(d.low); })
     .attr("height", chart_height - padding_bottom)
     .attr("class", "bg")
     .style("fill", "#cccccc")
     .style("stroke", "#eeeeee")
     .on("mouseover", function (d) {
        d3.select(this).style("fill", "#c7c7c7");
        draw_rollover_text(d); })
     .on("mouseout", function () {
        d3.select(this).style("fill", "#cccccc")
        });

chart.append("svg:rect")
     .attr("x", 950)
     .attr("y", 0)
     .attr("width", 50)
     .attr("height", chart_height - padding_bottom)
     .style("fill", "#cccccc")
     .style("stroke", "#eeeeee")
     .on("mouseover", function () {
        d3.select(this).style("fill", "#c7c7c7");
        chart.select(".nhouseholds")
             .text("humbug");
        chart.select(".lowerbound")
             .text("$" + add_commas(1000));
        chart.select(".upperbound")
             .text("$" + add_commas(1000));
        })
     .on("mouseout", function () {
        d3.select(this).style("fill", "#cccccc");
     });

chart.selectAll(".fg")
     .data(histdata)
     .enter().append("svg:rect")
     .attr("x", function(d) { return x(d.low); })
     .attr("y", function(d) { return chart_height - padding_bottom - y(d.n) * 10 / (d.high - d.low); })
     .attr("width", function (d) { return x(d.high) - x(d.low); })
     .attr("height", function (d) { return y(d.n) * 10 / (d.high - d.low); })
     .on("mouseover", function (d, i) {
        d3.select(d3.selectAll(".bg")[0][i]).style("fill", "#c7c7c7");
        draw_rollover_text(d); })
     .on("mouseout", function (d, i) {
        d3.select(d3.selectAll(".bg")[0][i]).style("fill", "#cccccc");
        });
        
chart.selectAll("line")
     .data(_.initial(x_ticks_location))
     .enter().append("svg:line")
     .attr("x1", x)
     .attr("x2", x)
     .attr("y1", 497)
     .attr("y2", 505);


dashed_line(chart, 950, 0, 950, 500, 0, 3, 0, 2);
//chart.append("svg:polyline")
//     .attr("points", "950, 490, 955, 495, 950, 500, 955, 505, 950, 510");

draw_line(chart, 950, 500, 1000, 500);
     
     
draw_tick_labels();

d3.select("#percent")
  .on("blur", function () {
      d3.select("#you")
        .html("An income of $" + add_commas(this.value) + " a year puts you in the " + get_percentile(this.value) + "th percentile. About " + (_.max(total_people) * get_percentile(this.value) / 100).toFixed(0) + " million people in the US earn less money than you do every year.");
      draw_income_line(this.value);
    });
    

}

