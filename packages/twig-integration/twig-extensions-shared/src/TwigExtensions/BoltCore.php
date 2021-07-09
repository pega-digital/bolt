<?php

namespace Bolt\TwigExtensions;

use BasaltInc\TwigTools;
use Bolt;
use \Webmozart\PathUtil\Path; // https://github.com/webmozart/path-util
use Twig\Extension\InitRuntimeInterface;
use Twig\Extension\GlobalsInterface;
use Twig\Extension\AbstractExtension;

require_once 'Faker.php';

class BoltCore extends AbstractExtension implements InitRuntimeInterface, GlobalsInterface {

  public $data = [];
  public $version;

  function __construct() {
    try {
      $composer_json = json_decode(file_get_contents(Path::join(__DIR__, '../../composer.json')), true);
      $this->version = $composer_json['version'];
    } catch(\Exception $e) {
      // do nothing if this fails
    }
  }

  function initRuntime(\Twig\Environment $env) {
    try {
      $fullManifestPath = TwigTools\Utils::resolveTwigPath($env, '@bolt-data/full-manifest.bolt.json');
      $dataDir = dirname($fullManifestPath);
      $this->data = Bolt\Utils::buildBoltData($dataDir);
    } catch (\Exception $e) {

    }
  }

  public function getGlobals() {
    return [
      'bolt' => [
        'data' => $this->data,
        'faker' => new Bolt\TwigExtensions\TwigFaker(),
      ],
      'enable_json_schema_validation' => true,
    ];
  }

  public function getFunctions() {
    return [
      TwigTools\TwigFunctions::get_data(),
      TwigTools\TwigFunctions::validate_data_schema(),
      Bolt\TwigFunctions::init(),
      Bolt\TwigFunctions::publicpath(),
      Bolt\TwigFunctions::base64(),
      Bolt\TwigFunctions::bgcolor(),
      Bolt\TwigFunctions::ratio(),
      Bolt\TwigFunctions::getBoltData(),
      Bolt\TwigFunctions::getImageData(),
      Bolt\TwigFunctions::fileExists(),
      Bolt\TwigFunctions::inlineFile(),
      Bolt\TwigFunctions::gcd(),
    ];
  }

  public function getFilters() {
    return [
      Bolt\TwigFilters::json_decode(),
    ];
  }

  public function getTokenParsers() {
    return [
      Bolt\TwigTags::grid_tag(),
      Bolt\TwigTags::cell_tag()
    ];
  }
}
