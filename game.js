var attemptNumber = 0;
var foundPairNumber = 0;
var lastSelected = new Array();
var gridSize = 16;
/*
    gridTab: Contient les ImageId de chaque image
        -> [index]: image.id -> id HTML de l'élément
 */
var gridTab = new Array();
var delay = 800;
var currentTime;
var timer;
var isSecondClick = false;
//var numberOfClicks = 0; // BUG : multiples clics rapides sur différentes images

window.onload = function(){
    createGridTab();
    createTimer();
    displayInformations();
}

function createGridTab() {
    hydrateGridTab();
    shuffleArray(gridTab);
}

function hydrateGridTab() {
    for(var i = 0; i < gridSize; i++) {
        var imageId = i+1;
        if (imageId > gridSize/2) imageId -= gridSize/2;
        gridTab.push(imageId);
    }
}

function createTimer() {
    currentTime = 0;
    timer = setInterval(function(){
        currentTime++;
        displayInformations();
    }, 1000);
}

function shuffleArray(array) {
    var j = 0;
    var A, B;
    var i = array.length - 1;
    while(i > -1) {
        j = Math.floor(Math.random() * i);
        A = array[i];
        B = array[j];
        array[i] = B;
        array[j] = A;
        i = i - 1;
    }
}

function ImageSelected(image) {
    //showDebugGridTab(); // DEBUG !
    displayInformations(); // DEBUG !
    if (!image.isLocked) {
        //numberOfClicks++;
        //displayInformations(); // DEBUG !
        //if (numberOfClicks<=2) {
        //displayInformations(); // DEBUG !
        if (!image.hasOwnProperty('isHidden')) image.isHidden = true; // Pas réussi à coller l'attribut à la classe autrement
        image.isHidden? showImage(image) : hideImage(image);
        processImage(image);
        //}
    }
}

function showImage(image) {
    addGreenBorderClass(image);
    image.isHidden = false;
    image.src = getImageSrc(gridTab[image.id]);
}

function hideImage(image) {
    restoreClasses(image);
    image.isHidden = true;
    image.src = getImageSrc('QuestionMark');
}

function getImageSrc(imageId) {
    return 'img/Image'+imageId+'.jpg';
}

function processImage(image) {
    lastSelected.push(gridTab[image.id]);
    //showDebugMsg("Pushed in lastSelected : "+gridTab[image.id].toString()); // DEBUG !
    lockImage(image);
    //showDebugLastSelected(); // DEBUG !
    isSecondClick? findPair(image) : isSecondClick = true;
}

function findPair(image) {
    attemptNumber++;
    if (lastSelected.length > 0) {
        for (var i = foundPairNumber*2; i < lastSelected.length-1; i++) {
            if(lastSelected[i] == gridTab[image.id]) {
                PairFound(image);
                return gridTab[image.id];
            }
        }
        NoPairFound(image);
    }
    return null;
}

function PairFound(image) {
    //alert('Pair found !'); // DEBUG !
    foundPairNumber++;
    isSecondClick = false;
    //numberOfClicks = 0;
    displayInformations();
    checkEndOfGame();
}

function NoPairFound(image) {
    lastSelected.pop();
    var image2 = findSecondImageElementByImageId(lastSelected[lastSelected.length-1]);
    lastSelected.pop();
    setTimeout(function(){
        restoreClasses(image);
        unlockImage(image);
        hideImage(image);
        //showDebugMsg("Popped"); // DEBUG !
        //showDebugLastSelected();
        restoreClasses(image2);
        unlockImage(image2);
        hideImage(image2);
        //showDebugMsg("Popped"); // DEBUG !
        //showDebugLastSelected(); // DEBUG !
    }, delay);
    displayInformations();
    isSecondClick = false;
    //numberOfClicks = 0;
}

function findSecondImageElementByImageId(imageId) {
    for (var i = 0; i < gridSize; i++) {
        if (gridTab[i] == imageId) {
            var image = document.getElementById(i.toString())
            if (image.isLocked) {
                return document.getElementById(i.toString());
            }
        }
    }
    return null;
}

function lockImage(image) {
    image.isLocked = true;
}

function unlockImage(image) {
    image.isLocked = false;
}

function addGreenBorderClass(image) {
    saveCurrentClasses(image);
    image.className += " green-border";
}

function saveCurrentClasses(image) {
    image.oldClassName = image.className;
}

function restoreClasses(image) {
    image.className = image.oldClassName;
}

function checkEndOfGame() {
    if (foundPairNumber == gridSize/2) {
        clearInterval(timer);
        alert('You win in '+currentTime+ 's, in '+attemptNumber+ ' attempts, congratulations !');
    }
}

function reset() {
    gridTab = new Array();
    createGridTab();
    lastSelected = new Array();
    for (var i = 0; i < gridSize; i++) {
        var image = document.getElementById(i.toString());
        image.src = getImageSrc("QuestionMark");
        restoreClasses(image);
        unlockImage(image);
    }
    clearInterval(timer);
    createTimer();
    attemptNumber = 0;
    foundPairNumber = 0;
    isSecondClick = false;
    displayInformations();
}

function displayInformations() {
    var informations = document.getElementById("informations-display");
    informations.innerHTML = "Pair(s) found : "+foundPairNumber;
    informations.innerHTML += "<br>Attempt number : "+attemptNumber;
    informations.innerHTML += "<br>Time : "+currentTime+" s";
}

function showDebugLastSelected() {
    var debug = "";
    for (var i = 0; i < lastSelected.length; i++) debug += lastSelected[i];
    if (debug=='') debug = "Vide";
    document.getElementById("informations").innerHTML += '<br>'+debug;
}

function showDebugMsg(msg) {
    document.getElementById("informations").innerHTML += '<br>'+msg;
}

function showDebugGridTab() {
    var infos = document.getElementById("informations");
    for(var i = 0; i < gridTab.length; i++) {
        if (i==0) infos.innerHTML += '<br>';
        if (i==4) infos.innerHTML += '<br>';
        if (i==8) infos.innerHTML += '<br>';
        if (i==12) infos.innerHTML += '<br>';
        infos.innerHTML += ''+gridTab[i]+' ';
    }
}