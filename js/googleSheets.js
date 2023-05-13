var savedFights = [];
var currentFightList;

//Сдвиги для получения данных из строчек таблицы, нумерация начинается с 0 (B1 в строчке)
var GLOBAL_LEFT_SHIFT =     0;
var FIGHTER_1_NAME =        GLOBAL_LEFT_SHIFT + 8;
var FIGHTER_1_HP =          GLOBAL_LEFT_SHIFT + 7;
var FIGHTER_1_SCORE =       GLOBAL_LEFT_SHIFT + 6;
var FIGHTER_1_WARNINGS =    GLOBAL_LEFT_SHIFT + 5;
var MUTUAL_HITS =           GLOBAL_LEFT_SHIFT + 4;
var FIGHTER_2_WARNINGS =    GLOBAL_LEFT_SHIFT + 3;
var FIGHTER_2_SCORE =       GLOBAL_LEFT_SHIFT + 2;
var FIGHTER_2_HP =          GLOBAL_LEFT_SHIFT + 1;
var FIGHTER_2_NAME =        GLOBAL_LEFT_SHIFT + 0;;
//Границы загрузки строчек таблицы, нумерация начинается с B1 (0 в возврщанмом масиве)
var FIRST_ROW =             3;
var LAST_ROW =              100;
//Границы загрузки столбцов таблицы
var FIRST_COLUMN =          'B';
var LAST_COLUMN =           'N';

//var CLIENT_ID = '948936341002-pcus1hp6ubiibjogkqjq1qnsdjh3scoo.apps.googleusercontent.com';
//var API_KEY = 'AIzaSyCle84La1X3DhTx2hZYUwHj86jIYVhyq4Q';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);

}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        this.authorizeButton.style.display = 'none';
        this.signoutButton.style.display = 'block';
    } else {
        this.authorizeButton.style.display = 'block';
        this.signoutButton.style.display = 'none';
    }
}

/**
  *  Sign in the user upon button click.
  */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
  *  Sign out the user upon button click.
  */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}


/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
	gapi.client.init({
        //apiKey: API_KEY,
        //clientId: CLIENT_ID,
		apiKey: this.apiKey.value,
        clientId: this.clientID.value,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
/*        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()
        this.authorizeButton.onclick = handleAuthClick;
        this.signoutButton.onclick = handleSignoutClick;
        if (isSignedIn) {
            console.log("signed");
        } else {
            console.log("not signed");
        }
        
        updateSigninStatus(isSignedIn);*/
        
        var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()
        if (!isSignedIn) {
            console.log("not signed");
            gapi.auth2.getAuthInstance().signIn()
        }
        console.log("signed");
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

function loadLists() {
    var params = {
        spreadsheetId: this.spreadsheetId.value, 
        ranges: [], includeGridData: false,
    };

    var request = gapi.client.sheets.spreadsheets.get(params);
    request.then(function(response) {
        var sheets = response.result.sheets;
        var selectList = document.getElementById("sheetName");
    
        while (selectList.firstChild) {
            selectList.removeChild(selectList.lastChild);
        }
        //Create and append the options
        for (var i = 0; i < sheets.length; i++) {
            var option = document.createElement("option");
            option.value = sheets[i].properties.title;
            option.text = sheets[i].properties.title;
            selectList.appendChild(option);
        }
    }, function(reason) {
        alert('error: ' + reason.result.error.message);
        console.error('error: ' + reason.result.error.message);
        return;
    });
    
    loadFights();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var loadedFights = document.getElementById('loadedFights');
    var textContent = document.createTextNode(message);
    loadedFights.appendChild(textContent);
}

function clearAppended() {
    var loadedFights = document.getElementById('loadedFights');
    loadedFights.innerHTML = "";
}

//    https://docs.google.com/spreadsheets/d/1T6UMclScWRa_kj-bprhZ6xIXt6jHVzbsyeIzHMfushE/edit#gid=0


/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
 
function addFightRow(loadedFights, key, values) {
    let fight = document.createElement('div');
    fight.setAttribute('class', 'fight-div')
            
    let btn = document.createElement('div');
    btn.setAttribute('class', 'btn btn-default fight-btn select-fight-btn');
    btn.setAttribute('data-dismiss', 'modal')
    btn.setAttribute('onClick', 'setupFight(' + key +')')
    let btnTextContent = document.createTextNode('Выбрать бой');
    btn.appendChild(btnTextContent);
                
    let descr = document.createElement('div');
    descr.setAttribute('class', 'fight-descr-div');
    for(var k=0; k<values.length; ++k) {
        let val = document.createElement('div');
        val.setAttribute('class', 'fight-descr-val fight-descr-val-' + k);
        val.appendChild(document.createTextNode(values[k]));
        val.setAttribute('id', 'fight-' + key +'-param-' + k);
        descr.appendChild(val);
    }
                
    fight.appendChild(btn);
    fight.appendChild(descr);
    loadedFights.appendChild(fight);    
}
 
function loadSheet(spreadsheet, sheetName) {
        gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheet,
        range: sheetName + '!' + FIRST_COLUMN + FIRST_ROW + ':' + LAST_COLUMN + LAST_ROW ,
    }).then(function(response) {
        loadedFights = document.getElementById('loadedFights');
        var range = response.result;
        if (range.values.length > 0) {
            let validName1 = '';
            let validName2 = '';
            var createdRows = 0;
            for (i = 0; i < range.values.length; i++) {
                let row = range.values[i];
                let fighter1Name =      row[FIGHTER_1_NAME]
                let fighter1HP =        row[FIGHTER_1_HP]
                let fighter1Score =     row[FIGHTER_1_SCORE]
                let fighter1Warnings =  row[FIGHTER_1_WARNINGS]
                let mutualHits =        row[MUTUAL_HITS]
                let fighter2Warnings =  row[FIGHTER_2_WARNINGS]
                let fighter2Score =     row[FIGHTER_2_SCORE]
                let fighter2HP =        row[FIGHTER_2_HP]
                let fighter2Name =      row[FIGHTER_2_NAME]
                
                if(fighter1Name != '' && fighter1Name != undefined)
                    validName1 = fighter1Name;
                if(fighter2Name != '' && fighter2Name != undefined)
                    validName2 = fighter2Name;
                    
                if(fighter1Name == '' || fighter1Name == undefined)
                    fighter1Name = validName1;
                if(fighter2Name == '' || fighter2Name == undefined)
                    fighter2Name = validName2;
                    
                let values = [fighter1Name, fighter1HP, fighter1Score, fighter1Warnings, mutualHits, fighter2Warnings, fighter2Score, fighter2HP, fighter2Name];
                values.forEach(function(item, i) { if (item == '' || item == undefined) values[i] = 0; });
                addFightRow(loadedFights, i, values);
                createdRows++;
            }
/*            if(sheetName =="Финал" && createdRows % 3 == 1) {
                addFightRow(loadedFights, range.values.length, [validName1, 0, 0, 0, 0, 0, validName2]);
                addFightRow(loadedFights, range.values.length + 1, [validName1, 0, 0, 0, 0, 0, validName2]);
            }
            else if(sheetName =="Финал" && createdRows % 3 == 2) {
                addFightRow(loadedFights, range.values.length, [validName1, 0, 0, 0, 0, 0, validName2]);
            }*/
        } else {
            appendPre('No data found.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}
    
    
function loadFights() {
    if(savedFights.length != 0)
        return;
    clearAppended();
    if(currentFightList != this.sheetName.value) {
        this.selectedFight = undefined;
        currentFightList = this.sheetName.value;
    }
    loadSheet(this.spreadsheetId.value, this.sheetName.value)
}

function getCurrentFightStats() {
    return {
        sheet : this.sheetName.value,
        key : this.selectedFight,
        fighter1Name :          this.swaped ? this.secondFighterName.value : this.firstFighterName.value,
        fighter1HP :            this.swaped ? this.secondFighterTotalHP.innerHTML : this.firstFighterTotalHP.innerHTML,
        fighter1Score :         this.swaped ? this.secondFighter.value : this.firstFighter.value,
        fighter1Warnings :      this.swaped ? this.secondWarnings.innerHTML : this.firstWarnings.innerHTML,
        mutualHits :            this.mutualHits.value,
        fighter2Warnings :      this.swaped ? this.firstWarnings.innerHTML : this.secondWarnings.innerHTML,
        fighter2Score :         this.swaped ? this.firstFighter.value : this.secondFighter.value,
        fighter2HP :            this.swaped ? this.firstFighterTotalHP.innerHTML : this.secondFighterTotalHP.innerHTML,
        fighter2Name :          this.swaped ? this.firstFighterName.value : this.secondFighterName.value
    };
}


function uploadCurentFight() {
    if(this.selectedFight == undefined)
        return;
    let fight = getCurrentFightStats()
    let params = { spreadsheetId: this.spreadsheetId.value};
    let requestData = [];
    requestData.push({
        majorDimension: "ROWS",
        range: fight.sheet + '!' + FIRST_COLUMN + (FIRST_ROW + fight.key) + ':' + LAST_COLUMN + (FIRST_ROW + fight.key),
        values: [
            [fight.fighter2Name, fight.fighter2HP, fight.fighter2Score, fight.fighter2Warnings,
            fight.mutualHits,
            fight.fighter1Warnings, fight.fighter1Score, fight.fighter1HP, fight.fighter1Name]
        ]
    });
    let batchUpdateValuesRequestBody = {
        valueInputOption: 'USER_ENTERED',
        data: requestData,
    };
    let request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
    request.then(function(response) {
        //console.log(response.result);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

function uploadSavedFights() {
    var params = { spreadsheetId: this.spreadsheetId.value};

    console.log(JSON.stringify( savedFights, null, 2 ));

    var requestData = [];
    
    for(var i = 0; i<savedFights.length; ++i) {
        requestData.push({
            majorDimension: "ROWS",
            range: savedFights[i].sheet + '!' + FIRST_COLUMN + (FIRST_ROW + savedFights[i].key) + ':' + LAST_COLUMN + (FIRST_ROW + savedFights[i].key),
            values: [
                [savedFights[i].fighter2Name, savedFights[i].fighter2HP, savedFights[i].fighter2Score, savedFights[i].fighter2Warnings,
                savedFights[i].mutualHits,
                savedFights[i].fighter1Warnings, savedFights[i].fighter1Score, savedFights[i].fighter1HP, savedFights[i].fighter1Name]
            ]
        });
    }

    var batchUpdateValuesRequestBody = {
        valueInputOption: 'USER_ENTERED',
        data: requestData,
    };

    var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
    request.then(function(response) {
        //console.log(response.result);
        savedFights = [];
    }, function(reason) {
        
        console.error('error: ' + reason.result.error.message);
        var str = '';
        savedFights.forEach(function(fight, i) {
            str += fight.fighter2Name + ' ' + fight.fighter2HP + ' ' + fight.fighter2Score + ' ' + fight.fighter2Warnings
                + ' ' + fight.mutualHits
                + ' ' + fight.fighter1Warnings + ' ' + fight.fighter1Score + ' ' + fight.fighter1HP + ' ' +fight.fighter1Name
                + '\n';
        });
        alert('Не удалосль отправить результаты боя. Результаты сохранены локально. Не обновляйте страницу:\n'
        + str);
    });

}

function uploadData() {
    if(this.selectedFight == undefined) {
        alert('Какой это бой Вы решили сохранить?');
        return;
    }

    savedFights.push(getCurrentFightStats());
    loadFights();
    
    uploadSavedFights();
}