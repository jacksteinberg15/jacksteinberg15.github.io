    /*
    ~~~~~~~~~~~~~~~ Quiz Introduction ~~~~~~~~~~~~~~~~~~
    
    Javascript and Jquery code for the Quiz app written:
    Broken into functions that handle the next button,
    The back button,
    The submit button,
    The Pie Chart,
    and the initial set up
    
    This project relies heavily on jQuery access and 
    modification of HTML Elements in my index.html
    
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */

    //Cop the JSON from browser storage
    //parse it and set the locally accessed one to it
    //Vars for the whole document declared up here
    var qcount = 1;
    var checkeds = ["", "", "", "", "", "", "", "", "", ""];
    //Sample JSON texts, so they load as JSON objects properly
    var text = '{"name":"John Johnson","street":"Oslo West 16","phone":"555 1234567"}';
    var obj = JSON.parse(text);
    var text1 = '{"namesandpws": [], "namesandscores": [], "rawscores": []}';
    var uInfo = JSON.parse(text1);

    //jQuery document ready (Runs on HTML load)
    $(document).ready(function () {
        console.log(text1.length);
        //Hide quiz things and buttons
        $('#quizform').hide();
        $('#backButton').hide();
        $('#nextButton').hide();
        $('#submitButton').hide();
        $('#resultsfrm').hide();
        $('#Swag').hide();
        $('#newUser').hide();
        $('#authBox').hide();

        //Pie Chart sample shenanigans (Setup in case it has to be declared)
        var numright = 4;

        var pieChart = new PieChart("piechart", {
            includeLabels: true,
            data: [(numright / 10) * 360, ((10 - numright) / 10) * 360],
            labels: ["" + numright + "0%", "" + (10 - numright) + "0%"],
            colors: [
                    ["#00FF00", "#00FF00"],
                    ["#FF0000", "#FF0000"]
                ]
        });

        //AJAX shenanigans (Not really working)
        //TODO: Fix this loading
        $.ajaxSetup({
            async: false
        });

        //Snag the questions JSON 
        $.getJSON("QuestionSheet.json", function (response) {
            obj = response;
        });

        //Snag the user info JSON 
        $.getJSON("UserInfo.json", function (response) {
            uInfo = response;
        });

        //Hide the sampled pie chart
        $('#piechart').hide();
    });

    //TODO: get this to load from LS, making sure LS is initialized properly already
    //Method to load the uInfo from LocalStorage
    function fromLocalStorage() {
        /* 
        //TODO: Fix this code below
        var LSstring = localStorage.getItem("PhysQuizUserInfo");
        //Check if this length of LSstring is the proper one
        if (LSstring.length > 58) {
            uInfo = JSON.parse(LSstring);
        } else if (LSstring.length > 58) {
            localStorage.setItem("PhysQuizUserInfo", uInfo.stringify());
        }
        */
    }

    //TODO: add method to store things in local storage
    //Method to store the user info in local storage
    function toLocalStorage() {
        //TODO: add in cases to deal with passwords, scores, and names
        //obj.namesandpws.push("name": "pws");
        //obj.namesandscores.push("name": "scores");
        //obj.rawscores.push("name");

        //Stringify the JSON
        //localStorage.setItem("daJSON", jsonname.stringify());
        //Retrieval localStorage.getItem("lastname");
    }

    //Function to step forward a question
    function stepForward() {
        //First check to see if you've clicked the buttons
        if (checkButtons()) {
            //Delete the extraneous questions
            resetExtraQs();
            //Add to qcount (this increments the current question it's on)
            if (qcount < 10)
                qcount += 1;
            if (qcount > 9) {
                //Swap with submit at the 10th question
                $('#nextButton').hide();
                $('#submitButton').show();
            }
            //show the back button after question one
            if (qcount > 1) {
                $('#backButton').show();
            }
            //Fade in the next set of questions and choices
            $('#question').hide().html(obj.questions[qcount - 1].q).fadeIn(800);
            $('#c11').hide().html(obj.questions[qcount - 1].c[0]).fadeIn(800);
            $('#c21').hide().html(obj.questions[qcount - 1].c[1]).fadeIn(800);
            $('#c31').hide().html(obj.questions[qcount - 1].c[2]).fadeIn(800);
            $('#c41').hide().html(obj.questions[qcount - 1].c[3]).fadeIn(800);
            appendEQS();
            //Set them if previously checked
            setButtons();
        }
    }

    //Function to step backward a question
    function stepBack() {
        //Delete the extraneous questions
        resetExtraQs();
        //Decrement qcount
        if (qcount > 1)
            qcount -= 1;
        //Hide back before question 2
        if (qcount < 2) {
            $('#backButton').hide();
        }
        //Swap next with submit when backtracking
        if (qcount < 10) {
            $('#nextButton').show();
            $('#submitButton').hide();
        }
        //Fade in next questions
        $('#question').hide().html(obj.questions[qcount - 1].q).fadeIn(800);
        $('#c11').hide().html(obj.questions[qcount - 1].c[0]).fadeIn(800);
        $('#c21').hide().html(obj.questions[qcount - 1].c[1]).fadeIn(800);
        $('#c31').hide().html(obj.questions[qcount - 1].c[2]).fadeIn(800);
        $('#c41').hide().html(obj.questions[qcount - 1].c[3]).fadeIn(800);
        appendEQS();
        //Set the buttons if necesary
        setButtons();
    }
    //Check the buttons and their pressed states
    function checkButtons() {
        //Whenever button pressed check which radio button is pressed,
        //store it, then set all the buttons to which one is checked for
        //the next / prev question
        for (i = 0; i < obj.questions[qcount - 1].c.length; i++) {
            if ($('#c' + (i + 1)).prop('checked')) {
                checkeds[qcount - 1] = (i + 1);
                return true
            }
        }
        return false;
    }

    //Set buttons to checked if necesary
    function setButtons() {
        //check to see that it exists
        if (checkeds[qcount - 1] != 0) {
            $('#c' + checkeds[qcount - 1]).prop('checked', true);
        } else {
            //If not, make them all unchecked
            for (i = 0; i < obj.questions[qcount - 1].c.length; i++) {
                $('#c' + (i + 1)).prop('checked', false);
            }
        }
    }

    //function to submit a quiz
    function subQuiz() {
        //Make sure to answer the last question
        if (checkButtons()) {
            var numright = 0;
            //hide other unnecesary frames, and show results
            $('#quizform').hide();
            $('#backButton').hide();
            $('#submitButton').hide();
            $('#resultsfrm').show();
            $('#piechart').show();
            resetExtraQs();

            //remember to deal with color
            for (i = 0; i < 11; i++) {
                //Compare the answer choice chosen to the answer
                if ((obj.questions[i].c[checkeds[i] - 1]).localeCompare(obj.questions[i]['a']) == 0) {
                    $('#r' + (i + 1)).html('<p style=\'color: #00FF00;\'>' + 'Correct' + '</p>');
                    numright += 1;
                } else {
                    $('#r' + (i + 1)).html('<p style=\'color: #FF0000;\'>' + 'Incorrect' + '</p>');
                }

                //Color selection (green vs red)
                if (numright < 7)
                    $('#ratio').html('<h1 style=\'color: #FF0000;\'>' + numright + '/10</h1>');
                else if (numright >= 7)
                    $('#ratio').html('<h1 style=\'color: #00FF00;\'>' + numright + '/10</h1>');
                drawPC(numright);
            }

            //TODO: Add in a case to save the results of the quiz and send it to browser storage
            //TODO: Remember to save both name and score, and just score
        }
    }

    //Draw the pie chart function
    function drawPC(numright) {

        var numsright = numright;

        var pieChart = new PieChart("piechart", {
            includeLabels: true,
            data: [(numsright / 10) * 360, ((10 - numsright) / 10) * 360],
            labels: ["" + numsright + "0%", "" + (10 - numsright) + "0%"],
            colors: [
                    ["#00FF00", "#00FF00"],
                    ["#FF0000", "#FF0000"]
                ]
        });

        pieChart.draw();


    }

    function appendEQS() {
        for (i = 0; i < obj.questions[qcount - 1].c.length - 4; i++) {
            $('#extraqs').append(" <input id = 'c" + (5 + i) + "' type = 'radio' name = 'choices'>" +
                "</input><label id='c" + (5 + i) + "1' for='c" + (5 + i) + "'>Sample Text</label>");
            $('#c' + (5 + i) + '1').hide().html(" " + obj.questions[qcount - 1].c[4 + i]).fadeIn(800);
            $('#extraqs').append("<br><br/>");
        }
    }

    function resetExtraQs() {
        $('#extraqs input').remove();
        $('#extraqs label').remove();
        $('#extraqs br').remove();
    }

    //TODO: Handle authentication of username and password
    //Do so by loading the local storage into a JSON and checking it for matches
    function authenticate(uName, pWord, type) {
        if (type.localeCompare("create") == 0) {
            //TODO: V~Below This~V
            //Load the local storage using the fromLocalStorage method
            //Check if the name passed in by uName is in the JSON
            //Do so by assuming it's a key and checking if it's value pair gives null
            //Return true if it doesn't exist, false if it exists
            return false;
        } else if (type.localeCompare("check") == 0) {
            //TODO: V~Below This~V
            //Load the local storage using the fromLocalStorage method
            //Check if the name passed in by uName is in the JSON
            //Do so by assuming it's a key and checking if it's value pair gives null
            //Return true if it exists, false if it doesn't exist
            return false;
        }
    }

    //Setup conditions for another user creation screen
    function createUser() {
        $('#nameform').hide();
        $('#authBox').hide();
        $('#newUser').show();
    }

    //TODO: create a username and password and bump it to local storage
    //TODO: check if the username already exists
    function saveUser() {
        //Snag the requested username and password combo
        var username = document.getElementById("fnn");
        var unn = "" + username.value + "";

        var password = document.getElementById("pwn");
        var pwn = "" + password.value + "";

        //Check that the password and username are defined and not taken
        if (pwn.length >= 1 && unn.length >= 1 && authenticate(unn, pwn, "create")) {
            //TODO: Push the username and password to uInfo
            //TODO: Push that to local storage
            //TODO: Hide and show proper boxes
            $('#newUser').hide();
            $('#authBox').hide();
            $('#nameform').show();
        } else {
            //If authentication fails throw this error message
            $('#authBox').show();
            $('#authText').html("New user creation attempt failed: Username/Password is invalid or taken");
        }
    }

    //To snag the name and hide its form
    //Basically an initial setup for the forms
    function subName() {
        //Snag the name
        var firstName = document.getElementById("fn");
        var enteredPass = document.getElementById("pw");
        var text = "" + firstName.value + "" + "'s Quiz";
        var pureName = "" + firstName.value;
        var pass = "" + enteredPass.value;

        //Authenticate username and password
        if (authenticate(pureName, pass, "check")) {
            //Hide the name things and show the Buttons
            $("Name").html(text);
            $('#name_submission').hide();
            $('#quizform').show();
            $('#nextButton').show();
            $('#question').hide().html(obj.questions[0].q).fadeIn(800);
            $('#c11').hide().html(obj.questions[0].c[0]).fadeIn(800);
            $('#c21').hide().html(obj.questions[0].c[1]).fadeIn(800);
            $('#c31').hide().html(obj.questions[0].c[2]).fadeIn(800);
            $('#c41').hide().html(obj.questions[0].c[3]).fadeIn(800);
            appendEQS();
        } else {
            //If authentication fails throw this error message
            $('#authBox').show();
            $('#authText').html("Login attempt failed: Username or Password is incorrect");
        }
    }