<?php

class IndexController extends Zend_Controller_Action
{
    public function indexAction(){

        $pubKey='6Lf4b8MSAAAAAAzbWpkjwFCNErpl6QQGB_tQYwRT';
        $privKey='6Lf4b8MSAAAAAN_vMk4fuWAo_D6pcIz-fZ0gKyEs';
        $recaptcha = new Zend_Service_ReCaptcha($pubKey, $privKey);

        $this->view->recaptcha = $recaptcha;
    }
}

