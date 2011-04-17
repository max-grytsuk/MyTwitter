<?php

/**
 * AuthController
 *
 * @author
 * @version
 */

require_once 'Zend/Controller/Action.php';

class AuthController extends Zend_Controller_Action {
    /**
     * The default action - show the home page
     */


    public function init()
    {
        //$this->_helper->AjaxContext()->addActionContext('login', 'json')->initContext('json');
        if ($this->getRequest()->isXmlHttpRequest()) {
            //если AJAX - отключаем авторендеринг шаблонов
            Zend_Controller_Action_HelperBroker::removeHelper('viewRenderer');
        }
    }

    public function loginAction() {
        $firephp = Zend_registry::get('firephp');

        if (($email = $this->_getParam('email')) && ($password = $this->_getParam('password')) ){

            $login = new Application_Model_LoginClass();

            if ($login->isValid($email, $password)){
                $this->getResponse()->setHeader("Content-type", 'text/plain');
                $this->getResponse()->setBody("success");
            }

            else{
                $this->getResponse()->setHeader("Content-type", 'text/plain');
                $this->getResponse()->setBody('wrongIdentity');
            }
        }
    }
    public function signupAction(){
        $data = $this->_getAllParams();
        $firephp = Zend_registry::get('firephp');

        if ($data != null && $this->_request->isPost() ){

            $users = new Application_Model_DbTable_Users();
            $pubKey='6Lf4b8MSAAAAAAzbWpkjwFCNErpl6QQGB_tQYwRT';
            $privKey='6Lf4b8MSAAAAAN_vMk4fuWAo_D6pcIz-fZ0gKyEs';
            $recaptcha = new Zend_Service_ReCaptcha($pubKey, $privKey);

            $resultCaptchaVerify = $recaptcha->verify(
                $data['recaptcha_challenge_field'],
                $data['recaptcha_response_field']
            );

            if ($resultCaptchaVerify->isValid()) {
                $result = $users->addUser($data);

                if ($result === 'success'){
                    $userData = $users->getUserData($data['email']);
                    $activation    = md5($userData['id']).md5($data['email']);//код активации
                    $to = $data['email'];
                    $mail = new Zend_Mail('utf-8');

                    $mail->setBodyText("Перейдите по ссылке, чтобы активировать ваш    аккаунт:\nhttp://vse.drer.org.ua/auth/activation/email/".$data['email']."/code/".$activation);

                    $mail->setFrom('MyTwitter', 'Vse');
                    $mail->addTo($to,  $data['username']);
                    $mail->setSubject("Registration");
                    $mail->send();
                }

            } else {
                $result ='invalidCaptcha';
            }

            $this->getResponse()->setHeader("Content-type", 'text/plain');
            $this->getResponse()->setBody($result);
        }
    }
    public function activationAction(){

        $data = $this->_getAllParams();
        $firephp = Zend_registry::get('firephp');
        $users = new Application_Model_DbTable_Users();
        if ($data != null){

            $userData = $users->getUserData($data['email']);
            $code = $data['code'];
            $activation =  md5($userData['id']).md5($userData['email']);

            if ($code === $activation){
                $users->activateUser($data['email']);
                echo 'Activation complete...<a href="http://vse.drer.org.ua">на главную</a>';
            } else {
                echo 'Activation unsuccessful...<a href="http://vse.drer.org.ua">на главную</a>';
            }
        } else {
            $this->_redirect('index');
        }
        Zend_Controller_Action_HelperBroker::removeHelper('viewRenderer');

    }

    public function logoutAction(){
        Zend_Auth::getInstance()->clearIdentity();
        $this->_redirect('index');
    }

    public function changeAvatarAction(){
        $data = $this->_getAllParams();
        $firephp = Zend_registry::get('firephp');

        if ($data != null && $this->_request->isPost() ){

            $users = new Application_Model_DbTable_Users();

            $auth = Zend_Auth::getInstance();
            $email = $auth->getIdentity();

            $result= $users->changeUserAvatar($data['avatar'],$email);

            $this->getResponse()->setHeader("Content-type", 'text/plain');
            $this->getResponse()->setBody($result);
        }
    }

    public function changePasswordAction(){
        $data = $this->_getAllParams();
        $firephp = Zend_registry::get('firephp');

        if ($data != null && $this->_request->isPost() )
        {
            $users = new Application_Model_DbTable_Users();

            $auth = Zend_Auth::getInstance();
            $email = $auth->getIdentity();

            $userData=$users->getUserData($email);

            if ($userData['password'] === md5($data['curpassword'])  ) {
                $result= $users->changeUserPassword($data['newpassword'],$email);
            } else {
                $result='incorrectPassword';
            }

            $this->getResponse()->setHeader("Content-type", 'text/plain');
            $this->getResponse()->setBody($result);
        }
    }
}

    
	