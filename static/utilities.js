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
