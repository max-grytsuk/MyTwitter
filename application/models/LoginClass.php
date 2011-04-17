<?php

class Application_Model_LoginClass
{

    function isValid($email, $pass){

        $auth = Zend_Auth::getInstance();
        $firephp = Zend_registry::get('firephp');

        $application = new Zend_Application(APPLICATION_ENV);
        $bootstrap = $application->getBootstrap();
        $dbAdapter = $bootstrap->getResource('DbAdapter');

        $authAdapter = new Zend_Auth_Adapter_DbTable(
            $dbAdapter,
            'users',
            'email',
            'password'
        );
        $select = $authAdapter->getDbSelect();
        $select->where('activation = 1');

        $authAdapter
                ->setIdentity($email)
                ->setCredential(md5($pass));

        $this->result=$auth->authenticate($authAdapter);

        if ($this->result->isValid()) {
            Zend_Session::rememberMe(1209600);//14days
            return true;
        }
        else{
            return false;
        }
    }
    function getErrors(){

        if (!$this->result->isValid())
            return $this->result->getMessages();
    }
}
