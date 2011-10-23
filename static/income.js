// FIXME gosh there's a lot to do here. let's use the Google Closure tools for build and optimization. need a Makefile. etc.

// functions to calculate percentile

// FIXME right now this is dependent on the income scale and needs to be refactored
function draw_income_line (income) {
  var income = income / 1000;
  if (income < _.max(all_tax_units)) {
    draw_line(chart, x(income), 0, x(income), 500);
  } else {
    return 0;
  }
}

function get_percentile (income, taxunit) {
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
var histdata = make_histogram(lower_break, upper_break, number_of_units);

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

plot_histogram(chart, histdata, x, y, "fg", function (d, i, item) { item.style("fill", "#c7c7c7"); draw_rollover_text(d); }, function (d, i, item) { item.style("fill", "#cccccc"); }, padding_bottom);
        
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

