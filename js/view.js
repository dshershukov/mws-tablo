/**
 * Created by ignezdilov on 20.02.2017.
 */

function loadState() {
    var state = JSON.parse(window.localStorage.getItem("state"));

    var i = state.invert;
    document.getElementById("timerWindow").innerHTML = state.timer;
    document.getElementById("leftFighter").innerHTML = !!i ? state.secondFighter : state.firstFighter;
    document.getElementById("leftFighterName").innerHTML = !!i ? state.secondFighterName : state.firstFighterName;
    document.getElementById("leftFighterTotalHP").innerHTML = !!i ? state.secondFighterTotalHP : state.firstFighterTotalHP;
    document.getElementById("rightFighter").innerHTML = !i ? state.secondFighter : state.firstFighter;
    document.getElementById("rightFighterName").innerHTML = !i ? state.secondFighterName : state.firstFighterName;
    document.getElementById("rightFighterTotalHP").innerHTML = !i ? state.secondFighterTotalHP : state.firstFighterTotalHP;
    var body =  document.getElementsByTagName("BODY")[0];
    if (i) {
        body.classList.add("invert");
    } else {
        body.classList.remove("invert");
    }
    var b = state.showRoundNumber;
    document.getElementById("roundNumber").innerHTML = b ? "Раунд " + state.roundNumber : "";
    if (!this.listenerStorage) {
        this.listenerStorage = loadState;
        window.addEventListener("message", this.listenerStorage);
    }
}
