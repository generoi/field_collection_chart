(function($) {
  Drupal.behaviors.fieldCollectionChart = {
    attach: function(context) {
      var settings = Drupal.settings.fieldCollectionChart || {};
      if (settings.charts) {
        for (var chart in settings.charts) if (settings.charts.hasOwnProperty(chart)) {
          var options = settings.charts[chart];
          Drupal.fieldCollectionChart[options.type](chart, options);
        }
      }
    }
  };
  Drupal.fieldCollectionChart = Drupal.fieldCollectionChart || {};
}(jQuery));
