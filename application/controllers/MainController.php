<?php

require_once 'Zend/Controller/Action.php';

class MainController extends Zend_Controller_Action {

    public function init()
    {
        //$this->_helper->AjaxContext()->addActionContext('login', 'json')->initContext('json');
        if ($this->getRequest()->isXmlHttpRequest()) {
            //если AJAX - отключаем авторендеринг шаблонов
            Zend_Controller_Action_HelperBroker::removeHelper('viewRenderer');
        }
    }

    public function indexAction() {

        $auth = Zend_Auth::getInstance();
        if ($auth->hasIdentity()) {

            $identity =$auth->getIdentity();

            $this->view->username = $identity;
            $this->render();
        }
        else{
            $this->_redirect('index');
        }
    }
    public function dbAction(){
        $data = $this->_getAllParams();
        $firephp = Zend_registry::get('firephp');

        if ($data != null && $this->_request->isPost())
        {
            $main = new Application_Model_MainClass();
            $auth = Zend_Auth::getInstance();
            $email = $auth->getIdentity();

            $result= $main->makeRequest($data,$email);

            $this->getResponse()->setHeader("Content-type", 'text/plain');
            $this->getResponse()->setBody($result);
        }
    }
    public function profileAction() {

        $auth = Zend_Auth::getInstance();
        if ($auth->hasIdentity()) {
            $identity =$auth->getIdentity();
            $this->view->username = $identity;
            $this->render();
        }
        else{
            $this->_redirect('index');
        }
    }

}

