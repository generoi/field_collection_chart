(function($) {
  Drupal.behaviors.graphaelChart = {
    attach: function(context) {
      var settings = Drupal.settings.graphaelChart || {};
      if (settings.charts) {
        var delayed = [];
        for (var chart in settings.charts) if (settings.charts.hasOwnProperty(chart)) {
          var options = settings.charts[chart];
          // Only initialize a chart once.
          if (!options.type) continue;

          if ($('#' + chart).not(':visible')) {
            delayed.push(chart);
            continue;
          }
          Drupal.graphaelChart[options.type](chart, options);
        }

        if (delayed.length) {
          $(document).on('opened.fndtn.section', Drupal.graphaelChart.reflow);
          $(window).one('resize.fndtn.section', Drupal.graphaelChart.reflow);
          window.setTimeout(function() {
            $(window).trigger('resize');
          }, 500);
        }
      }
    }
  };
  Drupal.graphaelChart = Drupal.graphaelChart || {};

  Drupal.graphaelChart.reflow = function () {
    var settings = Drupal.settings.graphaelChart || {};
    for (var chart in settings.charts) if (settings.charts.hasOwnProperty(chart)) {
      var options = settings.charts[chart];

      if (!options.type) continue;
      if ($('#' + chart).is(':visible')) {
        Drupal.graphaelChart[options.type](chart, options);
      }
    }
  };
}(jQuery));
