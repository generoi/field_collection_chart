(function($) {
  Drupal.behaviors.graphaelChart = {
    attach: function(context) {
      var settings = Drupal.settings.graphaelChart || {};
      if (settings.charts) {
        for (var chart in settings.charts) if (settings.charts.hasOwnProperty(chart)) {
          var options = settings.charts[chart];
          // Only initialize a chart once.
          if (!options.type) continue;
          Drupal.graphaelChart[options.type](chart, options);
        }
      }
    }
  };
  Drupal.graphaelChart = Drupal.graphaelChart || {};
}(jQuery));
