var category_list, question_list; //DOM

var question_categories = {}; //Question categories loaded from the database

setup();
function setup(){
  //Get DOM stuff
  category_list = document.getElementById('category-list');
  question_list = document.getElementById('question-list');


  var firebaseConfig = {
    apiKey: "AIzaSyApQVhE9fAaXAuVQ8p7Z26Eh5AmngsgrFY",
    authDomain: "ask-interview-questions.firebaseapp.com",
    databaseURL: "https://ask-interview-questions.firebaseio.com",
    projectId: "ask-interview-questions",
    storageBucket: "",
    messagingSenderId: "793004105940",
    appId: "1:793004105940:web:d39dfc6b877c7785"
  };
  firebase.initializeApp(firebaseConfig);
}
//===AUTH===//
/*****|******/
/*****|******/
/*****|******/
/*****\/*****/
firebase.auth().signInAnonymously().catch(function(error) {
  console.log("Code: "+ error.code + "//" + error.message);
  // ...
});
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var uid = user.uid;
    console.log(uid);
    loadCategories();
    // ...
  } else {
    // User is signed out.
    console.log("Signed out");
  }
});

function loadCategories(){              //Load question categories from database
  firebase.database().ref('Questions/').on('value', (snapshot) => {
    question_categories = snapshot;
    category_list.innerHTML = "";
    snapshot.forEach((type) =>{
      category_list.innerHTML += '<option>'+type.key+'</option>';
    });
  });
}

function selectCategory(){
  question_list.innerHTML = ""; //Clear previous list
  let selectedCategory = category_list.options[category_list.selectedIndex].value; //e.g ACADEMIC, MOTIVATION FOR MEDICINE...
  let jsonObject = question_categories.val()[selectedCategory]; //JSON Object with keys(questions' number) and values(actual question)

  for (var prop in jsonObject) {
    //                                    KEY(number)    QUESTION
    question_list.innerHTML += '<option>'+prop+': '+jsonObject[prop]+'</option>';
  }

  //
}

function makeLobby(){
  //TODO Send LOBBY data to database
}