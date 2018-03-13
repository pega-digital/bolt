<?php
declare(strict_types=1);

namespace Bolt;

use PHPUnit\Framework\TestCase;
use Webmozart\PathUtil\Path;
use Bolt;

class ImagesTests extends TestCase {

  public function setUp() {
    // Doing this so colors will actually get calculated
    putenv('NODE_ENV=production');
  }

  public function testGetImageData() {
    $sets = [
      [
        'file' => 'assets/500x500.jpg',
        'height'=> 500,
        'width'=> 500,
        'color' => '#3d3e45',
        'base64' => 'data:image/jpeg;base64',
      ],
      [
        'file' => 'assets/732x945.jpg',
        'height'=> 945,
        'width'=> 732,
        'color' => '#999999',
        'base64' => 'data:image/jpeg;base64',
      ],
      [
        'file' => 'assets/tout-4x3-climber.jpg',
        'height'=> 480,
        'width'=> 640,
        'color' => '#8d847c',
        'base64' => 'data:image/jpeg;base64',
      ],
      [
        'file' => 'assets/decision-hub-chart.png',
        'height'=> 2300,
        'width'=> 2712,
        'color' => '#12181e',
        'base64' => 'data:image/jpeg;base64',
      ],
      [
        'file' => 'assets/logo-paypal.svg',
        'height'=> 33,
        'width'=> 124,
        'color' => 'hsl(233, 33%, 97%)',
        'base64' => 'data:image/gif;base64',
      ],
    ];

    foreach ($sets as $set) {
      $results = Images::get_image_data($set['file'], __DIR__);
      $this->assertEquals($set['height'], $results['height'], 'height of image');
      $this->assertEquals($set['width'], $results['width'], 'width of image');
      $this->assertStringStartsWith($set['base64'], $results['base64']);
      $this->assertTrue(self::compareColors($set['color'], $results['color'], 0.005),
        "The color value calculated for {$set['file']} did not match the expected value.");
    }
  }

  /**
   * Returns true if the two colors are within the given precision
   * @param $colorOne string hex color in the form of either `#xxxxxx` or `hsl(123, xx%, xx%)`
   * @param $colorTwo string hex color in the form of either `#xxxxxx` or `hsl(123, xx%, xx%)`
   * @param $percision float acceptable percent difference between the two numbers to return true.
   * @return bool
   */
  private static function compareColors($colorOne, $colorTwo, $precision) {
    $colorOneValue = hexdec($colorOne);
    $colorTwoValue = hexdec($colorTwo);

    return abs(($colorOneValue-$colorTwoValue)/$colorOneValue) < $precision;
  }
}
