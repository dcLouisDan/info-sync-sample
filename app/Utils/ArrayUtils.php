<?php

namespace App\Utils;

class ArrayUtils
{
  public static function groupObjectArrayByValue($arr, $key)
  {
    $grouped_arr = [];
    foreach ($arr as $item) {
      $field = trim($item[$key]);
      if (!isset($grouped_arr[$field])) {
        $grouped_arr[$field] = [];
      }
      $grouped_arr[$field][] = $item;
    }

    return $grouped_arr;
  }
}
