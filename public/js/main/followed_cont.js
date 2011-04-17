YUI.add("followed_cont", function(Y) {

    Y.FollowedCont = Y.Base.create("followed_cont", Y.Widget, [Y.WidgetParent], {

        _afterChildAdded:function(e) {
            e.child.set('parent', this);
            e.child.render(this.get("contentBox"));
        },

        loadFollowed:function () {

            var userPanel =this;
            sandbox.request('load-followed','',{
                success: function(response){
                    userPanel.setFollowed(Y.JSON.parse(response)) ;
                },
                failure: function(response){
                    Y.log('sandbox.response - failureConnect');
                }
            });
        },
        setFollowed:function(tweeters){
            var info
            for(var i in tweeters){
                var t = tweeters[i];
                if (t.info === null){
                    info ='';
                }
                var followed = new Y.Followed({
                    email:t.email,
                    avatar:t.avatar,
                    info:info
                })
                this.add(followed);
            }
            Y.one('#followedCount').set('innerHTML',this.size());
        },

        CONTENT_TEMPLATE : "<ul id='followed-cont'></ul>",


        renderUI : function() {
            this.loadFollowed();
        },
        bindUI : function() {
            this.after('addChild', this._afterChildAdded);
        }

    }, {
        ATTRS : {
            defaultChildType: {
                value: "Followed"
            },
            email:{
                value:''
            },
            avatar:{
                value:''
            }
        }
    });

    Y.Followed = Y.Base.create("followed", Y.Widget, [Y.WidgetChild], {

        BOUNDING_TEMPLATE : "<li></li>",

        renderUI : function() {

            var email = this.get("email");

            var c = this.get("contentBox");
            var id = this.get('id');
            var avatar = this.get("avatar");
            var srcBase = sandbox.basePath + 'profile_images/',src;
            avatar===null?src =srcBase + 'default_profile_3_normal.png':src = srcBase + avatar ;
            c.setContent(

                    "<div id='followedcell-"+id+"' class='followingcell' >" +
                            "<div class='avatarPicture' style='width:30px'><img src='"+src+"' alt='image' height='20'></div>"+

                            "<div style='float:left'>"+

                            "<div class='tweetername'>" +
                            email +
                            "</div>" +

                            "</div>"+

                            "<div class='cleared'></div>" +
                            "</div>" +
                            "<div class='cleared'></div>"

                    );
            Y.one('#followed-cont').append(this.get("boundingBox"));
        }
    }, {
        ATTRS : {
            email:{
                value:null
            },
            info:{
                value:null
            },
            avatar:{
                value:null
            }
        }
    });

}, '3.1.1', {requires:['widget', 'widget-parent', 'widget-child','json']});

