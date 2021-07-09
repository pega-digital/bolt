<?php

namespace Bolt\SSR;

// use \Drupal\Core\Template\Attribute;
use Bolt;
use Bolt\BoltStringLoader;


  // Default attributes and inheritted data all grid components inherit (ex. base CSS class)
// $GLOBALS['grid_attributes'] = array('class' => array('o-bolt-grid'));
// Crude way to track which instance of the component is being referenced so each component's unique data is encapsulated and merged together properly without bleeding over.
// $GLOBALS['counter'] = 0;
// Expose the D8 and Pattern Lab "create_attribute" function in case this custom Twig Tag gets loaded before the create_attribute Twig extension exists.

class SSRTagNode extends \Twig\Node\Node {

  public function __construct($params, $lineno = 0, $tag = null){
    parent::__construct(array ('params' => $params), array (), $lineno, $tag);
  }

  static public function functionToCall(){
    $params = func_get_args();
    $contents = array_shift($params);

    $env = new \Twig_Environment(new \Twig_Loader_Array([]), [
      'debug' => true,
      'autoescape' => false,
    ]);
    $template = $env->createTemplate('{{ contents }}');
    $twig_to_html = $env->render($template, ['contents' => $contents]);

    $rendered_html = \Bolt\TwigFunctions::bolt_ssr($twig_to_html);
    echo $rendered_html, PHP_EOL;
  }

  public function compile(\Twig\Compiler $compiler) {
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
         ->string(__NAMESPACE__ . '\SSRTagNode::functionToCall')
         ->raw(', $_mytag);')
         ->raw(PHP_EOL);

      $compiler->write('unset($_mytag);')->raw(PHP_EOL);
   }
}
