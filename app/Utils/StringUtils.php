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
    // Trim any extra spaces
    $fullName = trim($fullName);

    // Split the full name by spaces
    $nameParts = explode(' ', $fullName);

    // Handle cases where the name has only one part
    if (count($nameParts) == 1) {
      return [
        'first_name' => $nameParts[0],
        'last_name' => ''
      ];
    }

    // Get the first name and last name
    $firstName = array_shift($nameParts);
    $lastName = implode(' ', $nameParts); // Join the remaining parts as last name

    return [
      'first_name' => $firstName,
      'last_name' => $lastName
    ];
  }
}
