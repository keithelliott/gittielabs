$(document).ready(function(){

    Kinvey.init({
    'appKey': 'kid_VPTm8wMDLM',
    'appSecret': '07216fd19e0d4aa2b4a95c1073419fd4'
    });

    function addEmail(email){
        var prospect  = new Kinvey.Entity({
            email: email,
            create_date: new Date()
        }, 'prospects');

        // disable the save button until we get a response
        $('#addEmailAction').hide();
        $('#emailMessage').show();


        //save to kinvey
        prospect.save({
            success: function(prospect){
              alert('Thanks for submitting your email!  We will let you know as soon as the app is ready');
              $('#emailMessage').hide();
              $('#email').val('');
                $('#addEmailAction').show();
            },
            error: function(e){
              alert("Unfortunately, we could not add your email at this time.  It's possible that you may have already signed up.  We don't do duplicates!");
              $('#emailMessage').hide();
                $('#addEmailAction').show();
              console.log(e);
            }
        });
    }

    $('#emailMessage').hide();
    $('#addEmailAction').click(function(){
       var email = $('#email').val();
       addEmail(email);
    });
});
