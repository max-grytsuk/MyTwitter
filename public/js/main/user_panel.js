YUI.add("user_panel", function(Y) {

    function UserPanel(config) {
        UserPanel.superclass.constructor.apply(this, arguments);
    }

    UserPanel.NAME = "userPanel";

    UserPanel.ATTRS = {
        email:{
            value:''
        },
        avatar:{
            value:''
        }
    };

    Y.extend(UserPanel, Y.Widget, {

        _afterEmailChange:function(e){
            Y.one('#userPanelEmail').set('innerHTML',e.newVal);
        },
        _afterAvatarChange:function(e){
            var srcBase = sandbox.basePath + 'profile_images/',src;
            e.newVal===null?src =srcBase + 'default_profile_3_normal.png':src = srcBase +e.newVal ;
            Y.one('#userPanelAvatar').set('src',src );
        },

        renderUI : function() {
            var c = this.get("contentBox");

            var avatar = this.get("avatar");
            var email = this.get('email');

            c.setContent(
                    "<img id='userPanelAvatar' src='' height='80'/>" +
                            "<h2 id='userPanelEmail'></h2>"  +
                            "<div id='tabview-userpanel'></div>"
                    )
        },


        bindUI : function() {
            this.after("emailChange", this._afterEmailChange);
            this.after("avatarChange", this._afterAvatarChange);
        }
    });

    Y.namespace("WJ").UserPanel = UserPanel;

}, "3.2.0", {requires:["widget"]});
// END WRAPPER
