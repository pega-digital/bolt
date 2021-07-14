<?php

namespace Bolt;

use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use Michelf\MarkdownExtra;
use \Webmozart\PathUtil\Path;
use \Drupal\Core\Template\Attribute;
use \Shudrum\Component\ArrayFinder\ArrayFinder; // https://github.com/Shudrum/ArrayFinder

// https://github.com/nabil1337/case-helper
use CaseHelper\CaseHelperFactory;

class Utils {

  const repoRoot = __DIR__ . '/../../../';

  /**
   * Convert markdown to HTML.
   *
   * @param $string - String of Markdown
   * @return string - HTML from Markdown
   */
  public static function convertMarkdown($string) {
    return MarkdownExtra::defaultTransform($string);
  }

  // Given a relative file path, return the resolved absolute path
  public static function get_absolute_path($relativeFilePath, $baseDir) {// @todo Refactor and tighten - this was put together quickly as it was a final 1.0 launch blocker
    if (self::isRemoteUrl($relativeFilePath)) {
      return $relativeFilePath;
    }
    $absoluteBasePath = Path::makeAbsolute($baseDir, getcwd());

    // If it's a root relative path like `/images/hi.jpg`
    if (substr($relativeFilePath, 0, 1) === '/') {
      $relativeFilePath = ltrim($relativeFilePath, '/');
    }

    $absolutePath = Path::makeAbsolute($relativeFilePath, $absoluteBasePath);
    if (!file_exists(realpath($absolutePath))) {
      throw new \Exception('Cannot get_absolute_path of: ' . $absolutePath . ' Trying to get it from this relativePath: '. $relativeFilePath . ' and using this absoluteBasePath: ' . $absoluteBasePath);
    }
    return $absolutePath;
  }

  /**
   * Try to resolve an optionally-needed Twig path -- good for lazy and async work (esp local dev work).
   *
   * @param {Twig_Environment} $env
   * @param {string} $templateName
   * @return {string} $full_path - Full path to where the Twig file resides
   */
  public static function optionallyResolveTwigPath(\Twig\Environment $env, $templateName) {
    /**
     * @var \Twig_Template $template
     * @url https://twig.symfony.com/api/1.x/Twig_Template.html
     * */
    $template = $env->resolveTemplate($templateName);

    /**
     * @var \Twig_Source $source
     * @url https://twig.symfony.com/api/1.x/Twig_Source.html
     */
    $source = $template->getSourceContext();

    /** @var string $full_path */
    $full_path = $source->getPath();

    if (!file_exists($full_path)) {
      return false;
    }
    return $full_path;
  }

  /**
   * @param \Twig\Environment $env
   * @return mixed
   * @throws \Twig_Error_Runtime
   */
  public static function getData(\Twig\Environment $env) {
    $boltCore = $env->getExtension('Bolt\TwigExtensions\BoltCore');
    $boltData = $boltCore->data;
    return $boltData;
  }

  // Given an absolute file path, return the file's extension info
  public static function get_file_ext($absoluteFilePath) {
    return pathinfo($absoluteFilePath, PATHINFO_EXTENSION);
  }

  /**
   * Dashes to camelCase string converter.
   *
   * @param $string - Takes something like `my-cool-string`
   * @return string - Returns `myCoolString`
   */
  public static function dashesToCamelCase($string) {
    $str = str_replace('-', '', ucwords($string, '-'));
    return lcfirst($str);
  }

  /**
   * Map input case type to CaseHelper reference name.
   *
   * @param string $type - Exact name of a case type
   * @return number - Returns a number that refers to a CaseHelper input type
   */
  protected static function mapInputCaseType($type) {
    $types = [
      'camelcase'          => CaseHelperFactory::INPUT_TYPE_CAMEL_CASE,
      'kebabcase'          => CaseHelperFactory::INPUT_TYPE_KEBAB_CASE,
      'snakecase'          => CaseHelperFactory::INPUT_TYPE_SNAKE_CASE,

      // The following case types are available but not currently in use
      // 'spacecase'          => CaseHelperFactory::INPUT_TYPE_SPACE_CASE,
      // 'pascalcase'         => CaseHelperFactory::INPUT_TYPE_PASCAL_CASE,
      // 'screamingsnakecase' => CaseHelperFactory::INPUT_TYPE_SCREAMING_SNAKE_CASE,
      // 'traincase'          => CaseHelperFactory::INPUT_TYPE_TRAIN_CASE,
    ];

    if (isset($types[$type])) {
      return $types[$type];
    } else {
      return $types['camelcase'];
    }
  }

  /**
   * Get a string's case type, used when converting case type. Note: can only reliably detect snake and kebab case.
   *
   * @param string $string - String to be checked
   * @return string - Returns detected case type name, defaults to camelcase
   */
  public static function getCaseType($string) {
    if (strpos($string, '_')) {
      return "snakecase";
    } elseif (strpos($string, '-')) {
      return "kebabcase";
    } else {
      return "camelcase";
    }
  }

  /**
   * Convert string to snake_case.
   *
   * @param string $string - String to be converted
   * @param string $type - Name of current string format
   * @return string - Returns string formatted in snake_case
   */
  public static function convertToSnakeCase($string, $type) {
    $ch = CaseHelperFactory::make(self::mapInputCaseType($type));
    return $ch->toSnakeCase($string);
  }

  /**
   * Convert string to kebab-case.
   *
   * @param string $string - String to be converted
   * @param string $type - Name of current string format
   * @return string - Returns string formatted in kebab-case
   */
  public static function convertToKebabCase($string, $type) {
    $ch = CaseHelperFactory::make(self::mapInputCaseType($type));
    return $ch->toKebabCase($string);
  }

  /**
   * Get path to file on GitHub.
   *
   * @param string $filePath - Absolute path to a file in repo
   * @return string - URL to file on GitHub
   */
  public static function gitHubUrl($filePath) {
    $relFilePath = Path::makeRelative($filePath, self::repoRoot);
    $repoBranchName = 'master/packages';
    $githubPath = Path::join('https://github.com/boltdesignsystem/bolt/tree/', $repoBranchName, $relFilePath);
    return $githubPath;
  }

  public static function isRemoteUrl($url) {
    if ($url === '' || !is_string($url)) {
      return false;
    }
    if (substr($url, 0, 4) === 'http') {
      return true;
    } elseif (substr($url, 0, 2) === '//') {
      return true;
    }
    return false;
  }

  /**
   * Check that schema "type" does not equal "array" or "object", nor does it contain an array with either of those values.
   *
   * @param string|array $type - The schema "type" value, can be passed as string or array
   * @return boolean - Returns true if "type" is allowed, i.e. no "array" or "object" values
   */
  public static function isAllowedSchemaType($type) {
    if (empty($type)) {
      return FALSE;
    }
    elseif (is_string($type)) {
      if ($type == "array" || $type == "object" || $type == "any") {
        return FALSE;
      }
    }
    elseif (is_array($type)) {
      if (in_array("array", $type) || in_array("object", $type)) {
        return FALSE;
      }
    }

    return TRUE;
  }

  /**
   * Build an array of props by checking Twig "_context" against the schema, only returns top-level schema props. By default prop keys are converted to kebab-case.
   *
   * @param array $items - Twig "_context", all the available template variables
   * @param array $schema - The schema object for a particular component
   * @param boolean $isData - Whether the return value is intended for use in twig logic.
   *    If TRUE, default schema values are included in the returned array and keys are converted to snake_case.
   *    If FALSE, defaults are omitted and keys are left as kebab-case.  The resulting array is ready to use as props on a web component.
   *
   * @return array - An associative array where key is the name of each prop and the value is the prop value.  For example:
   *     [
   *       content     => 'Hello World'
   *       size        => 'xlarge'
   *       full-bleed  => true
   *     ]
   */
  public static function buildPropsArray($items, $schema, $isData = FALSE) {
    $props = isset($items["attributes"]) ? $items["attributes"] : [];

    // Convert props to an attributes object if it's not already one.
    // If it is already an object, clone it so that we don't unintentionally update the original below.
    $props = is_array($props) ? new Attribute($props) : clone $props;

    if (!empty($schema["properties"])) {
      foreach ($schema["properties"] as $propName => $propSchema) {

        // Check if prop is deprecated based on "title" field
        $isDeprecated = isset($propSchema["title"]) && strpos(strtolower($propSchema["title"]), 'deprecated') !== false;

        // Check the prop "type" in the schema and omit it if it is (or might be) an "array" or "object". Omit deprecated props.
        if (isset($propSchema["type"]) && self::isAllowedSchemaType($propSchema["type"]) && !$isDeprecated) {
          $caseType = self::getCaseType($propName);

          if (isset($items[$propName])) {

            // A value for this prop was found in $items.
            $convertedPropName = $isData ? self::convertToSnakeCase($propName, $caseType) : self::convertToKebabCase($propName, $caseType);
            $props[$convertedPropName] = $items[$propName];
          }
          elseif (isset($items["attributes"][$propName])) {

            // No value for this prop was found in $items, but one was defined via attributes.
            if ($isData) {
              $convertedPropName = self::convertToSnakeCase($propName, $caseType);
              $props[$convertedPropName] = $items["attributes"][$propName];
            }
          }
          elseif (isset($propSchema["default"])) {

            // No value for this prop was found in $items or attributes, but a default is defined in the schema.
            if ($isData) {
              $convertedPropName = self::convertToSnakeCase($propName, $caseType);
              $props[$convertedPropName] = $propSchema["default"];
            }
          }
        }
      }
    }

    return $props;
  }

  /**
   * Return greatest common denominator of two numbers
   * https://www.php.net/manual/en/function.gmp-gcd.php#69189
   *
   * @param integer|string $a - First numeric value
   * @param integer|string $b - Second numeric value
   * @return integer - Returns greatest common denominator
   */
  public static function gcd($a, $b) {
    return ($a % $b) ? self::gcd($b, $a % $b) : $b;
  }

  /**
   * @param $dataDir {string} - Path to data directory
   * @return {array} - All json files in data parsed as a single data array
   */
  public static function buildBoltData($dataDir) {
    // Looping through all the files in the data dir, we'll get ones that end in `bolt.json` like `my-stuff.bolt.json`
    // We're building up a big data array that will look like this:
    //  'data' => [
    //    'spacingSizes' => // contents of `spacing-sizes.bolt.json`
    //    'colors' => [
    //      'brand' => // contents of `colors/brand.bolt.json`
    //      'status' => // contents of `colors/status.bolt.json`
    //    ]
    //  ]
    $data = new ArrayFinder();
    $data->changeSeparator('/');
    $items = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dataDir), RecursiveIteratorIterator::SELF_FIRST);
    foreach ($items as $key => $item) {
      if ($item->isFile() && $item->getExtension() === 'json') {
        $fullPath = $item->getPathname();
        // `colors/my-stuff.bolt.json` => `my-stuff.bolt`
        $extensionLessFilename = Path::getFilenameWithoutExtension($fullPath);
        if (Path::hasExtension($extensionLessFilename, 'bolt')) {
          // if file is `colors/my-stuff.bolt.json`, this becomes `myStuff` (which is the key we'll store it's data under)
          $dataKey = self::dashesToCamelCase(Path::getFilenameWithoutExtension($extensionLessFilename, 'bolt'));
          $fileString = file_get_contents($fullPath);
          $fileData = json_decode($fileString, true);
          $relativePath = Path::makeRelative($fullPath, $dataDir);
          // if file is `colors/my-stuff.bolt.json`, this is `colors`, if file is `my-stuff.bolt.json`, this is `.`
          $subDir = dirname($relativePath);
          if ($subDir === '.') {// not nested in sub directory
            $data->set($dataKey, $fileData);
          } else {// nested in sub directory
            $data->set($subDir . '/' . $dataKey, $fileData);
          }
        }
      }
    }
    return $data->get();
  }
}
