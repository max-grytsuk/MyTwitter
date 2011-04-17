<?php
class Application_Model_DbTable_TweetersRelations  extends Zend_Db_Table_Abstract{
    protected $_name = 'tweeters_relations';

    public function addRelation($idCurrentUser,$idFollowingUser)
    {
        try {
            $firephp = Zend_registry::get('firephp');

            $dataDB = array(
                'idTweeter'     => $idCurrentUser,
                'idFollowing'   => $idFollowingUser
            );
            $this->insert($dataDB);

            return "success";
        } catch (Exception $e) {
            return "failure";
        }
    }
    public function removeRelation($idCurrentUser,$idFollowingUser){
        $firephp = Zend_registry::get('firephp');

        try {
            $row = $this->fetchRow("idTweeter = $idCurrentUser AND idFollowing = $idFollowingUser");
            $row->delete();

            return "success";
        } catch (Exception $e) {
            return "failure";
        }
    }

    public function getFollowing($idTweeter)
    {
        $select = $this->select()
                ->where('idTweeter = ?', $idTweeter)
        ;
        $select->from($this, array('idFollowing'));

        $rows = $this->fetchAll($select);

        $resArr =$rows->toArray();
        return $resArr;
    }
    public function getFollowed($idTweeter)
    {
        $select = $this->select()
                ->where('idFollowing = ?', $idTweeter)
        ;
        $select->from($this, array('idTweeter'));

        $rows = $this->fetchAll($select);

        $resArr =$rows->toArray();
        return $resArr;
    }
}
