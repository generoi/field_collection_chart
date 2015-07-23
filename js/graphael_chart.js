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
          $(window).one('resize.fndtn.section', function() {
            for (var i = 0, l = delayed.length; i < l; i++) {
              var chart = delayed[i]
                , options = settings.charts[chart];

              if (!options.type) continue;
              Drupal.graphaelChart[options.type](chart, options);
            }
          });
        }
      }
    }
  };
  Drupal.graphaelChart = Drupal.graphaelChart || {};
}(jQuery));
