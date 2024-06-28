const firebaseConfig = {
    apiKey: "AIzaSyBJ14y9JlbSn8NQjB8-9_KzQ8Up1cONBrg",
    authDomain: "quiz-test-13d0f.firebaseapp.com",
    projectId: "quiz-test-13d0f",
    storageBucket: "quiz-test-13d0f.appspot.com",
    messagingSenderId: "711795204398",
    appId: "1:711795204398:web:8df71b42074ff7872c1abf",
    measurementId: "G-1K4277B488",
    databaseURL: "https://quiz-test-13d0f-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const databse = firebase.database();

var userId = sessionStorage.getItem("userId");
console.log(userId);
//selecting all required elements
const start_box = document.querySelector(".start_box");
const start_btn = document.querySelector(".start_box .buttons .start");
const exit_btn = start_box.querySelector(".start_box .buttons .quit");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const waitTxt = document.querySelector(".result_box .wait_text");

let userAnswers = [];

databse.ref("/Candidates/" + userId + "/Answers").on('value', (snapshot) => {
    const data = snapshot.val();
    if (data === null || data.length === 0) {
        document.querySelector(".start_box").classList.add("activeInfo");
    } else {
        showResult(false);
    }
});

// if exitQuiz button clicked
exit_btn.onclick = () => {
    // info_box.classList.remove("activeInfo"); //hide info box
    window.close();
};

// if continueQuiz button clicked
start_btn.onclick = () => {
    start_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.add("activeQuiz"); //show quiz box
    showQuestions(0); //calling showQestions function
    queCounter(1); //passing 1 parameter to queCounter
    startTimer(questions[0].timeout); //calling startTimer function
    startTimerLine(questions[0].timeout); //calling startTimerLine function
};

let timeValue = 30;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const quit_quiz = result_box.querySelector(".buttons .quit");
const matchingData = document.querySelector(".matching-data");

// if quitQuiz button clicked
quit_quiz.onclick = () => {
    window.close();
};

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = () => {
    finishQuestion(que_count);
    
    if (que_count < questions.length - 1) {
        //if question count is less than total question length
        que_count++; //increment the que_count value
        que_numb++; //increment the que_numb value
        showQuestions(que_count); //calling showQestions function
        queCounter(que_numb); //passing que_numb value to queCounter
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        startTimer(questions[que_count].timeout); //calling startTimer function
        startTimerLine(questions[que_count].timeout); //calling startTimerLine function
        timeText.textContent = "Time Left"; //change the timeText to Time Left
        next_btn.classList.remove("show"); //hide the next button
    } else {
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        showResult(); //calling showResult function
    }
};

function finishQuestion(index) {
    const question = questions[index];
    let answer = ""
    if (question.type === 'input') {
        answer = option_list.querySelectorAll(".input")[0].value;
    } else {
        answer = option_list.querySelectorAll(".option.correct")[0].textContent;
    }

    userAnswers.push({ question: question.question, answer: answer });
}

// getting questions and options from array
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    const type = questions[index].type;

    let que_tag = "<span>" + (index + 1) + ". " + questions[index].question + "</span>";

    if (type === 'option') {
        //creating a new span and div tag for question and option and passing the value using array index
        let option_tag = '';
        questions[index].options.forEach(opt => {
            option_tag += '<div class="option"><span>' + opt + "</span></div>"
        });
        
        option_list.innerHTML = option_tag; //adding new div tag inside option_tag
        
        const option = option_list.querySelectorAll(".option");
        
        // set onclick attribute to all available options
        for (i = 0; i < option.length; i++) {
            option[i].setAttribute("onclick", "optionSelected(this)");
        }
    } else if (type === 'input') {
        let input_tag = '<textarea class="input"></textarea>'
        option_list.innerHTML = input_tag;

        const textarea = option_list.querySelectorAll(".input");
        for (let i = 0; i < textarea.length; i++) {
            textarea[i].setAttribute("oninput", "answerChanged(this)");
        }
    }

    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
}
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(selectedOption) {
    const allOptions = option_list.children.length; //getting all option items

    for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.remove("correct"); //once user select an option then disabled all options
    }

    selectedOption.classList.add("correct"); //adding green color to correct selected option

    next_btn.classList.add("show"); //show the next button if user selected any option
}

// if user input answer on the textarea
function answerChanged(textarea) {
    const answer = textarea.value;
    if (answer.length > 0) {
        next_btn.classList.add("show");
    } else {
        next_btn.classList.remove("show");
    }
}

function showResult(submitAnswers = true) {
    start_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");

    let scoreTag = "<span>Thank you for submitting your answers. We will get back to you shortly.</span>";
    scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text

    if (submitAnswers) {
        databse
            .ref("/Candidates/" + userId + "/Answers")
            .set(userAnswers)
            .then((res) => {
                console.log(res);
                userAnswers = [];
            })
            .catch((error) => console.log(error));
    }
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if (time < 9) {
            //if timer is less than 9
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if (time < 0) {
            //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Time Off"; //change the time text to time off
            const allOptions = option_list.children.length; //getting all option items
            for (i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
            userAnswers.push({ question: questions[que_count].question, answer: "" }); //getting correct answer from array
            next_btn.classList.add("show"); //show the next button if user selected any option
        }
    }
}

function startTimerLine(time) {
    const step = 800 / (time + 1) / 50;
    let width = 0;

    counterLine = setInterval(timer, 20);
    function timer() {
        width += step; //upgrading time value with 1
        time_line.style.width = width + "px"; //increasing width of time_line with px by time value
        if (width >= 800) {
            clearInterval(counterLine); //clear counterLine
        }
    }
}

function queCounter(index) {
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag =
        "<span><p>" +
        index +
        "</p> of <p>" +
        questions.length +
        "</p> Questions</span>";
    bottom_ques_counter.innerHTML = totalQueCounTag; //adding new span tag inside bottom_ques_counter
}

