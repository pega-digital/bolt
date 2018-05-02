<?php

namespace Bolt\Layout;

use \Drupal\Core\Template\Attribute;
use \PatternLab\PatternEngine\Twig\TwigUtil;


  // Default attributes and inheritted data all grid components inherit (ex. base CSS class)
$GLOBALS['grid_attributes'] = array('class' => array('o-bolt-grid'));
// Crude way to track which instance of the component is being referenced so each component's unique data is encapsulated and merged together properly without bleeding over.
$GLOBALS['counter'] = 0;
// Expose the D8 and Pattern Lab "create_attribute" function in case this custom Twig Tag gets loaded before the create_attribute Twig extension exists.

class GridTagNode extends \Twig_Node {

  public function __construct($params, $lineno = 0, $tag = null){
    parent::__construct(array ('params' => $params), array (), $lineno, $tag);
  }

  // Loop through any non-string data paramaters passed into the component
  static public function displayRecursiveResults($arrayObject) {
    foreach($arrayObject as $key=>$value) {
      // Handle attributes objects a little differently so we can merge this directly with the inheritted attrs
      if(is_array($value) && $key == 'attributes') {
        $GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ] = array_merge_recursive($GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ], $value);
      } elseif (is_array($value)) {
        $GLOBALS['grid_props'][ $GLOBALS['counter'] ][$key] = $value;
      } elseif(is_object($value)) {
        $GLOBALS['grid_props'][ $GLOBALS['counter'] ][$key] = $value;
      } else {
          $GLOBALS['grid_props'][ $GLOBALS['counter'] ] = array_merge_recursive($GLOBALS['grid_props'][ $GLOBALS['counter'] ], array($key => $value));
      }
    }
  }


  static public function functionToCall(){
     $params = func_get_args();
     $contents = array_shift($params);
    // If paramaters exist for this particular component instance, merge everything together
    if ($params){
      $new_grid_attributes = array("class" => array("")); // Store inline strings
      $GLOBALS['counter'] = $GLOBALS['counter'] + 1; //Track the current grid instance
      $GLOBALS['grid_props'][ $GLOBALS['counter'] ] = array(); //Store misc data that isn't attributes
      $GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ] = array(); // Store custom attributes passed in


      // Handle legacy way of handling data via a simple string on the component (ex. {% grid 'u-1/1' %} )
      foreach ($params as $key => $value){
        if (gettype($value) == 'string') {
          $classes = explode(" ", $value);
          $new_grid_attributes = array_merge_recursive(array("class" => $classes), $new_grid_attributes);
        } elseif (gettype($value) == 'array') {
          self::displayRecursiveResults($value);
        } else {
          // Catch all for everything else.
        }
      }
    }
    // Do any custom attributes already exist? If not, set an empty array so it can get merged (below)
    if (!isset($GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ])) {
      $GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ] = array();
    }
    // After capturing and merging in all string + array parameters on the component instance, take the unique set of data and merge it with the defaults
    $GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ] = array_merge_recursive($GLOBALS['grid_attributes'], $GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ]);
    // Handle instances where no vanilla string parameters (not in an array) are directly added to a component
    if (isset($new_grid_attributes)){
      $merged_attributes = array_merge_recursive($GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ], $new_grid_attributes);
    } elseif (isset($GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ])) {
      $merged_attributes = $GLOBALS['grid_attributes_custom'][ $GLOBALS['counter'] ];
    } else {
      $merged_attributes = array();
    }
    // Finally, handle instances where literally zero data or props got passed into the component
    if (!isset($GLOBALS['grid_props'][ $GLOBALS['counter'] ])){
      $GLOBALS['grid_props'][ $GLOBALS['counter'] ] = array();
    }
    // Run the captured attributes through D8's createAttribute function, prior to rendering
    $attributes = new Attribute($merged_attributes);

    if (class_exists('\PatternLab\Template')) {
      $stringLoader = \PatternLab\Template::getStringLoader();
    } else {
      $stringLoader = new BoltStringLoader();
    }
    //Setup data into 2 groups: attributes + everything else that we're going to namespace under the component name.
    $data         = array(
      "attributes" => $attributes,
      "grid" => $GLOBALS['grid_props'][ $GLOBALS['counter'] ]
    );
    //@TODO: pull in template logic used here from external Twig file.
    $string       = "
      {% set classes = [
        grid.size ? 'o-grid--' ~ grid.size : '',
        grid.center ? 'o-grid--center' : '',
        grid.reverse == 'true' ? 'o-grid--rev' : ''
      ] %}

      {% set gridTag = grid.tag ? grid.tag : 'div' %}

      <{{ gridTag }} {{ attributes.addClass(classes) | raw }}>
        $contents
      </{{ gridTag }}>
    ";
    // Pre-render the inline Twig template + the data we've merged and normalized
    $rendered = $stringLoader->render(array("string" => $string, "data" => $data));
    echo $rendered, PHP_EOL;
  }

  public function compile(\Twig_Compiler $compiler) {
    $count = count($this->getNode('params'));
    $compiler->addDebugInfo($this);

    for ($i = 0; ($i < $count); $i++){
      // argument is not an expression (such as, a \Twig_Node_Textbody)
      // we should trick with output buffering to get a valid argument to pass
      // to the functionToCall() function.
      if (!($this->getNode('params')->getNode($i) instanceof \Twig_Node_Expression)){
        $compiler->write('ob_start();')->raw(PHP_EOL);
        $compiler->subcompile($this->getNode('params')->getNode($i));
        $compiler->write('$_mytag[] = ob_get_clean();')->raw(PHP_EOL);
      } else {
        $compiler
            ->write('$_mytag[] = ')
            ->subcompile($this->getNode('params')->getNode($i))
            ->raw(';')
            ->raw(PHP_EOL);
      }
    }

      $compiler
         ->write('call_user_func_array(')
         ->string(__NAMESPACE__ . '\GridTagNode::functionToCall')
         ->raw(', $_mytag);')
         ->raw(PHP_EOL);

      $compiler->write('unset($_mytag);')->raw(PHP_EOL);
   }
}
