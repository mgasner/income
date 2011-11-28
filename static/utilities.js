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

function pass () {
  return;
}

_.mixin({ make_gensym: make_gensym,
          pass: pass});

_.gensym = make_gensym("income");

// functions for drawing on svg canvases
function draw_line (ctx, x1, y1, x2, y2, col) {
  var id = _.gensym();
  var x = ctx.append("svg:line")
             .attr("x1", x1)
             .attr("y1", y1)
             .attr("x2", x2)
             .attr("y2", y2)
             .attr("id", id)
             .style("stroke-width", "1.5px");
  if (! _.isUndefined(col)) {
    x.style("stroke", col);
  }
  return id;
}

function dashed_line (ctx, x1, y1, x2, y2, dl) {
  var id = draw_line(ctx, x1, y1, x2, y2);
  ctx.select("#" + id)
     .style("stroke-dasharray", dl);
  return id;
}

// functions for formatting numbers
// thieved from the internet
function add_commas(nStr) {
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

// takes a number in thousands and returns an English representation
// in millions or thousands
function pretty_print_thousands (val) {
  if ((val / 1000) > 1) {
    return ((val / 1000).toFixed(1) + " million");
  } else { 
    return val + " thousand";
  }
}

// returns the english ordinal postfix
function ordinal (num) {
  num = num.toString();
  var last = num.slice(num.length - 1);
  if (num.length > 1) {
    var penult = num.slice(num.length - 2)[0];
  }
  if (last === "1" && penult !== "1") {
    return "st";
  } else if (last === "2" && penult !== "1") {
    return "nd";
  } else if (last === "3" && penult !== "1") {
    return "rd";
  } else {
  return "th";
  }
}

// expects objects {x, y[, size, col, id, text]}
function draw_text (ctx, specs) {
  if (! _.isArray(specs)) {
    var spec = specs;
    specs = new Array();
    specs[0] = spec;
  }

  var ids = [];
  for (i in specs) {
    var spec = specs[i];
    var id;
    
    if (spec.hasOwnProperty("id")) {
      id = spec.id;
    } else {
      id = gensym();
    }
    ids[i] = id;
    var x = ctx.append("svg:text")
               .attr("x", spec.x)
               .attr("y", spec.y)
               .attr("id", id);
    if (spec.hasOwnProperty("text")) {
      x.text(spec.text);
    }
    if (spec.hasOwnProperty("size")) {
      x.style("font-size", spec.size);
    }
    if (spec.hasOwnProperty("col")) {
      x.attr("fill", spec.col);
    }
  }
  return ids;
}

// convenience functions for removing elements from an svg canvas; wrap d3 functionality
function remove_all (ctx, selector) {
  ctx.selectAll(selector)
     .remove();
}

function remove_elts (ctx, ids) {
  if (_.isArray(ids)) {
    _.each(ids, function (id) {
      remove_elts(ctx, id);
    })
  } else {
    ctx.select("#" + ids).remove();
  }
  return ids;
}

// takes an array of lower breaks, an array of upper breaks, and an array of counts
function make_histogram (lower, upper, counts) {
  var hist = [];
  for (var i = 0, len = counts.length; i < len; i++) {
    hist.push({
      low: lower[i],
      high: upper[i],
      n: counts[i]
    });
  }
  return hist;
}

// takes a canvas, a histogram (array of {low, high, n}), an x scale, a y scale, an optional id, an optional mousover function, an optional mouseout function, and an optional padding for the bottom of the canvas
// parametrize this function to plot the background or not; also to show mouseover or not; the mouseover functions should 
function plot_histogram (ctx, hist, x, y, id, padding_bottom, fg, bg) {
  var plot, minbin, item;
  
  minbin = _.min(_.map(hist, function (d) { return d.high - d.low; }));
  padding_bottom = padding_bottom || 0;

  if (! _.isUndefined(id)) {
    plot = ctx.selectAll(id);
  } else {
    plot = ctx.selectAll("svg:rect");
    id = _.gensym();
  }
  
  if (! _.isUndefined(bg)) {
    plot.data(hist)
       .enter().append("svg:rect")
       .attr("x", function(d) { return x(d.low); })
       .attr("y", 0)
       .attr("width", function (d) { return x(d.high) - x(d.low); })
       .attr("height", ctx.attr("height") - padding_bottom)
       .attr("class", "bg")
       .style("fill", bg.fill)
       .style("stroke", bg.stroke)
       .on("mouseover", bg.over)
       .on("mouseout", bg.out)
  }

  plot.data(hist)
      .enter().append("svg:rect")
      .attr("x", function (d) { return x(d.low); })
      .attr("y", function (d) { return ctx.attr("height") - padding_bottom - y(d.n) * minbin /
                                        (d.high - d.low); })
      .attr("width", function (d) { return x(d.high) - x(d.low); })
      .attr("height", function (d) { return y(d.n) * minbin / (d.high - d.low); })
      .attr("class", id)
      .on("mouseover", fg.over)
      .on("mouseout", fg.out);

  return id;
} 

function draw_ticks (ctx, ticks, labels) {
  ctx.selectAll("line")
      .data(_.initial(ticks))
      .enter().append("svg:line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", 497)
      .attr("y2", 505);
  if (! _.isUndefined(labels)) {
    ctx.selectAll("text")
       .data(ticks)
       .enter().append("svg:text")
       .attr("x", x)
       .text(function (d, i) {return labels[i];})
       .attr("y", 520);
  }
}
// expects a data object with an array of percentiles and a comparator
function get_percentile (datum, data, by, max) {
  for (var i in data.percentiles) {
    if (datum < data[by][i]) {
      return data["percentiles"][i];
    }
  }
  return max;
}
