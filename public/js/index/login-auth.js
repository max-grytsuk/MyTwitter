$(document).ready(function(){

    $(function() {
        // setup ul.tabs to work as tabs for each div directly under div.panes
        $("ul.tabs").tabs("div.panes > div");
    });

    var api = $("ul.tabs").data("tabs");

    api.onClick(function(e) {
        if (api.getIndex()=== 1){
            $('#captcha').hide();
        } else {
            $('#captcha').show();
        }
    });

    $.tools.validator.addEffect("wall", function(errors, event) {

        // get the message wall
        var wall = $(this.getConf().container).fadeIn();

        // remove all existing messages
        wall.find("p").remove();

        // add new ones
        $.each(errors, function(index, error) {
            wall.append(
                    "<p><strong>" +error.input.attr("name")+ "</strong> " +error.messages[0]+ "</p>"
                    );
        });

// the effect does nothing when all inputs are valid
    }, function(inputs)  {

    });

    $("#loginForm").validator({
        effect: 'wall',
        container: '#errors-login',

        // do not validate inputs when they are edited
        errorInputEvent: null

// custom form submission logic
    }).submit(function(e)  {
        var form = $(this);

        // when data is valid
        if (!e.isDefaultPrevented()) {

            var node = $("#errors-login");
            node.css('display','block');
            var email =$('#loginForm').find('input[name=email]').val();
            var password =$('#loginForm').find('input[name=password]').val();


            if (email !== '' && password !== ''){
                $.ajax({
                    type: "POST",
                    url: "auth/login",
                    data: "email="+ email +"&password="+password,
                    beforeSend:function(){
                        node.text('Проверяем ...');
                    },
                    success: function(msg){

                        switch (msg){
                            case 'success':
                                // tell user that everything is OK
                                node.html("<h2>All good</h2>");
                                location = "main/index";
                                break;

                            case 'wrongIdentity':
                                node.html('Wrong email or password');
                                break;
                            default:
                                node.html('Unknown mistake');
                                break;
                        }

                    }
                });
            }

            // prevent the form data being submitted to the server
            e.preventDefault();
        }
    });

    $('input[name=recaptcha_response_field]').keyup(function(e) {
        if (e.keyCode === 13){
            $("#signupForm").submit();
        }
    });

    $("#signupForm").delegate("input", "keyup", function(e){
        if (e.keyCode === 13){
            $("#signupForm").submit();
        }
    });

    $('#submitSignup').click(function(e) {
        $("#signupForm").submit();
    });


    $("#signupForm").validator({
        effect: 'wall',
        container: '#errors-signup',
        errorInputEvent: null
    }).submit(function(e)  {
        var form = $(this);
        // when data is valid
        if (!e.isDefaultPrevented()) {

            var node = $("#errors-signup");
            node.css('display','block');
            var email =$('#signupForm').find('input[name=email]').val();
            var password =$('#signupForm').find('input[name=password]').val();
            var recaptcha_challenge_field = $('input[name=recaptcha_challenge_field]').val();
            var recaptcha_response_field = $('input[name=recaptcha_response_field]').val();

            if (recaptcha_response_field !== ''){
                $.ajax({
                    type: "POST",
                    url: "auth/signup",
                    data: "email="+ email +"&password="+password +"&recaptcha_challenge_field="+recaptcha_challenge_field +"&recaptcha_response_field="+recaptcha_response_field ,
                    beforeSend:function(){
                        node.text('Checking ...');
                    },
                    success: function(msg){

                        switch (msg){
                            case 'success':
                                node.text('Follow link in email to confirm registration');
                                break;
                            case 'badPassword':
                                node.text('Password no less then 6 symbols');
                                break;
                            case 'usedEmail':
                                node.text('This email is taken');
                                break;
                            case 'invalidCaptcha':
                                node.text('invalid Captcha');
                                break;
                            default:
                                node.html('Unknown mistake');
                        }
                    }
                });
            } else {
                node.html('Do not forget about captcha ');
            }

            // prevent the form data being submitted to the server
            e.preventDefault();
        }
    });


    $.tools.validator.fn("[minlength]", function(input, value) {
        var min = input.attr("minlength");

        return value.length >= min ? true : {
            en: "Please provide at least " +min+ " character" + (min > 1 ? "s" : "")
        };
    });


    $.tools.validator.fn("[data-equals]", "Value not equal with the $1 field", function(input) {
        var name = input.attr("data-equals"),
                field = this.getInputs().filter("[name=" + name + "]");
        return input.val() == field.val() ? true : [name];
    });

});