<?php

/**
 * Output a wrapper div for the chart and add the JS settings and libraries
 * required.
 */
function theme_graphael_chart_piechart($variables) {
  $options = &$variables['options'];
  $values = &$options['values'];
  $legends = &$options['legend'];
  $descriptions = &$options['descriptions'];

  if ($variables['percentage']) {
    $remainder = 100 - array_sum($values);
    // The values dont add up to 100%, distribute it amongst labels without a
    // value
    if ($remainder > 0) {
      $value_count = count($values);
      $empty_count = $value_count - count(array_filter($values));

      // Hide values which are empty.
      if ($variables['hide_empty_value']) {
        foreach ($values as $idx => $value) {
          if (empty($value)) {
            array_splice($values, $idx, 1);
            array_splice($descriptions, $idx, 1);
            array_splice($legends, $idx, 1);
          }
        }

        $values[] = (string) $remainder;
        $legends[] = t('Others');
        $descriptions[] = '';
      }
      // Distribute the remainder amongst the labels without a value.
      else if ($empty_count > 0) {
        $remainder_part = $remainder / $empty_count;
        foreach ($values as $idx => $value) {
          if (empty($value)) {
            $values[$idx] = (string) $remainder_part;
          }
        }
      }
      // The percentage doesnt add up and there are no empty values, add an
      // Others segment.
      else {
        $values[] = (string) $remainder;
        $legends[] = t('Others');
        $descriptions[] = '';
      }
    }
  }
  if (!empty($options['colors'])) {
    $options['colors'] = explode(' ', $options['colors']);
  }
  if (!empty($variables['append_part_size'])) {
    foreach ($legends as $idx => $legend) {
      $value = $values[$idx];
      if ($value <= $variables['minimum_part_size']) {
        continue;
      }
      $legends[$idx] .= ' ' . $value . ($variables['percentage'] ? '%' : '');
    }
  }
  drupal_add_library('graphael_chart', 'piechart');
  drupal_add_js(array('graphaelChart' => array(
    'charts' => array(
      $variables['id'] => $options + array('type' => $variables['type']),
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
