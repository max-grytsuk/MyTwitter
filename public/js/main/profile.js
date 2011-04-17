$(document).ready(function(){

    $(function() {
        // setup ul.tabs to work as tabs for each div directly under div.panes
        $("ul.tabs").tabs("div.panes > div");
    });

    function setUserData(data){
        var srcBase = 'http://vse.drer.org.ua/public/profile_images/',src;
        data.avatar===null?src =srcBase + 'default_profile_3_normal.png':src = srcBase + data.avatar ;
        $('#email').text(data.email);
        $('#avatar').attr('src',src);
    }

    $.ajax({
        type: 'POST',
        url: 'db',
        data: 'req=get-user-data',
        success: setUserData,
        dataType: 'json'
    });

    var avatar;
    $('#bSaveAvatar').click(function(){
        var node = $("#info");

        $.ajax({
            type: 'POST',
            url: "../auth/change-avatar",
            data: "avatar=" + avatar,
            success: function(msg){
                node.show();
                node.html('Avatar changed');
                node.fadeOut(3000);
            }
        });
    })

    $(function(){
        var btnUpload=$('#upload');
        var status=$('#status');
        new AjaxUpload(btnUpload, {
            action:  '/file/upload',
            name: 'uploadfile',
            onSubmit: function(file, ext){
                if (! (ext && /^(jpg|png|jpeg|gif)$/.test(ext))){
// check for valid file extension
                    status.text('Only JPG, PNG or GIF files are allowed');
                    return false;

                }
                status.text('Uploading...');
            },
            onComplete: function(file, response){
//On completion clear the status
                status.text('');
//Add uploaded file to list
                if(response==="success"){
                    var srcBase = 'http://vse.drer.org.ua/public/profile_images/',src;
                    src = srcBase + file ;
                    avatar = file;
                    $('#avatar').attr('src',src);

                }
            }
        });
    });
    $("#passwordChangeForm").submit(function(e)  {
        // prevent the form data being submitted to the server
        e.preventDefault();

        var form = $(this);

        var node = $("#info");

        var curpassword =$('#passwordChangeForm').find('input[name=curpassword]');
        var newpassword =$('#passwordChangeForm').find('input[name=newpassword]');
        var newpasswordcheck =$('#passwordChangeForm').find('input[name=newpasswordcheck]');
        if (curpassword.val().length < 4){
            node.show();
            node.html("<h2>Current password incorrect</h2>");
        }
        else if (newpassword.val().length <4 ){
            node.show();
            node.html("<h2>Password length must be no less then 4 chars</h2>");
        }
        else if (newpassword.val() !== newpasswordcheck.val()){
            node.show();
            node.html("<h2>Value not equal with the password field</h2>");
        }
        else {
            $.ajax({
                type: "POST",
                url: "../auth/change-password",
                data: "curpassword="+ curpassword.val() +"&newpassword="+newpassword.val(),
                beforeSend:function(){
                    node.text('Checking ...');
                },
                success: function(msg){

                    switch (msg){
                        case 'success':
                            node.show();
                            node.html("<h2>Password changed</h2>");
                            node.fadeOut(3000);
                            curpassword.val('');
                            newpassword.val('');
                            newpasswordcheck.val('');
                            break;

                        case 'incorrectPassword':
                            node.show();
                            node.html('Current password incorrect');

                            break;
                        default:
                            node.show();
                            node.html('Unknown mistake');
                            break;
                    }

                }
            });
        }
    });
});