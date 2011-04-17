YUI.add("new_tweet_box", function(Y) {

    function NewTweetBox(config) {
        NewTweetBox.superclass.constructor.apply(this, arguments);
    }

    NewTweetBox.NAME = "newTweetBox";

    NewTweetBox.ATTRS = {
        overlay:{
            value: null
        },
        editor:{
            value:null
        },
        limitNum:{
            value:140
        },

        email:{
            value:null
        },
        avatar:{
            value:null
        }

    };

    /* MyComponent extends the Base class */
    Y.extend(NewTweetBox, Y.Widget, {

        showPanel : function() {
            sandbox.fn.setUserData(this);
            var overlay = this.get('overlay');
            var limitNum =this.get('limitNum');
            Y.one('#symbLeft').set('innerHTML',limitNum);
            var editor = this.get('editor');
            if ( editor.getInstance() === null){
                editor.on('frame:ready', function() {
                    this.getInstance().one('body').set("innerHTML",'');
                    this.focus();
                });
            }
            else{
                editor.getInstance().one('body').set("innerHTML",'');
                editor.focus();
            }
            overlay.show();
        },

        save: function (e){

            var limitCount =Number( Y.one('#symbLeft').get('innerHTML') );
            if ( limitCount >= 0 && limitCount < 140){
                e.halt();
                var text = this._getEditorText();
                var now = Y.DataType.Date.format (  new Date() , {format:"%Y-%m-%d %T"} ); //Y-m-d H:i:s
                var tweet ={text:text,time:now};
                var jsonTweet = Y.JSON.stringify(tweet);
                var dataDB="&tweet=" + jsonTweet;
                var that = this;
                sandbox.request('new-tweet', dataDB, {
                    success: function(response) {
                        tweet ={text:text,time:now,email:that.get('email'),avatar:that.get('avatar')};
                        sandbox.notify({
                            type: 'new_tweet:added',
                            data: [tweet]
                        });
                    },
                    failure: function(response) {
                        Y.log('sandbox.response - failureConnect');
                    }
                });
                var overlay = this.get('overlay');
                overlay.hide();
            }
        },

        _onCancel:function (e){
            e.halt();
            var overlay =this.get('overlay');
            overlay.hide();
        },
        _getEditorText:function(){
            var editor = this.get('editor'),text;

            if ( editor.getInstance() === null){
                editor.on('frame:ready', function() {
                    text =this.getInstance().one('body').get("innerHTML");
                });
            }
            else{
                text = editor.getInstance().one('body').get("innerHTML");
            }
            var stripHTML = /<\S[^><]*>/g;

            text =text.replace(/<br>/gi, '').replace(stripHTML, '').replace(/\&nbsp;+/,'');
            return text;
        },

        limitText:function() {
            var t =this._getEditorText();
            var textLength = this._getEditorText().length;
            var limitCount = Y.one('#symbLeft');
            var limitNum =this.get('limitNum');
            var b = Y.one('#bSave');
            limitCount.set('innerHTML',limitNum - textLength) ;
            if (textLength > limitNum ) {
                b.addClass('disabled');
                limitCount.setStyle('color','red')

            } else if (textLength === 0){
                b.addClass('disabled');
                limitCount.setStyle('color','black');
            } else {
                b.removeClass('disabled');
                limitCount.setStyle('color','black');
            }
        },
        renderUI : function() {

            var headerContent =  "<div >Say something</div>";

            var footerContent = "<div>"+
                    "<input type='button' class='art-button-wrapper disabled' id='bSave' value='&nbsp;Tweet&nbsp;'>"+
                    "<input type='button' class='art-button-wrapper' id='bCancel' value='&nbsp;Cancel&nbsp;'>"+
                    "<div id = 'symbLeft' style='float:right;padding-top:5px'>"+this.get('limitNum') +
                    "</div>"+
                    "</div>";
            ;

            var editorBody = '<div id="editorBody"></div> '
            var overlay = new Y.Overlay({
                srcNode:"#tweetBoxOverlay",
                bodyContent: editorBody,
                headerContent:headerContent,
                footerContent: footerContent,
                visible:false,
                centered:true,
                width:"500px",
                height:"250px",
                zIndex:10
            });
            overlay.render();
            this.set('overlay',overlay);


            new Y.DD.Drag({
                node: '#tweetBoxOverlay'
            });
        },

        bindUI : function() {
            var c = this.get('contentBox');
            var editor=this.get('editor');
            Y.on("click", Y.bind(this.save, this) , Y.one("#bSave"));
            Y.on("click", Y.bind(this._onCancel, this), Y.one("#bCancel"));
            Y.on('click',  Y.bind(this.showPanel, this),Y.one('#bAddTweet'));
        }
    });

    Y.namespace("WJ").NewTweetBox = NewTweetBox;

}, "3.1.0", {requires:["widget","overlay",'json-stringify','datatype-date','dd','editor']});
