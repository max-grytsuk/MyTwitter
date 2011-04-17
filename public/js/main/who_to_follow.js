YUI.add("who_to_follow", function(Y) {

    Y.WhoToFollow = Y.Base.create("who_to_follow", Y.Widget, [Y.WidgetParent], {

        _afterChildAdded:function(e) {
            e.child.set('parent', this);
            e.child.render(this.get("contentBox"));
        },
        loadTweeters:function () {

            var tweeters =this;
            sandbox.request('load-tweeters','',{
                success: function(response){
                    tweeters.setTweeters(Y.JSON.parse(response)) ;
                },
                failure: function(response){
                    Y.log('sandbox.response - failureConnect');
                }
            });
        },
        setTweeters:function(tweeters){
            var info
            for(var i in tweeters){
                var t = tweeters[i];
                if (t.info === null || t.info === ''){
                    info ='';
                }
                var tweeter = new Y.Tweeter({
                    email:t.email,
                    avatar:t.avatar,
                    info:info
                })
                this.add(tweeter);
            }
        },
        showPanel : function() {
            this.removeAll()
            this.loadTweeters();
            var overlay = this.get('overlay');
            overlay.set('xy',[155,25]);
            overlay.show();
        },

        hidePanel:function(){
            var overlay =this.get('overlay');
            overlay.set('centered',false);
            overlay.set('xy',[-300,-300]);
            overlay.hide();
        },


        renderUI : function() {

            var headerContent =  "<div style='float:left'>Who to follow</div>"+
                    "<div id='bCloseWhoToFollow'><a href='#'>Close</a></div>";


            var body = "<ul id='tweeters-cont'></ul>" ;

            var overlay = new Y.Overlay({
                srcNode:"#whoToFollowOverlay",
                bodyContent: body,
                headerContent:headerContent,
                width:"400px",
                xy:[155,25],
                zIndex:8
            });
            overlay.render();
            this.set('overlay',overlay);
            new Y.DD.Drag({
                node: '#whoToFollowOverlay'
            });
        },

        bindUI : function() {
            this.after('addChild', this._afterChildAdded);
            Y.on('click', Y.bind(this.hidePanel, this), Y.one('#bCloseWhoToFollow'));
        }

    }, {
        ATTRS : {
            defaultChildType: {
                value: "Tweeter"
            },
            overlay:{
                value: null
            }
        }
    });


    Y.Tweeter = Y.Base.create("tweeter", Y.Widget, [Y.WidgetChild], {
        _uiShowMenu:function(e){
            var tmstr ='#tweetermenu-'+this.get('id');
            this.get("contentBox").one(tmstr).show();
        },
        _uiHideMenu:function(e){
            var tmstr ='#tweetermenu-'+this.get('id');
            this.get("contentBox").one(tmstr).hide();
        },
        _onFollowClick:function(e){
            e.halt();
            var email = this.get('email');

            var dataDB="&email=" + email;
            var that = this;
            sandbox.request('new-following', dataDB, {
                success: function(response) {
                    var tweeter = {email:email,avatar:that.get('avatar'),info:that.get('info')};
                    sandbox.notify({
                        type: 'who_to_follow:following_added',
                        data: tweeter
                    });
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
            var info = this.get("info");

            var c = this.get("contentBox");
            var id = this.get('id');
            var avatar = this.get("avatar");
            var srcBase = sandbox.basePath + 'profile_images/',src;
            avatar===null?src =srcBase + 'default_profile_3_normal.png':src = srcBase + avatar ;
            c.setContent(

                    "<div id='tweetercell-"+id+"' class='tweetercell' >" +
                            "<div class='avatarPicture'><img src='"+src+"' alt='image' height='50'></div>"+

                            "<div style='float:left'>"+

                            "<div class='tweetername'>" +
                            email +
                            "</div>" +

                            "<div class='tweeterinfo'>" +
                            info  +
                            "</div>" +

                            "</div>"+

                            "<div id ='tweetermenu-"+id+"' class='tweetermenu'>"+
                            "<a  id='tmfollow-"+id+"' href='#'>Follow</a>"+
                            "</div>"+

                            "<div class='cleared'></div>" +
                            "</div>" +
                            "<div class='cleared'></div>"

                    );
            Y.one('#tweeters-cont').append(this.get("boundingBox"));
            var tmstr ='#tweetermenu-'+id;
            this.get("contentBox").one(tmstr).hide();
        },

        bindUI : function() {
            var c = this.get("contentBox");
            var id = this.get('id');
            var tcstr ='#tweetercell-'+id;
            Y.on('mouseover', Y.bind(this._uiShowMenu, this),c.one(tcstr));
            Y.on('mouseout', Y.bind(this._uiHideMenu, this),c.one(tcstr));
            var followstr = "#tmfollow-"+id;
            Y.on('click', Y.bind(this._onFollowClick, this),c.one(followstr));
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

}, '3.1.1', {requires:['widget', 'widget-parent', 'widget-child',"overlay",'json','dd','event-custom']});

