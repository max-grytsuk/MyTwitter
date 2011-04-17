<?php

class Application_Model_DbTable_Users extends Zend_Db_Table_Abstract
{
    protected $_name = 'users';

    public function getUserData($email)
    {
        $where = $this->getAdapter()->quoteInto('email = ?', $email);
        $row = $this->fetchRow($where);
        return $row;
    }

    public function getAllTweetersData($followingIdsArr)
    {

        $select = $this->select()
                ->where('id NOT IN (?)', $followingIdsArr)
                ->limit(10, 0)
        ;

        $select->from($this, array('email','avatar','info'));

        $rows = $this->fetchAll($select);

        $resArr =$rows->toArray();
        return $resArr;
    }
    public function getUsersData($arr)
    {
        if (count($arr) !== 0){
            $select = $this->select()
                    ->limit(10, 0);
            $select->where('id IN (?)', $arr);
            $select->from($this, array('email','avatar','info'));

            $rows = $this->fetchAll($select);

            $resArr =$rows->toArray();
            return $resArr;
        } else {
            return array();
        }


    }
    public function addUser($data)
    {
        try {
            $firephp = Zend_registry::get('firephp');

            $pass = $data['password'];
            $email = $data['email'];

            $dataDB = array(
                'email'      => $email,
                'password' => md5($pass),
                'activation' => 0
            );
            $this->insert($dataDB);

            $result="success";
            return $result;
        } catch (Exception $e) {
            $code =$e->getCode();
            $firephp->log('CODE -' . $code);
            switch ($code){
                case "23000":
                    return 'usedEmail';
                default:

                    return $code;
            }

        }
    }
    public function activateUser($email) {
        $firephp = Zend_registry::get('firephp');
        try {
            $dataDB = array(
                'activation' => 1
            );

            $where = $this->getAdapter()->quoteInto('email = ?', $email);
            $this->update($dataDB,$where);

            $result="success";
            return $result;
        } catch (Exception $e) {
            $code =$e->getCode();

            switch ($code){
                case "23000":
                    return $code;
                default:
                    return $code;
            }
        }
    }

    public function changeUserPassword($newpassword,$email){
        $firephp = Zend_registry::get('firephp');
        try {


            $dataDB = array(
                'password' => md5($newpassword)
            );

            $where = $this->getAdapter()->quoteInto('email = ?', $email);
            $this->update($dataDB,$where);

            $result="success";
            return $result;
        } catch (Exception $e) {
            $code =$e->getCode();
            return $code;
        }
    }
    public function changeUserAvatar($avatar,$email){
        $firephp = Zend_registry::get('firephp');
        try {

            $dataDB = array(
                'avatar' => $avatar
            );

            $where = $this->getAdapter()->quoteInto('email = ?', $email);
            $this->update($dataDB,$where);

            $result="success";
            return $result;
        } catch (Exception $e) {
            $code =$e->getCode();
            return $code;
        }
    }
}

