<?php

/**
 * Output a wrapper div for the chart and add the JS settings and libraries 
 * required.
 */
function theme_field_collection_chart_pie($variables) {
  if ($variables['percentage']) {
    $remainder = 100 - array_sum($variables['options']['values']);
    $variables['options']['values'][] = $remainder;
    $variables['options']['legend'][] = $variables['remainder_label'];
    $variables['options']['descriptions'][] = $variables['remainder_description'];
  }
  if (!empty($variables['options']['colors'])) {
    $variables['options']['colors'] = explode(' ', $variables['options']['colors']);
  }
  if (!empty($variables['append_part_size'])) {
    foreach ($variables['options']['legend'] as $idx => $legend) {
      $variables['options']['legend'][$idx] .= ' ' . $variables['options']['values'][$idx] . ($variables['percentage'] ? '%' : '');
    }
  }
  drupal_add_library('field_collection_chart', 'piechart');
  drupal_add_js(array('fieldCollectionChart' => array(
    'charts' => array(
      $variables['id'] => $variables['options'] + array('type' => $variables['type']),
    ),
  )), 'setting');

  return '<div ' . drupal_attributes($variables['attributes']) . '></div>';
}

/**
 * Implements template_preprocess_HOOK().
 */
function template_preprocess_field_collection_chart_pie(&$variables) {
  $variables['attributes'] = array(
    'id' => $variables['id'],
    'class' => array('field-collection-chart', 'field-collection-chart-pie'),
  );
  $variables['type'] = 'piechart';
}
