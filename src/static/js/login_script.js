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
const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");
const signupEmailIn = document.getElementById("email-signup");
const linkedInAccIn = document.getElementById("linkedin-acc");
const fbAccIn = document.getElementById("facebook-acc");
const xAccIn = document.getElementById("twitter-acc");
const portfolioIn = document.getElementById("portfolio-acc");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById(
    "confirm-password-signup"
);
const createacctbtn = document.getElementById("create-acct-btn");
const forgetBtn = document.querySelector(".forget-btn");

// const returnBtn = document.getElementById("return-btn");

var email,
    password,
    signupEmail,
    signupPassword,
    confirmSignUpPassword,
    userId;

createacctbtn.addEventListener("click", function () {
    var isVerified = true;
    signupEmail = signupEmailIn.value;

    signupPassword = signupPasswordIn.value;
    confirmSignUpPassword = confirmSignUpPasswordIn.value;
    if (signupPassword != confirmSignUpPassword) {
        window.alert("Password fields do not match. Try again.");
        isVerified = false;
    }

    if (
        signupEmail == null ||
        signupPassword == null ||
        confirmSignUpPassword == null
    ) {
        window.alert("Please fill out all required fields.");
        isVerified = false;
    }

    if (isVerified) {
        auth
            .createUserWithEmailAndPassword(signupEmail, signupPassword)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...
                console.log("Success! Account created.");
                sessionStorage.setItem("userId", auth.currentUser.uid);
                // console.log(auth.currentUser.uid);
                databse
                    .ref("/Candidates/" + auth.currentUser.uid)
                    .set({
                        Basic_info: {
                            email_id: signupEmail,
                            social: {
                                LinkedIn: linkedInAccIn.value,
                                Facebook: fbAccIn.value,
                                X: xAccIn.value,
                            },
                            portfolio: portfolioIn.value
                        },
                        Answers: []
                    })
                    .then((res) => {
                        console.log("Data added to database.");
                        location.replace("./start.html");
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                console.log(errorMessage);
                window.alert("Error occurred. ", errorMessage);
            });
    }
});

submitButton.addEventListener("click", function () {
    email = emailInput.value;
    password = passwordInput.value;
    auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            sessionStorage.setItem("userId", auth.currentUser.uid);
            console.log("Success! Welcome back!");
            // window.alert("Success! Welcome back!");
            location.replace("./start.html");
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            window.alert("Error occurred. ErrorCode ", errorCode);
        });
});

// reseting password
forgetBtn.addEventListener("click", function () {
    email = emailInput.value;
    auth
        .sendPasswordResetEmail(email)
        .then(() => {
            window.alert("Password reset email sent, check your inbox. ");
        })
        .catch((error) => {
            window.alert(error);
        });
});
