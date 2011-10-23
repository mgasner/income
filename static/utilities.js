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

// use _.extend to add these to the d3 object

// functions for drawing on svg canvases
function draw_line (ctx, x1, y1, x2, y2, col) {
    var id = gensym();
    var x = ctx.append("svg:line")
               .attr("x1", x1)
               .attr("y1", y1)
               .attr("x2", x2)
               .attr("y2", y2)
               .attr("id", id);
    if (! _.isUndefined(col)) {
      x.attr("stroke", col);
    }
    return id;
}

function dashed_line (ctx, x1, y1, x2, y2, dx1, dy1, dx2, dy2) {
  var ix = 0;
  var iy = 0;
  var ids = [];
  var ctr = 0;
  while ((x1 + ix <= x2) && (y1 + iy <= y2)) {
    ids[ctr] = draw_line(ctx, x1 + ix, y1 + iy, x1 + ix + dx1, y1 + iy + dy1);
    ix = ix + dx1 + dx2;
    iy = iy + dy1 + dy2;
    ctr = ctr + 1;
  }
  return ids;
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

// expects an array specs of spec objects {x, y[, size, col, id, text]}
function draw_text (ctx, specs) {
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

function draw_rollover_text (val) {
  remove_all(chart, "text");
  draw_tick_labels();
  draw_text(chart, rollover_text);
  chart.select("#nhouseholds")
       .text(add_commas(val.n));
  //     .text(pretty_print_thousands(val.n));
  chart.select("#lowerbound")
  //     .text("$" + add_commas(val.low * 1000));
       .text("$" + add_commas(val.low));
  chart.select("#upperbound")
  //     .text("$" + add_commas(val.high * 1000));
       .text("$" + add_commas(val.high));
}

// takes a canvas, a histogram (array of {low, high, n}), an x scale, a y scale, an optional id, an optional mousover function, an optional mouseout function, and an optional padding for the bottom of the canvas

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

// parametrize this function to plot the background or not; also to show mouseover or not; the mouseover functions should 
function plot_histogram (ctx, hist, x, y, id, over, out, padding_bottom) {
  var plot;
  
  var minbin = _.min(_.map(hist, function (d) { return d.high - d.low; }));
  if (! _.isUndefined(id)) {
    plot = ctx.selectAll(id);
  } else {
    plot = ctx.selectAll("svg:rect");
    id = gensym();
  }
  
  if (_.isUndefined(padding_bottom)) {
    padding_bottom = 0;
  }
  
  plot.data(hist)
      .enter().append("svg:rect")
      .attr("x", function (d) { return x(d.low); })
      .attr("y", function (d) { return ctx.attr("height") - padding_bottom - y(d.n) * minbin / (d.high - d.low); })
      .attr("width", function (d) { return x(d.high) - x(d.low); })
      .attr("height", function (d) { return y(d.n) * minbin / (d.high - d.low); })
      .attr("class", id)
      .on("mouseover", function (d, i) {
        if (! _.isUndefined(over)) {
          var item = d3.select(d3.selectAll(".bg")[0][i]);
          over(d, i, item);
        }
      })
      .on("mouseout", function (d, i) {
        if (! _.isUndefined(out)) {
          var item = d3.select(d3.selectAll(".bg")[0][i]);
          out(d, i, item);
        }
      });
  return id;
}
