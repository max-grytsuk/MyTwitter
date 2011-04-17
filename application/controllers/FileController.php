<?php

require_once 'Zend/Controller/Action.php';

class FileController extends Zend_Controller_Action {

    public function uploadAction(){

                $upload = new Zend_File_Transfer_Adapter_Http();

                $upload->setDestination(BASE_PATH . '/public/profile_images/');
                if ( $upload->receive()) {
                    echo "success";

                } else {
                    echo "error";
                }

        Zend_Controller_Action_HelperBroker::removeHelper('viewRenderer');
    }
}

