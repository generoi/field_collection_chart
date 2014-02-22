<?php

/**
 * Output a wrapper div for the chart and add the JS settings and libraries 
 * required.
 */
function theme_graphael_chart_piechart($variables) {
  $values = &$variables['options']['values'];

  if ($variables['percentage']) {
    $remainder = 100 - array_sum($values);
    $value_count = count($values);
    $empty_count = $value_count - count(array_filter($values));
    if ($empty_count > 0) {
      // Distribute the remainder amongst the labels without a value.
      $remainder_part = $remainder / $empty_count;
      foreach ($values as $idx => $value) {
        if (empty($value)) {
          $values[$idx] = (string) $remainder_part;
        }
      }
    }

  }
  if (!empty($variables['options']['colors'])) {
    $variables['options']['colors'] = explode(' ', $variables['options']['colors']);
  }
  if (!empty($variables['append_part_size'])) {
    foreach ($variables['options']['legend'] as $idx => $legend) {
      $value = $values[$idx];
      if ($value <= $variables['minimum_part_size']) {
        continue;
      }
      $variables['options']['legend'][$idx] .= ' ' . $value . ($variables['percentage'] ? '%' : '');
    }
  }
  drupal_add_library('graphael_chart', 'piechart');
  drupal_add_js(array('graphaelChart' => array(
    'charts' => array(
      $variables['id'] => $variables['options'] + array('type' => $variables['type']),
    ),
  )), 'setting');

  return '<div ' . drupal_attributes($variables['attributes']) . '></div>';
}

/**
 * Implements template_preprocess_HOOK().
 */
function template_preprocess_graphael_chart_piechart(&$variables) {
  $variables['attributes'] = array(
    'id' => $variables['id'],
    'class' => array('graphael-chart', 'graphel-chart-piechart'),
  );
  $variables['type'] = 'piechart';
}
