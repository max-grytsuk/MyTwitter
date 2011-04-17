YUI.add("following_cont", function(Y) {

    Y.FollowingCont = Y.Base.create("following_cont", Y.Widget, [Y.WidgetParent], {

        _afterChildAdded:function(e) {
            e.child.set('parent', this);
            e.child.render(this.get("contentBox"));
        },
        loadFollowing:function () {

            var userPanel =this;
            sandbox.request('load-following','',{
                success: function(response){
                    userPanel.setFollowing(Y.JSON.parse(response)) ;
                },
                failure: function(response){
                    Y.log('sandbox.response - failureConnect');
                }
            });
        },
        setFollowing:function(tweeters){
            var info;
            for(var i in tweeters){
                var t = tweeters[i];
                if (t.info === null){
                    info ='';
                }
                var following = new Y.Following({
                    email:t.email,
                    avatar:t.avatar,
                    info:info
                })
                this.add(following);
            }
            Y.one('#followingCount').set('innerHTML',this.size());
        },

        addFollowing:function(tweeter){

            var following = new Y.Following({
                email:tweeter.email,
                avatar:tweeter.avatar,
                info:tweeter.info
            })
            this.add(following);
            Y.one('#followingCount').set('innerHTML',this.size());
        },
         CONTENT_TEMPLATE : "<ul id='following-cont'></ul>",

        renderUI : function() {
          this.loadFollowing();
        },
        bindUI : function() {
         this.after('addChild', this._afterChildAdded);
        }

    }, {
        ATTRS : {
            defaultChildType: {
                value: "Following"
            }
        }
    });


    Y.Following = Y.Base.create("following", Y.Widget, [Y.WidgetChild], {
        _uiShowMenu:function(e){
            var fmstr ='#followingmenu-'+this.get('id');
            this.get("contentBox").one(fmstr).show();
        },
        _uiHideMenu:function(e){
            var fmstr ='#followingmenu-'+this.get('id');
            this.get("contentBox").one(fmstr).hide();
        },
        _onUnfollowClick:function(e){
            e.halt();
            var email = this.get('email');

            var dataDB="&email=" + email;
            var that = this;
            sandbox.request('unfollowing', dataDB, {
                success: function(response) {
                    var tweeter = {email:email,avatar:that.get('avatar'),info:that.get('info')};
                    sandbox.notify({
                        type: 'who_to_follow:unfollowing',
                        data: [tweeter]
                    });
                    Y.one('#followingCount').set('innerHTML',that.get('parent').size());
                    that.remove();
                },
                failure: function(response) {
                    Y.log('sandbox.response - failureConnect');
                }
            });
        },

        BOUNDING_TEMPLATE : "<li></li>",

        renderUI : function() {

            var email = this.get("email");

            var c = this.get("contentBox");
            var id = this.get('id');
            var avatar = this.get("avatar");
            var srcBase = sandbox.basePath + 'profile_images/',src;
            avatar===null?src =srcBase + 'default_profile_3_normal.png':src = srcBase + avatar ;
            c.setContent(

                    "<div id='followingcell-"+id+"' class='followingcell' >" +
                            "<div class='avatarPicture' style='width:30px'><img src='"+src+"' alt='image' height='20'></div>"+

                            "<div style='float:left'>"+

                            "<div class='tweetername'>" +
                            email +
                            "</div>" +


                            "</div>"+

                            "<div id ='followingmenu-"+id+"' class='followingmenu'>"+
                            "<a  id='fmunfollow-"+id+"' href='#'>Unfollow</a>"+
                            "</div>"+

                            "<div class='cleared'></div>" +
                            "</div>" +
                            "<div class='cleared'></div>"

                    );
            Y.one('#following-cont').append(this.get("boundingBox"));
            var fmstr ='#followingmenu-'+id;
            this.get("contentBox").one(fmstr).hide();
        },

        bindUI : function() {
            var c = this.get("contentBox");
            var id = this.get('id');
            var fcstr ='#followingcell-'+id;
            Y.on('mouseover', Y.bind(this._uiShowMenu, this),c.one(fcstr));
            Y.on('mouseout', Y.bind(this._uiHideMenu, this),c.one(fcstr));
            var unfollowstr = "#fmunfollow-"+id;
            Y.on('click', Y.bind(this._onUnfollowClick, this),c.one(unfollowstr));
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

