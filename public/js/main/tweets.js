YUI.add("tweets", function(Y) {

    Y.Tweets = Y.Base.create("tweets", Y.Widget, [Y.WidgetParent], {

        loadTweetsOnStart:function () {

            var tweets =this;
            sandbox.request('load-tweets-on-start','',{
                success: function(response){
                    tweets._setTweets(Y.JSON.parse(response),true) ;//true - adding tweets to the end  of list
                },
                failure: function(response){
                    Y.log('sandbox.response - failureConnect');
                }
            });
        },
        _refresh:function(){
            this.get('scroll').begin();
            this.removeAll();
            this.loadTweetsOnStart();
        },
        _getMoreTweets:function () {

            var tweets =this,l=this.size(),time;
            l === 0?time = this.get('startTime'):time = this.item(l-1).get('time');

            var data ='&time=' + time;
            sandbox.request('load-more-tweets',data,{
                success: function(response){
                    tweets._setTweets(Y.JSON.parse(response),true) ;//true - adding tweets to the end  of list
                },
                failure: function(response){
                    Y.log('sandbox.response - failureConnect');
                }
            });
        },
        _setTweets:function(tweets,f){
            for(var i in tweets){
                var t = tweets[i];

                var tweet = new Y.Tweet({
                    owner:t.email,
                    avatar:t.avatar,
                    text:t.text,
                    time:t.time
                })
                f?this.add(tweet):this.add(tweet,0);//adding childs whether to end or to beginning of list
            }
        },

        loadRecentTweets:function (){
            var tweets =this,time;

            if (tweets.size()>0){
                time = tweets.item(0).get('time');
            }
            else{
                time = this.get('startTime');
            }
            var data ='&time=' + time;
            sandbox.request('load-recent-tweets',data,{
                success: function(response){
                    tweets._setTweets(Y.JSON.parse(response),false) ;//false - adding tweets to the beginning of list
                },
                failure: function(response){
                    Y.log('sandbox.response - failureConnect');
                }
            });
        },
        polling:function(val){
            Y.later(val,this, this.loadRecentTweets,null,true);
        },

        _afterChildAdded:function(e) {
            e.child.set('parent', this);
            e.child.render(this.get("contentBox"));
        },
        BOUNDING_TEMPLATE :
                "<div class='scrollable vertical'></div>",


        CONTENT_TEMPLATE :
                "<ul id='tweets-cont' class='items'></ul>",



        bindUI : function() {
            this.after('addChild', this._afterChildAdded);
            Y.on('click', Y.bind(this._getMoreTweets, this), Y.one('#moreTweets'));
            Y.on('click', Y.bind(this._refresh, this), Y.one('#refreshTimeline'));
        }

    }, {
        ATTRS : {
            defaultChildType: {
                value: "Tweet"
            }
        }
    });


    Y.Tweet = Y.Base.create("tweet", Y.Widget, [Y.WidgetChild], {

        BOUNDING_TEMPLATE : "<li></li>",


        renderUI : function() {

            var text = this.get("text");
            var owner = this.get("owner");
            var time = this.get("time");

            var c = this.get("contentBox");
            var id = this.get('id');
            var avatar = this.get("avatar");
            var srcBase = sandbox.basePath + 'profile_images/',src;
            avatar===null?src =srcBase + 'default_profile_3_normal.png':src = srcBase + avatar ;
            c.setContent(

                    "<div id='tweetcell-"+id+"' class='tweetcell' >" +
                            "<div class='avatarPicture'><img src='"+src+"' alt='image' height='50'></div>"+

                            "<div>"+
                            "<div class='tweetowner'>" +
                            owner +
                            "</div>" +

                            "<div class='tweettext'>" +
                            text  +
                            "</div>" +

                            "<div class='tweettime'>" +
                            time +
                            "</div>" +
                            "</div>"+
                            "<div class='cleared'></div>" +

                            "</div>" +

                            "<div class='cleared'></div>"

                    );
            Y.one('#tweets-cont').append(this.get("boundingBox"));
        }

    }, {
        ATTRS : {
            id:{
                value: null
            },
            text : {
                value:null
            },
            owner:{
                value:null
            },
            avatar:{
                value:null
            },
            time:{
                value:null
            },
            startTime:{
                value: null
            },
            scroll:{
                value: null
            }

        }
    });

}, '3.1.1', {requires:['widget', 'widget-parent', 'widget-child','event-custom','json']});

