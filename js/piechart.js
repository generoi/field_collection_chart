/*jshint newcap:false, loopfunc:true, expr:true */
(function($) {
  Drupal.fieldCollectionChart = Drupal.fieldCollectionChart || {};

  Drupal.fieldCollectionChart.piechart = function(el, options) {
    return new Piechart(el, options);
  };

  var Piechart = function(el, options) {
    this.r = window.Raphael(el);
    this.radius = +options.radius;
    this.cx = +options.cx || this.radius;
    this.cy = +options.cy || this.radius;
    this.values = options.values;
    this.descriptions = options.descriptions;
    this.legendmark_default_size = 5;
    var scale = +options.scale || 1.1
      , legendmark_scale = +options.legendmark_scale || 1
      , legendmark_hover_size = this.legendmark_default_size * legendmark_scale
      , descriptions_display = options.descriptions_display
      , descriptions_selector = options.descriptions_selector;

    // Only keep piecharts own options.
    delete options.cx;
    delete options.cy;
    delete options.radius;
    delete options.values;
    delete options.descriptions;
    delete options.scale;
    delete options.legendmark_scale;
    delete options.type;
    delete options.descriptions_display;
    delete options.descriptions_selector;

    var pie = this.pie = this.r.piechart(this.cx, this.cy, this.radius, this.values, options);
    // our custom mixins requires these.
    pie.values = this.values;
    pie.descriptions = this.descriptions;
    // Mixin our own piechart methods.
    pie.hoverLabel = $.proxy(hoverLabel, pie);
    pie.clickLabel = $.proxy(clickLabel, pie);
    pie.eachIndex = $.proxy(eachIndex, pie);

    // Functions to toggle scaling of sector and legendmark
    var mouseover =  curryish(this.mouseover, this, [scale, legendmark_hover_size])
      , mouseout = curryish(this.mouseout, this);

    pie.hover(mouseover, mouseout);
    pie.hoverLabel(mouseover, mouseout);

    var that = this
      , fin = curryish(this.showDescription, this, [descriptions_selector])
      , fout = curryish(this.hideDescription, this, [descriptions_selector]);

    // Display descriptions on either click or hover
    switch (descriptions_display) {
      case 'click':
        pie.eachIndex(function(idx) {
          var sector = pie.series[idx]
            , cover = pie.covers[idx]
            , label = pie.labels && pie.labels[idx]
            , description = pie.descriptions[idx]
            , o = this;

          cover.click(function() { fin.call(o, description); });
          if (label) {
            label.click(function() { fin.call(o, description); });
          }
        });
        break;
      case 'hover':
        pie.eachIndex(function(idx) {
          var sector = pie.series[idx]
            , cover = pie.covers[idx]
            , label = pie.labels && pie.labels[idx]
            , description = pie.descriptions[idx]
            , o = this;

          cover
            .mouseover(function() { fin.call(o, description); })
            .mouseout(function() { fout.call(o); });

          if (label) {
            label
              .mouseover(function() { fin.call(o, description); })
              .mouseout(function() { fout.call(o); });
          }
        });
        break;
    }
  };

  function curryish(fn, scope, args) {
    return function() {
      fn.apply(scope, [this].concat(Array.prototype.slice.call(arguments), args || []));
    };
  }

  Piechart.prototype.showDescription = function (ctx, description, selector) {
    $(selector).html(description);
  };
  Piechart.prototype.hideDescription = function (ctx, selector) {
    // Keep the last description by default.
  };

  Piechart.prototype.mouseover = function(ctx, scale, legendmark_size) {
    ctx.sector.stop();
    ctx.sector.transform('s' + [scale, scale, this.cx, this.cy].join(' '));
    if (ctx.label) {
      ctx.label[0].stop();
      if (legendmark_size) ctx.label[0].attr({ r: legendmark_size });
    }
  };

  Piechart.prototype.mouseout = function(ctx) {
    ctx.sector.animate({ transform: 's1 1 ' + ctx.cx + ' ' + ctx.cy  }, 100, "linear");
    if (ctx.label) {
      ctx.label[0].stop();
      ctx.label[0].animate({ r: this.legendmark_default_size }, 100, "linear");
    }
  };

  var eachIndex = function (f) {
    var that = this;
    for (var i = 0; i < this.values.length; i++) {
      (function (sector, cover, j) {
        var o = {
          sector: sector,
          cover: cover,
          cx: that.cx,
          cy: that.cy,
          mx: sector.middle.x,
          my: sector.middle.y,
          mangle: sector.mangle,
          r: that.r,
          value: that.values[j],
          total: that.total,
          label: that.labels && that.labels[j]
        };
        f.call(o, j);
      }(this.series[i], this.covers[i], i));
    }
    return this;
  };

  var hoverLabel = function (fin, fout) {
    fout = fout || function () {};
    var that = this;
    for (var i = 0; i < this.values.length; i++) {
      (function (sector, cover, j) {
        var o = {
          sector: sector,
          cover: cover,
          cx: that.cx,
          cy: that.cy,
          mx: sector.middle.x,
          my: sector.middle.y,
          mangle: sector.mangle,
          r: that.r,
          value: that.values[j],
          total: that.total,
          label: that.labels && that.labels[j]
        };
        that.labels && that.labels[j] && that.labels[j].mouseover(function () {
          fin.call(o);
        }).mouseout(function () {
          fout.call(o);
        });
      }(this.series[i], this.covers[i], i));
    }
    return this;
  };

  var clickLabel = function (f) {
    var that = this;
    for (var i = 0; i < this.values.length; i++) {
      (function (sector, cover, j) {
        var o = {
          sector: sector,
          cover: cover,
          cx: that.cx,
          cy: that.cy,
          mx: sector.middle.x,
          my: sector.middle.y,
          mangle: sector.mangle,
          r: that.r,
          value: that.values[j],
          total: that.total,
          label: that.labels && that.labels[j]
        };
        that.labels && that.labels[j] && that.labels[j].click(function () {
          f.call(o);
        });
      }(this.series[i], this.covers[i], i));
    }
    return this;
  };

  // Expose the piechart so others can override it.
  Drupal.fieldCollectionChart.Piechart = Piechart;
}(jQuery));
