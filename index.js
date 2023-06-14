import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "Use your firebase DB link"
}

// Defining variables
let mode = false;
let lastTapTime = 0;
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const discardListInDB = ref(database, "discardList")

const delButtonEl = document.getElementById("del-button")
const discardListEl = document.getElementById("discard-list")
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const darkModeBtn = document.getElementById("dark")
const theme = document.getElementById("dlmode")

//Add and Discard Buttons
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue.length > 0) {
    push(shoppingListInDB, inputValue)}
    clearInputFieldEl()
})
delButtonEl.addEventListener("click", function() {
    discardListEl.innerHTML = ""
    let exactLocationOfItemInDB = ref(database, `discardList`)
    remove(exactLocationOfItemInDB)
})

// Functions to update Lists
// onValue() is called every time data is changed at the specified database reference, including changes to children.
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (const element of itemsArray) {
            let currentItem = element
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = `<li class="listItem">No items here...</li>`
    }
    if(mode){
        darkMode()
    }
    else{
        lightMode()
    }
})
onValue(discardListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        discardListEl.innerHTML = ""
        
        for (const element of itemsArray) {
            let currentItem = element
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToDiscardListEl(currentItem)
        }    
    } else {
        discardListEl.innerHTML = ""
    }
    if(mode){
        darkMode()
    }
    else{
        lightMode()
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}
function appendItemToDiscardListEl(item){
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.setAttribute("class","discardItem")
    newEl.textContent = itemValue
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `discardList/${itemID}`)
        push(shoppingListInDB,itemValue)
        remove(exactLocationOfItemInDB)
    })
    newEl.addEventListener("touchend", function(event) {
        const currentTime = new Date().getTime();
        const tapTimeDiff = currentTime - lastTapTime;
      
        if (tapTimeDiff < 300) {
            let exactLocationOfItemInDB = ref(database, `discardList/${itemID}`)
        push(shoppingListInDB,itemValue)
        remove(exactLocationOfItemInDB)
          lastTapTime = 0;
        } else {
          lastTapTime = currentTime;
        }
        event.preventDefault();
      });
    discardListEl.append(newEl)
}
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.setAttribute("class","listItem")
    newEl.textContent = itemValue
    
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        push(discardListInDB,itemValue)
        remove(exactLocationOfItemInDB)
    })
    newEl.addEventListener("touchend", function(event) {
        const currentTime = new Date().getTime();
        const tapTimeDiff = currentTime - lastTapTime;
      
        if (tapTimeDiff < 300) {
            let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
            push(discardListInDB,itemValue)
            remove(exactLocationOfItemInDB)
          lastTapTime = 0;
        } else {
          lastTapTime = currentTime;
        }
      
        event.preventDefault();
      });
    
    shoppingListEl.append(newEl)
}

// Functions to change between light and dark modes
function darkMode(){
    mode = true
    let allDivs = document.querySelectorAll('div');
    let body = document.querySelectorAll('body');
    let image = document.getElementById('imgLogo');
    let dmode = document.getElementById("dlmode");
    let dkbtn = document.getElementById("dark");
    let iput = document.getElementById("input-field");
    let lis = document.getElementsByClassName('listItem');
    let dlis = document.getElementsByClassName('discardItem');
    let adbtn = document.getElementById('add-button');
    let dlbtn = document.getElementById('del-button');
    
    adbtn.style['background-color'] = '#FFECC7';
    dlbtn.style['background-color'] = '#FFECC7';
    adbtn.style['color'] = '#5c3d2e';
    dlbtn.style['color'] = '#5c3d2e';
    iput.style['background-color'] = '#5c3d2e';
    iput.style['color'] = '#FFECC7';
    dkbtn.style['background-color'] = '#5c3d2e';
    dkbtn.style['color'] = '#FFECC7';
    dmode.textContent = "light_mode"
    image.setAttribute("src","Dark.png")
    body[0].style['background-color'] = '#2d2424';

    for(const element of allDivs){
    element.style['background-color'] = '#2d2424';
    element.style['color'] = '#5c3d2e';
    }
    for(const element of lis){
        element.style['background-color'] = '#5c3d2e';
        element.style['color'] = '#FFECC7';
        }
    for(const element of dlis){
        element.style['background-color'] = '#3b271d';
        element.style['color'] = '#FFECC7';
        }
}
function lightMode(){
    mode = false
    let allDivs = document.querySelectorAll('div');
    let body = document.querySelectorAll('body');
    let image = document.getElementById('imgLogo');
    let dmode = document.getElementById("dlmode");
    let dkbtn = document.getElementById("dark");
    let iput = document.getElementById("input-field")
    let lis = document.getElementsByClassName('listItem');
    let dlis = document.getElementsByClassName('discardItem');
    let adbtn = document.getElementById('add-button');
    let dlbtn = document.getElementById('del-button');
    
    adbtn.style['background-color'] = '#5c3d2e';
    dlbtn.style['background-color'] = '#5c3d2e';
    adbtn.style['color'] = '#FFECC7';
    dlbtn.style['color'] = '#FFECC7';
    iput.style['background-color'] = '#ffffff';
    iput.style['color'] = '#5c3d2e';
    dkbtn.style['background-color'] = '#FFECC7';
    dkbtn.style['color'] = '#5c3d2e';
    dmode.textContent = "dark_mode"
    body[0].style['background-color'] = '#F9FBE7';
    image.setAttribute("src","Light.png")

    for(const element of allDivs){
    element.style['background-color'] = '#F9FBE7';
    element.style['color'] = 'black';
    }
    for(const element of lis){
        element.style['background-color'] = '#FFFDFF';
        element.style['color'] = '#5c3d2e';
        }
    for(const element of dlis){
        element.style['background-color'] = '#e0c097';
        element.style['color'] = '#5c3d2e';
        }
}

// Dark Mode Button event
darkModeBtn.addEventListener("click",function(){
    if (!mode){
        darkMode();
    }
    else{
        lightMode();
    }
})
// Input field ENTER key detection
inputFieldEl.addEventListener("keypress", function(event) {
    const keyCode = event.keyCode || event.which;
    if (keyCode === 13) {
        let inputValue = inputFieldEl.value
        if (inputValue.length > 0) {
        push(shoppingListInDB, inputValue)}
        clearInputFieldEl()
    }
  });

 