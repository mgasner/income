var gensym, rollover_text
// FIXME gosh there's a lot to do here. let's use the Google Closure tools for build and optimization. need a Makefile. etc.

// FIXME right now this is dependent on the income scale and needs to be refactored
function draw_income_line (income) {
  var income = income / 1000;
  if (income < _.max(income_percentiles.all_tax_units)) {
    draw_line(chart, x(income), 0, x(income), 500, "#cc0000");
  } else {
    return 0;
  }
}

function draw_income_text (income) {
  var percentile = get_percentile(income, income_percentiles, "all_tax_units", "99.9");
  draw_text(chart, get_income_text(income, percentile));
}

function get_income_text (income, percentile) {
 return [
  { x:    _.min([x(income / 1000) + 50, x(1200)]),
    y:    350,
    text: "An income of $" + add_commas(income) + " a year puts you in the "
            + percentile + ordinal(percentile) + " percentile." },
  { x:    _.min([x(income / 1000) + 50, x(1200)]),
    y:    370,
    text: "About " + (_.max(tax_units.num_people) * percentile / 100).toFixed(0) + " million people in the US live in households that earn less money than yours every year." }
 ];
}

function draw_rollover_text (val) {
  remove_all(chart, "text");
  draw_ticks(chart, ticks, labels);
  if (val.high !== _.max(_.map(histdata, function (x) { return x.high; }))) {
    draw_text(chart, rollover_text);
    chart.select("#nhouseholds")
         .text(pretty_print_thousands(val.n));
    chart.select("#lowerbound")
         .text("$" + add_commas(val.low * 1000));
    chart.select("#upperbound")
         .text("$" + add_commas(val.high * 1000));
  } else {
    draw_text(chart, max_rollover_text);
    chart.select("#nhouseholds")
         .text(pretty_print_thousands(val.n));
    chart.select("#lowerbound")
         .text("$" + add_commas(val.low * 1000));
  }
}

// constants
gensym = make_gensym("inc");

rollover_text = [
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

max_rollover_text = [
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
    text: "make more than" },
  { x:    200,
    y:    205,
    size: "18px",
    id:   "lowerbound" },
  { x:    260,
    y:    220,
    text: "a year" }
]

// make chart
var chart_width = 1000;
var chart_height = 550;
var padding_bottom = 50;
var right_offset = 50;
var padding_top = 10;
var lower_breaks = income_data.lower_breaks;
var upper_breaks = income_data.upper_breaks;
var number_of_units = income_data.num_units;
var ticks = income_data.x_ticks_location;
var labels = income_data.x_ticks_print;

chart = d3.select("body")
              .append("svg:svg")
              .attr("class", "chart")
              .attr("width", chart_width)
              .attr("height", chart_height);

// x and y scales for chart
var x = d3.scale.linear()
                .domain([0,d3.max(income_data.upper_breaks)])
                .range([0, chart_width - right_offset]);

var y = d3.scale.linear()
                .domain([0, d3.max(income_data.num_units)])
                .range([padding_top, chart_height - padding_bottom - padding_top]);

var histdata = make_histogram(lower_breaks, upper_breaks, number_of_units);

var bg = {fill: "#cccccc",
          stroke: "#eeeeee",
          over: function (d) {
            d3.select(this).style("fill", "#c7c7c7");
            draw_rollover_text(d);
            redraw();
          },
          out: function () {
            d3.select(this).style("fill", "#cccccc");
          }
	 };

var fg = {over: function (d, i) {
            d3.select(d3.selectAll(".bg")[0][i]).style("fill", "#c7c7c7");
            draw_rollover_text(d);
            redraw();
         },
          out: function (d, i) {
            d3.select(d3.selectAll(".bg")[0][i]).style("fill", "#cccccc");
          }
	 }

function make_chart () {
  // construct the histogram for income distribution from the data 
  
  plot_histogram(chart, histdata, x, y, "income", padding_bottom, fg, bg);

  draw_ticks(chart, ticks, labels)

  dashed_line(chart, 950, 0, 950, 500, "3, 2");
  draw_line(chart, 950, 500, 1000, 500);    
}
