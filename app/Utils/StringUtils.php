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

  public static function separateName($fullName)
  {
    // Split the string at the comma and trim any extra whitespace
    $parts = explode(',', $fullName);

    // Assign the last name and first name, trim spaces for each part
    $last_name = trim($parts[0]);
    $first_name = "";
    if (count($parts) > 1) {
      $first_name = trim($parts[1]);
    }

    // Return an associative array
    return [
      'first_name' => $first_name,
      'last_name' => $last_name
    ];
  }
}
