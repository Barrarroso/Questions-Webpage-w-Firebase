//===DOM===//
//CONTAINERS(div)//
var input_name_container, main_menu_container, lobby_question_container, lobby_host_container;

//FIELDS(inputs)//
var username_field, lobby_id_field;
var category_list, question_list;

//INFO TO THE USER//
var lobby_id_info;

//FIREBASE(BACKEND) STUFF//
var question_categories = {}; //Question categories loaded from the database

var myUsername; //Just a string
var myUser = {}, lobbyKey; //'Lobby key' stores the key from a created lobby that you're the host of

setup();
function setup(){
  //Get DOM stuff
  input_name_container = document.getElementById('input-name-container');
  main_menu_container = document.getElementById('main-menu-container');
  lobby_question_container = document.getElementById('lobby-question-container');
  lobby_host_container = document.getElementById('lobby-host-container');

  username_field = document.getElementById('username-field');
  lobby_id_field = document.getElementById('lobby-id-field');

  category_list = document.getElementById('category-list');
  question_list = document.getElementById('question-list');

  lobby_id_info = document.getElementById('lobby-id-info'); 

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
    myUser = user; //Save user params to global variable
    loadCategories();
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

  for (let prop in jsonObject) {
    //                                    KEY(number)    QUESTION
    question_list.innerHTML += '<option>'+prop+': '+jsonObject[prop]+'</option>';
  }
}

function submitUsername(){ //Saves username with ID to the database
  console.log("Username submitted");
  myUsername = username_field.value;
  firebase.database().ref('Users/'+myUser.uid).set({
    username: myUsername
  });
  
  setMainMenuView();
}

//TODO get URL params and join e.g.
//https://barrarroso.github.io/Questions-Webpage-w-Firebase?lobbyID=-LmBo3BisMgY25mrbDJg
function joinLobby(lobbyID = lobby_id_field.value){ //Get field value by default 
  console.log("Joining Lobby WIP");
  //setGuestLobbyView();
}

function makeLobby(){
  let userId = myUser.uid; //TODO This shouldn't be necessary
  let data = {
    host: userId,
    users:{
      userId: myUsername
    },
    question:""
  };
  lobbyKey = firebase.database().ref('Lobby/').push(data).key; //Key gets saved to public variable to access later
  console.log("Your lobby key is: " + lobbyKey);
  lobby_id_info.innerHTML = "Key: " + lobbyKey;
  setHostLobbyView();
}

function submitQuestion(){ //Host of the lobby clicks submit button after selecting a question
  let question = question_list.value; 
  //TODO Send data to database
}

function copyLobbyKeyToClipboard(){ //TODO?? Use clipboardjs.com library instead
  let copy_to_clipboard = document.getElementById('copy-to-clipboard');
  copy_to_clipboard.value = lobbyKey;
  show(copy_to_clipboard);
  copy_to_clipboard.select();
  document.execCommand("copy");
  hide(copy_to_clipboard);
}

function setMainMenuView(){
  hideAll();
  show(main_menu_container);
}

function setGuestLobbyView(){ //Lobby view and you're not the host
  hideAll();
  show(lobby_question_container);
}

function setHostLobbyView(){ //Lobby view and you're the host
  hideAll();
  show(lobby_question_container);
  show(lobby_host_container);
}

//These functions change the display of a DOM component to make it visible or not

function hideAll(){ //CHECK-----Update this for every container that is added to the application
  hide(input_name_container);
  hide(main_menu_container);
  hide(lobby_question_container);
  hide(lobby_host_container);
}

function hide(component){
  component.style.display = 'none';
}

function show(component){
  component.style.display = 'block'; //More display modes besides block may be required in the future
}