var core = function () {
    var moduleData = {};
    return {
        register: function(moduleId, creator) {
            moduleData[moduleId] = {
                creator: creator,
                instance: null
            };
        },
        init: function() {
            this.startAll();
        },
        start: function(moduleId,stage) {
            moduleData[moduleId].instance = moduleData[moduleId].creator();
            moduleData[moduleId].instance.init();
        },
        startAll: function() {
            for (var moduleId in moduleData) {
                if (moduleData.hasOwnProperty(moduleId)) {
                    this.start(moduleId);
                }
            }
        }
    };
}();

var sandbox = function() {
    var moduleHandleList = [];
    var moduleHandle = {};

    return {
        listen: function(e, handle) {
            moduleHandle = {
                e:e,
                handle: handle
            };
            moduleHandleList.push(moduleHandle);
        },
        notify: function(message) {
            for (var i = 0; i < moduleHandleList.length; i += 1) {
                for (var j = 0; j < moduleHandleList[i].e.length; j += 1) {
                    if (moduleHandleList[i].e[j] === message.type) {
                        moduleHandleList[i].handle(message);
                    }
                }
            }
        },
        request:function(req, data, callback) {
            var tH = {
                success: function(id, o, args) {
                    callback.success(o.responseText);
                },
                failure: function(id, o, args) {
                    callback.failure('ERROR');
                }
            };
            data = data.replace(/\&nbsp;+/,'');
            var cfg = {
                method: 'POST',
                on: {
                    success: tH.success,
                    failure: tH.failure
                },
                data: "req="+req + data,
                context: tH,
                headers: { 'X-Transaction': 'POST'}
            };

            var uri = "db";
            YUI().use("io", function(Y) {
                Y.io(uri, cfg);
            });
        },
        userData:null,
        fn:function() {
            return {
                setUserData:function(obj) {
                    YUI().use("json", function(Y) {
                        //For avoiding duplicate posts we save userData in sandbox
                        if (sandbox.userData === null){
                            sandbox.request('get-user-data','',{
                                success: function(response){
                                    var data = Y.JSON.parse(response) ;
                                    sandbox.userData = data;
                                    obj.set('email',data.email);
                                    obj.set('avatar',data.avatar);

                                },
                                failure: function(response){
                                    Y.log('sandbox.response - failureConnect');
                                }
                            });
                        } else {
                            obj.set('email',sandbox.userData.email);
                            obj.set('avatar',sandbox.userData.avatar);

                        }
                    });
                }
            };
        }(),
        basePath: 'http://vse.drer.org.ua/public/'
    };
}();


core.register("tweets", function() {
    return {
        init: function() {
            YUI({
                modules: {
                    "tweets": {
                        fullpath: sandbox.basePath +'js/main/tweets.js',
                        requires: ['widget', 'widget-parent', 'widget-child','event-custom','json']
                    }
                }
            }).use("tweets",'datatype-date', function (Y) {

                Y.on("domready", function() {

                    var tweets = new Y.Tweets();
                    tweets.render('#tweets');

                    tweets.loadTweetsOnStart();

                    var now=Y.DataType.Date.format (  new Date() , {format:"%Y-%m-%d %T"} )
                    tweets.set('startTime',now);

                    $(function() {
                        $(".scrollable").scrollable({ vertical: true });

                    });
                    var api = $(".scrollable").data("scrollable");
                    tweets.set('scroll',api);

                    //cheking for recent tweets every 3 min
                    tweets.polling(180000);

                    var handleNotification = function(message) {
                        switch (message.type) {
                            case 'new_tweet:added':
                                tweets.loadRecentTweets();
                                break;
                        }
                    };
                    sandbox.listen([
                        'new_tweet:added'
                    ], handleNotification);
                })
            });
        }
    };
});

core.register("user-panel", function() {
    return {
        init: function() {

            YUI({
                modules: {
                    user_panel:{
                        fullpath: sandbox.basePath +"js/main/user_panel.js",
                        requires: ['widget', 'widget-parent', 'widget-child','json']
                    },
                    following_cont:{
                        fullpath: sandbox.basePath +"js/main/following_cont.js",
                        requires: ['widget', 'widget-parent', 'widget-child','json']
                    },
                    followed_cont:{
                        fullpath: sandbox.basePath +"js/main/followed_cont.js",
                        requires: ['widget', 'widget-parent', 'widget-child','json' ]
                    }
                }
            }).use('user_panel','following_cont','followed_cont','tabview', function (Y) {

                Y.on("domready", function() {

                    var userPanel = new Y.WJ.UserPanel();
                    userPanel.render('#userPanel');

                    sandbox.fn.setUserData(userPanel);

                    var tabview = new Y.TabView({
                        children: [{
                            label: '<div class="user-panel-tabview-label active">Following (<span id="followingCount"></span>)</div>',
                            content: "<div id='following-cont-tab'></div>"
                        }, {
                            label: '<div class="user-panel-tabview-label">Followed (<span id="followedCount"></span>)</div>',
                            content: "<div id='followed-cont-tab'></div>"
                        }]
                    });
                    tabview.render('#tabview-userpanel');

                    tabview.on('selectionChange',function(e){
                        e.prevVal.get('contentBox').one('.user-panel-tabview-label').removeClass('active');
                        e.newVal.get('contentBox').one('.user-panel-tabview-label').addClass('active');
                    })

                    var followingCont = new Y.FollowingCont();
                    followingCont.render('#following-cont-tab');

                    var followedCont = new Y.FollowedCont();
                    followedCont.render('#followed-cont-tab');


                    var handleNotification = function(message) {
                        switch (message.type) {
                            case 'who_to_follow:following_added':
                                followingCont.addFollowing(message.data);
                                break;
                        }
                    };
                    sandbox.listen([
                        'who_to_follow:following_added'
                    ], handleNotification);
                });
            });
        }
    };
});


core.register("new_tweet_box", function() {
    return {
        init: function() {

            YUI({
                combine:true,
                modules: {
                    new_tweet_box:{
                        fullpath: sandbox.basePath +"js/main/new_tweet_box.js",
                        requires: ["widget","overlay","json-stringify",'datatype-date','dd','editor']
                    },
                    overlaycss:{
                        fullpath: sandbox.basePath +"css/main/overlay.css",
                        type: 'css'
                    }
                }
            }).use('new_tweet_box', 'overlaycss',function (Y) {

                Y.on("domready", function() {

                    var newTweetBox = new Y.WJ.NewTweetBox();
                    newTweetBox.render();

                    var editor = new Y.EditorBase();

                    editor.on('dom:keyup', function(e) {
                        newTweetBox.limitText();
                    });

                    editor.render('#editorBody');

                    newTweetBox.set('editor',editor);
                });
            });
        }
    };
});

core.register("who-to-follow", function() {
    return {
        init: function() {

            YUI({
                modules: {
                    who_to_follow:{
                        fullpath: sandbox.basePath +"js/main/who_to_follow.js",
                        requires: ["widget","overlay","json-stringify",'datatype-date','dd']
                    }
                }
            }).use('node', function (Y) {

                Y.on("domready", function() {
                    //lazy loading of module who_to_follow
                    var  handle = Y.on("click", function(){

                        Y.use('who_to_follow', function (Y) {

                            var whoToFollow = new Y.WhoToFollow();
                            whoToFollow.render();

                            whoToFollow.loadTweeters();

                            Y.on('click',whoToFollow.showPanel,'#bWhoToFollow',whoToFollow);


                            var handleNotification = function(message) {
                                switch (message.type) {
                                    case 'who_to_follow:unfollowing':
                                        whoToFollow.setTweeters(message.data);
                                        break;
                                }
                            };
                            sandbox.listen([
                                'who_to_follow:unfollowing'
                            ], handleNotification);
                        });

                        handle.detach();

                    }, "#bWhoToFollow");
                });
            });
        }
    };
});
