<?php

namespace App\Utils;

class StringUtils
{
  public static function toCamelCase($string)
  {
    $words = preg_split('/[^a-zA-Z0-9]+/', strtolower($string));
    $camelCase = array_shift($words);
    $camelCase .= implode('', array_map('ucfirst', $words));
    return $camelCase;
  }
}
