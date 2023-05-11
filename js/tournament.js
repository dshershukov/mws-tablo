function init() {
    
    this.swapedBlocks = false;
    this.leftBlock = document.getElementById('fighter-left');
    this.rightBlock = document.getElementById('fighter-right');
    
    this.authorizeButton = document.getElementById('authorize_button');
    this.signoutButton = document.getElementById('signout_button');
    
    this.mutualHits = document.getElementById('mutualHits');
    this.firstWarnings = document.getElementById('warnings-1');
    this.secondWarnings = document.getElementById('warnings-2');
    this.firstFighterTotalHP = document.getElementById('totalHP-1');
    this.secondFighterTotalHP = document.getElementById('totalHP-2');
    this.firstFighterName = document.getElementById('firstFighterName');//new ComboBox('firstFighterName');
    this.secondFighterName = document.getElementById('secondFighterName');//new ComboBox('secondFighterName');
    this.fileAccessApproved = window.File && window.FileReader && window.FileList && window.Blob;
    if (!this.fileAccessApproved) {
        alert('The File APIs are not fully supported in this browser.');
    }
   this.timerField = document.getElementById('timer');
   this.firstFighter = document.getElementById('firstFighter');
   this.secondFighter = document.getElementById('secondFighter');
   this.roundNumber = document.getElementById('roundNumber');
   this.invert = document.getElementById('invert').checked;
   this.swaped = false;
   this.showRoundNumber = false;//document.getElementById('showRoundNumber').checked;
   this.defaultTimeField = document.getElementById('defaultTime');
   this.listFightersDiv = document.getElementById('listFightersDiv');
   this.audio = new Audio('audio/end_time.mp3');
   this.savedTimes = ["01:30", "01:30", "01:30", "01:30", "01:30", "01:30", "01:30", "01:30", "01:30", "01:30"];
   this.previousTime = null;

   this.hotKeysEnabled = true;

   internalLoadState();
}

function setTextContent(elem, text) {
    elem.innerHTML = "";
    var textContent = document.createTextNode(text);
    elem.appendChild(textContent);
}

function setupFight(key) {
    uploadCurentFight()
    
    this.selectedFight = key;
    let firstFighterName =  this.swaped ? document.getElementById('fight-' + key +'-param-8') : document.getElementById('fight-' + key +'-param-0');
    let firstFighterHP =    this.swaped ? document.getElementById('fight-' + key +'-param-7') : document.getElementById('fight-' + key +'-param-1');
    let firstFighterScore = this.swaped ? document.getElementById('fight-' + key +'-param-6') : document.getElementById('fight-' + key +'-param-2');
    let firstFighterWarn =  this.swaped ? document.getElementById('fight-' + key +'-param-5') : document.getElementById('fight-' + key +'-param-3');
    let mutualHits =        document.getElementById('fight-' + key +'-param-4');
    let secondFighterWarn = this.swaped ? document.getElementById('fight-' + key +'-param-3') : document.getElementById('fight-' + key +'-param-5');
    let secondFighterScore =this.swaped ? document.getElementById('fight-' + key +'-param-2') : document.getElementById('fight-' + key +'-param-6');
    let secondFighterHP=    this.swaped ? document.getElementById('fight-' + key +'-param-1') : document.getElementById('fight-' + key +'-param-7');
    let secondFighterName = this.swaped ? document.getElementById('fight-' + key +'-param-0') : document.getElementById('fight-' + key +'-param-8');
    
    this.firstFighterName.value = firstFighterName.innerText;
    this.secondFighterName.value = secondFighterName.innerText;
    
    setTextContent(this.firstFighterTotalHP, firstFighterHP.innerText);
    setTextContent(this.secondFighterTotalHP, secondFighterHP.innerText);
    
    this.firstFighter.value = firstFighterScore.innerText;
    this.secondFighter.value = secondFighterScore.innerText;;
    
    setTextContent(this.firstWarnings, firstFighterWarn.innerText);
    setTextContent(this.secondWarnings, secondFighterWarn.innerText);
    
    this.mutualHits.value = mutualHits.innerText;
    
    this.timerField.value = this.defaultTimeField.value;
    saveState();
}

function internalLoadState() {
    var state = JSON.parse(window.localStorage.getItem("state"));

    this.firstFighterName.value = "Синий боец";
    this.secondFighterName.value = "Красный боец";
}

function saveState() {
    var state = {
        timer: this.timerField.value,
        firstFighter:         this.swaped ? this.secondFighter.value : this.firstFighter.value,
        firstFighterName:     this.swaped ? this.secondFighterName.value : this.firstFighterName.value,
        firstFighterTotalHP:  this.swaped ? getIntFromDiv(this.secondFighterTotalHP) : getIntFromDiv(this.firstFighterTotalHP),
        secondFighter:        this.swaped ? this.firstFighter.value : this.secondFighter.value,
        secondFighterName:    this.swaped ? this.firstFighterName.value : this.secondFighterName.value,
        secondFighterTotalHP: this.swaped ? getIntFromDiv(this.firstFighterTotalHP) : getIntFromDiv(this.secondFighterTotalHP),
        invert: this.invert,
        roundNumber: this.roundNumber.value,
        showRoundNumber: this.showRoundNumber,
        listFighters: this.listFighters,
    };
    var oldState = window.localStorage.getItem("state");
    window.localStorage.setItem("state", JSON.stringify(state));
    if (this.sw) {
        this.sw.postMessage("ping", "*");
    }
    
    uploadCurentFight();
}

function getIntFromDiv(element) {
    return parseInt(element.innerHTML, 10);
}

/*function saveListFighters() {
    //берём из элемента, парсим, сохраням в списки
    var plainList = this.listFightersDiv.value;
    var list = plainList.split("\n");
    //удаляем все лишниепробельные символы
    list = list.map(function(d) { return d.trim()});
    this.firstFighterName.setItems(list);
    this.secondFighterName.setItems(list);
    this.listFighters = list;
    saveState();
} */

function addFirstWarning(value) {
    var v = parseInt(this.firstWarnings.innerHTML, 10) + value;
    if(v < 0) v = 0;
    setTextContent(this.firstWarnings, v);
    saveState();
}

function addSecondWarning(value) {
    var v = parseInt(this.secondWarnings.innerHTML, 10) + value;
    if(v < 0) v = 0;
    setTextContent(this.secondWarnings, v);
    saveState();
}

function exportListFighters() {
    //сохранить список
}

function changeMutualHits() {
    var mh = parseInt(this.mutualHits.value, 10);
    if(mh < 0) mh = 0;
    this.mutualHits.value = mh;
    saveState();
}

function addMutualHits(dif) {
    var mh = parseInt(this.mutualHits.value, 10) + dif;
    if(mh < 0) mh = 0;
    this.mutualHits.value = mh;
    saveState();
}

function addRoundNumber(dif) {
    var nowRoundNumber = parseInt(this.roundNumber.value, 10);
    this.changeRoundNumber(nowRoundNumber + dif);
}

function changeRoundNumber(score) {
    if(score <= 0) {
        score = 0;
        changeShowRoundNumber(false);
    } else {
        changeShowRoundNumber(true);
    }
    this.roundNumber.value = score;
    saveState();
}

function changeShowRoundNumber(value) {
    this.showRoundNumber = value;//document.getElementById('showRoundNumber').checked;
    saveState();
}

function changeFirstFighter(score, totalHP) {
    this.firstFighter.value = score;
    setTextContent(this.firstFighterTotalHP, totalHP);
    saveState();
}

function addFirst(addScore) {
    var nowScore = parseInt(this.firstFighter.value, 10);
    var totalHP = getIntFromDiv(this.firstFighterTotalHP);
    var newVal = nowScore + addScore
    if(newVal > 0) newVal = 0;
    else totalHP = totalHP + addScore;
    this.changeFirstFighter(newVal, totalHP);
}

function zeroFirst() {
    var nowScore = parseInt(this.firstFighter.value, 10);
    var totalHP = getIntFromDiv(this.firstFighterTotalHP);
    this.changeFirstFighter(0, totalHP - nowScore);
}

function changeSecondFighter(score, totalHP) {
    this.secondFighter.value = score;
    setTextContent(this.secondFighterTotalHP, totalHP);
    saveState();
}

function addSecond(addScore) {
    var nowScore = parseInt(this.secondFighter.value, 10);
    var totalHP = getIntFromDiv(this.secondFighterTotalHP);
    var newVal = nowScore + addScore
    if(newVal > 0) newVal = 0;
    else totalHP = totalHP + addScore;
    this.changeSecondFighter(newVal, totalHP);
}

function zeroSecond() {
    var nowScore = parseInt(this.firstFighter.value, 10);
    var totalHP = getIntFromDiv(this.firstFighterTotalHP);
    this.changeSecondFighter(0, totalHP - nowScore);
}

function addTime(secs) {
    var now = parseTimer();
    var minutes = parseInt(now[0]);
    var seconds = parseInt(now[1]) + secs;
    
    var c = minutes * 60 + seconds;
    minutes = Math.floor(c/60);
    seconds = c%60;
    if(minutes === 0 && seconds <= 0)
        seconds = 1;
    this.setTimerValue(this.formatTime(minutes, seconds));
}

function startTimer() {
    if (!this.timerRun) {
        this.timerRun = setTimeout("continueTimer()", 1000);
    }
    return false;
}

function parseTimer() {
   var reg = /[0-9]{2}[:][0-9]{2}/i;
   var res = this.timerField.value.match(reg);
   if (res) {
     var arr = res[0].split(":");
     return arr;
   }
}

function formatTime(minutes, seconds) {
  var m = minutes + "";
  if (m.length === 1) {
   m = "0" + m;
  }
  var s = seconds + "";
  if (s.length === 1) {
   s = "0" + s;
  }
 return m + ":" + s;
}

function continueTimer() {
  var now = parseTimer();
  if (now) {
   var minutes = parseInt(now[0]);
   var seconds = parseInt(now[1]);
   if (minutes === 0 && seconds === 0) {
       this.stopTimer();
       this.setTimerValue("00:00");
   }
   else {
     var c = minutes * 60 + seconds;
     c--;
     minutes = Math.floor(c/60);
     seconds = c%60;
     this.setTimerValue(this.formatTime(minutes, seconds));
       if (minutes === 0 && seconds === 0) {
           this.audio.play();
       }
     this.timerRun = setTimeout("continueTimer()", 1000);
   }
  } else {
   this.stopTimer();
  }
}

function setTimerValue(value) {
   this.timerField.value = value;
    saveState();
}

function stopTimer() {
    if (this.timerRun) {
        clearTimeout(this.timerRun);
    }
   this.timerRun = null;
}

function resetTimer() {
   this.stopTimer();
   this.setTimerValue(this.defaultTimeField.value);
}


function resetAll() {
   this.resetTimer();
   this.changeFirstFighter(0);
   this.changeSecondFighter(0);
}

function ow() {
    saveState();
    this.sw = window.open("pages/tournamentview.html","view");
}

function invertChange() {
    this.invert = document.getElementById('invert').checked;
    saveState();
}

function changeFighterPlaces() {
    this.swaped = !this.swaped;
    var ffv = this.firstFighter.value;
    var sfv = this.secondFighter.value;
    var ffn = this.firstFighterName.value;
    var sfn = this.secondFighterName.value;
    var ffw = this.firstWarnings.innerHTML;
    var sfw = this.secondWarnings.innerHTML;
    var leftStyle = this.leftBlock.getAttribute("class");
    var rightStyle = this.rightBlock.getAttribute("class");

    this.firstFighter.value = sfv;
    this.firstFighterName.value = sfn;
    this.secondFighter.value = ffv;
    this.secondFighterName.value = ffn;
    setTextContent(this.firstWarnings, sfw);
    setTextContent(this.secondWarnings, ffw);
    this.leftBlock.setAttribute("class", rightStyle);
    this.rightBlock.setAttribute("class", leftStyle);
    
    saveState();
}

function autoScore() {
    let limit = document.getElementById('autoScore').value;
    let firstLimit = limit - this.firstFighter.value;
    let secondLimit = limit - this.secondFighter.value;
    
    let adding = Math.min(Math.abs(firstLimit), Math.abs(secondLimit)) * Math.sign(limit);
    
    addFirst(adding);
    addSecond(adding);
}


function saveTime(slotNumber) {
    this.savedTimes[slotNumber] = this.timerField.value;
}

function restoreTime(slotNumber) {
    this.previousTime = this.timerField.value;
    setTimerValue(this.savedTimes[slotNumber]);
}


function disableHotkeys() {
    this.hotKeysEnabled = false;
}

function enableHotkeys() {
    this.hotKeysEnabled = true;
}

function hotKeys(event) {
    if (!this.hotKeysEnabled) return;
    var kc = event.keyCode || event.charCode;

    if (kc === 43) { // +
        addTime(1);
    }
    if (kc === 45) { // -
        addTime(-1);
    }
    
    if (kc === 113 || kc === 81 || kc === 1081 || kc === 1049) { // Q
        addFirst(1);
    }
    if (kc === 122 || kc === 90 || kc === 1103 || kc === 1071) { // Z
        addFirst(-1);
    }
    if (kc === 119 || kc === 87 || kc === 1094 || kc === 1062) { // W
        addFirstWarning(1);
    }
    if (kc === 120 || kc === 88 || kc === 1095 || kc === 1063) { // X
        addFirstWarning(-1);
    }
    
    if (kc === 114|| kc === 82 || kc === 1082 || kc === 1050) { // R
        addMutualHits(1);
    }
    if (kc === 118 || kc === 86 || kc === 1084 || kc === 1052) { // V
        addMutualHits(-1)
    }
    
    if (kc === 117 || kc === 85 || kc === 1075 || kc === 1043) { // U
        addSecond(1);
    }
    if (kc === 109 || kc === 77 || kc === 1100 || kc === 1068) { // M
        addSecond(-1);
    }
    if (kc === 121 || kc === 89 || kc === 1085 || kc === 1053) { // Y
        addSecondWarning(1);
    }
    if (kc === 110 || kc === 78 || kc === 1090 || kc === 1058) { // N
        addSecondWarning(-1);
    }
    
    if (kc === 91 || kc === 1093 || kc === 1061) {
        addRoundNumber(-1);
    }
    if (kc === 93 || kc === 1098 || kc === 1066) {
        addRoundNumber(1);
    }
    if (kc === 108 || kc === 76 || kc === 1076 || kc === 1044) { // L
        changeFighterPlaces();
    }
    if (kc === 112 || kc === 80 || kc === 1079 || kc === 1047) { // P
        autoScore();
    }

    var save = -1, restore = -1;
    if (kc > 47 && kc < 58) {
        restore = kc - 48;
    }
    save = [41, 33, 64, 35, 36, 37, 94, 38, 42, 40].indexOf(kc);//english
    if (save < 0) {
        save = [41, 33, 34, 84, 59, 37, 58, 63, 42, 40].indexOf(kc);//russian
    }

    if (kc === 26) {
        if (this.previousTime) {
            setTimerValue(this.previousTime);
        }
        this.previousTime = null;
    }

    if (restore > -1) {
        restoreTime(restore);
    }
    if (save > -1) {
        saveTime(save);
    }
    if (kc === 32) {
        if (this.timerRun) {
            stopTimer();
        } else {
            continueTimer();
        }
    }
}
