<?php

class Application_Model_MainClass
{

    public function makeRequest($data, $email){
        $firephp = Zend_registry::get('firephp');
        $req = $data['req'];
        $users = new Application_Model_DbTable_Users();
        $tweets = new Application_Model_DbTable_Tweets();
        $tweetersRelations = new Application_Model_DbTable_TweetersRelations();


        switch ($req) {
            case 'load-tweets-on-start':
                $res = $users->getUserData($email);
                $idUser = $res['id'];

                $followingIdsArr = $tweetersRelations->getFollowing($idUser);
                $followingIdsArr[] = $idUser;

                 $tweetsArr = $tweets->loadTweetsOnStart($followingIdsArr);

                return Zend_Json::encode($tweetsArr);
                break;
            case 'load-recent-tweets':
                $res = $users->getUserData($email);
                $idUser = $res['id'];
                $followingIdsArr = $tweetersRelations->getFollowing($idUser);
                $followingIdsArr[] = $idUser;
                $time = $data['time'];

                $tweetsArr = $tweets->getRecentTweets($followingIdsArr,$time);

                return Zend_Json::encode($tweetsArr);
                break;
            case 'load-more-tweets':
                $res = $users->getUserData($email);
                $idUser = $res['id'];
                $followingIdsArr = $tweetersRelations->getFollowing($idUser);
                $followingIdsArr[] = $idUser;
                $time = $data['time'];

                $tweetsArr = $tweets->getMoreTweets($followingIdsArr,$time);

                return Zend_Json::encode($tweetsArr);
                break;
            case 'load-tweeters':
                $res = $users->getUserData($email);
                $idUser = $res['id'];

                $followingIdsArr = $tweetersRelations->getFollowing($idUser);
                $followingIdsArr[] = $idUser;

                $resArr = $users->getAllTweetersData($followingIdsArr);
                return Zend_Json::encode($resArr);
                break;
            case 'load-following':
                $res = $users->getUserData($email);
                $idUser = $res['id'];

                $followingIdsArr = $tweetersRelations->getFollowing($idUser);

                $resArr = $users->getUsersData($followingIdsArr);
                return Zend_Json::encode($resArr);
                break;
            case 'load-followed':
                $res = $users->getUserData($email);
                $idUser = $res['id'];

                $followedIdsArr = $tweetersRelations->getFollowed($idUser);

                $resArr = $users->getUsersData($followedIdsArr);
                return Zend_Json::encode($resArr);
                break;
            case 'get-user-data':
                $res = $users->getUserData($email);
                $resArr = array('email'=>$email,"avatar"=>$res['avatar']);
                return Zend_Json::encode($resArr);
                break;
            case 'new-tweet':
                $row = $users->getUserData($email);
                $idUser = $row['id'];
                $tweetJSON = json_decode($data['tweet']);
                $res =$tweets->addTweet($tweetJSON,$idUser);
                return $res;

                break;
            case 'new-following':

                $row = $users->getUserData($email);
                $idCurrentUser = $row['id'];

                $followingEmail =  $data['email'];
                $row = $users->getUserData($followingEmail);
                $idFollowingUser = $row['id'];

                $res = $tweetersRelations ->addRelation($idCurrentUser,$idFollowingUser);
                return $res;

                break;
            case 'unfollowing':

                $row = $users->getUserData($email);
                $idCurrentUser = $row['id'];

                $followingEmail =  $data['email'];
                $row = $users->getUserData($followingEmail);
                $idFollowingUser = $row['id'];

                $res = $tweetersRelations ->removeRelation($idCurrentUser,$idFollowingUser);
                return $res;

                break;
            default:
                return 'failure';
                ;
                break;
        }
    }
}
