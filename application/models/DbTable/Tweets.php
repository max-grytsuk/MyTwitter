<?php

class Application_Model_DbTable_Tweets extends Zend_Db_Table_Abstract
{
    protected $_name = 'tweets';
    protected $_sequence = true;
    protected $_primary = 'id';


    public function addTweet($tweet,$idUser){

        try {
            $firephp = Zend_registry::get('firephp');

            $data = array(
                'text' 		=>	$tweet->{'text'},
                'time'      =>  $tweet->{'time'},
                'idOwner' 	=> 	$idUser
            );

            $this->insert($data);

            return true;
        } catch (Exception $e) {
            return false;
        }

    }
    public function loadTweetsOnStart($arr){
        $firephp = Zend_registry::get('firephp');
        try {

            $select = $this->select(Zend_Db_Table::SELECT_WITH_FROM_PART)
                    ->setIntegrityCheck(false);

            $select
                    ->where('idOwner IN (?)', $arr)
                    ->join('users',
                           'users.id = tweets.idOwner',
                           array('users.email', 'users.avatar') )
                    ->order('time DESC')
                    ->limit(10, 0)
            ;

            $rows = $this->fetchAll($select);
            $resArr =$rows->toArray();

            return $resArr;
        } catch (Exception $e) {
        }
    }
    public function getMoreTweets($arr,$time){
        $firephp = Zend_registry::get('firephp');
        try {
            $count  = 10;
            $offset = 0;

            $select = $this->select(Zend_Db_Table::SELECT_WITH_FROM_PART)
                    ->setIntegrityCheck(false);

            $select
                    ->where('idOwner IN (?)', $arr)
                    ->where('time <?',$time)
                    ->join('users',
                           'users.id = tweets.idOwner',
                           array('users.email', 'users.avatar'))
                    ->limit($count, $offset)
                    ->order('time DESC')

            ;
            $rows = $this->fetchAll($select);
            $resArr =$rows->toArray();

            return $resArr;
        } catch (Exception $e) {
        }
    }
    public function getRecentTweets($arr,$time){
        $firephp = Zend_registry::get('firephp');
        try {

            $select = $this->select(Zend_Db_Table::SELECT_WITH_FROM_PART)
                    ->setIntegrityCheck(false);

            $select
                    ->where('idOwner IN (?)', $arr)
                    ->where('time >?',$time)
                    ->join('users',
                           'users.id = tweets.idOwner',
                           array('users.email', 'users.avatar'))
                     ->order('time ASC')
            ;

            $rows = $this->fetchAll($select);
            $resArr =$rows->toArray();

            return $resArr;
        } catch (Exception $e) {
        }
    }
}




