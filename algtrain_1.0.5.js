class Case {
    constructor(n) {
        this.algs = [];
        this.n = n;
        this.enabled = true;
    }

    addAlg(alg) {
        this.algs.push(alg);
    }
}

class Subset {
    constructor(name) {
        this.name = name;
        this.cases = [];
    }

    addCase(caSe) {
        this.cases.push(caSe);
    }
}

class AlgSet {
    constructor(event, name, subsets) {
        this.event = event;
        this.name = name;
        this.subsets = subsets;
        this.options = {};
    }

    addsubset(subset) {
        this.subsets.push(subset);
    }

    indexOfsubset(name) {
        for (let i = 0; i < this.subsets.length; i++) {
            if (this.subsets[i].name === name) {
                return i;
            }
        }
        return -1;
    }

    getSubset(name) {
        return this.subsets[this.indexOfsubset(name)];
    }
}

class Time {
    constructor(time, subset, caSe) {
        this.time = time;
        this.subset = subset;
        this.caSe = caSe;
    }
}

function showPopup(popup) {
    popup.show(300);
    $('.popupback').show();
}

function hidePopup(popup) {
    popup.hide(300);
    $('.popupback').hide();
}

function popup(msg) {
    $('body').append(
        "<div class='popup'>" +
        "<button>Ok</button><button " +
        "onclick='$(this).parent().remove()'>" + text[txtCancel] + "</button>" +
        "</div>"
    );
}

function alertPopup(title, msg) {
    $('.alertback').show();
    $('body').append(
        "<div class='popup alert'>" + "<h1>" + title + "</h1>" + "<div class='container'>" + msg +
        "<br></div><button onclick='closeAlert($(this));'>Ok</button></div>"
    );
}

function closeAlert(alert) {
    $('.alertback').hide();
    alert.parent().remove();
}

var language = "en";
var textEn = [
    "Cancel",
    "Success!",
    "$0 algsets, $1 subsets, $2 cases and $3 algorithms successfully loaded!",
    "Error",
    "Invalid input at line $0:<br>$1",
    "Are you sure you want to reset all data (including algsets)?",
    "Input algset(s) here...",
    "Cube Algorithm Trainer",
    "Are you sure you want to delete this algset?",
    "Please select at least one subset"
];
var textJp = [
    "キャンセル",
    "手順追加成功！",
    "$0つの手順セット、$1つのサブセット、$2つのケースと$3つの手順の追加に成功しました！",
    "エラー",
    "$0行は無効な式を含んでいます:<br>$1",
    "手順を含めデータを全て初期化しますか？",
    "こちらに手順を入力してください",
    "キューブ手順トレーナー",
    "この手順セットを削除しますか？",
    "サブセットを最低１つ選択してください"
];
var langText = textEn;
var txtCancel = 0;
var txtParseSuccessTitle = 1;
var txtParseSuccessMsg = 2;
var txtErrorTitle = 3;
var txtErrorMsg = 4;
var txtConfirmReset = 5;
var txtInputPlaceholder = 6;
var txtTitle = 7;
var txtConfirmDelAlgset = 8;
var txtNoSubsetsSelected = 9;

function replaceTxtData() {
    var text = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        text = text.replace("$" + (i - 1), arguments[i]);
    }
    return text;
}

// Load settings
$(document).ready(function() {
    // First time visiting, load default algsets and settings
    if (load("visited") === null || typeof load("visited") === 'undefined') {
        parseAlgSets($(".defaultalgs").text());
        save("visited", 0);
        for (let i = 0; i < algsets.length; i++) {
            saveAlgset(algsets[i]);
            for (let j = 0; j < algsets[i].subsets.length; j++) {
                for (let k = 0; k < algsets[i].subsets[j].cases.length; k++) {
                    var algset = algsets[i];
                    var subset = algset.subsets[j];
                    var caSe = subset.cases[k];
                    save("enabled-" + algset.event + "-" + algset.name + "-" + subset.name + "-" + caSe.n, true);
                }
            }
        }

        language = navigator.language.split("-")[0] === "ja" ? "ja" : "en";

        save("randomY", randomY);
        save("smartTraining", smartTraining);
        save("language", language);
        save("theme", theme);
    }

    // Already visited, load settings from localStorage
    else {
        // Load settings
        randomY = load("randomY");
        smartTraining = load("smartTraining");
        language = load("language");
        theme = load("theme");
        switchTheme(theme);

        // Load algsets
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith("algset")) {
                var item = load(localStorage.key(i));
                var algset = new AlgSet();
                Object.assign(algset, item);
                algsets.push(algset);
            }
        }

        addAlgsetElements(algsets);
    }


    // Sort algset options
    $('.algsetselect').append($('.algsetselect option').sort(function(a, b) {
        if (a.value > b.value) {
            return 1;
        } else if (a.value < b.value) {
            return -1;
        } else {
            return 0;
        }
    }));
    $('.algsetselect').val($('.algsetselect option:first').val());

    // Load previous training session
    var wasTraining = load("training");
    if (wasTraining != null) {
        var event = wasTraining.substring(0, wasTraining.indexOf('-'));
        var algset = wasTraining.replace(event + "-", "");
        train(event, algset);
    }

    // Select settings in the settings screen
    $("#smartTraining").prop("checked", smartTraining);
    $("#randomY").prop("checked", randomY);

    switchLang(language);
})

var theme = "light";

function switchTheme(theme) {
    $("link.themelink").attr("href", "theme-" + theme + ".css");
}

function switchLang(lang) {
    language = lang;
    if (language === "en") {
        langText = textEn;
        $("[lang='ja']").attr("data-hide", true);
        $("[lang='en']").attr("data-hide", false);
        $("a.lang.ja").attr("data-selected", 0);
        $("a.lang.en").attr("data-selected", 1);
    } else {
        langText = textJp;
        $("[lang='ja']").attr("data-hide", false);
        $("[lang='en']").attr("data-hide", true);
        $("a.lang.ja").attr("data-selected", 1);
        $("a.lang.en").attr("data-selected", 0);
    }
    adjustContent();
    save("language", language);
    $(".inputArea").attr("placeholder", langText[txtInputPlaceholder]);
    $("title").text(langText[txtTitle]);
}

// Saves data to web storage
function save(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

// Loads data from web storage
function load(key) {
    if (localStorage.getItem(key) === null)
        return null;
    else
        return JSON.parse(localStorage.getItem(key));
}

function erase(key) {
    localStorage.removeItem(key);
}

function saveAlgset(algset) {
    var key = "algset-" + algset.event + "-" + algset.name;
    save(key, algset);
}

// Parse algsets from string

var algsets = [];

function parseAlgSets(text) {
    if (text === "") {
        hidePopup($('#algsets'));
        return 0;
    }
    var lineIterate = text.trim().split("\n");
    var state = 0;
    var algset;
    var subset;
    var caSe;
    var tempAlgsets = [];
    var subsetCounter = 0;
    var caseCounter = 0;
    var algCounter = 0;
    var event;
    var success = true;
    var invalidLine = 0;
    for (let i = 0; i < lineIterate.length && success; i++) {
        var line = lineIterate[i];
        if (line.startsWith("/")) {
            if ((state === 0 || state === 3) && line.startsWith("///")) {
                event = line.substring(3, line.length);
                if (event != "3x3" && event != "2x2") {
                    success = false;
                    invalidLine = i;
                }
                state = 1;
            } else if (state === 1 && line.startsWith("//")) {
                algsetName = line.substring(2, line.length);
                var options = {};
                if (algsetName.includes("@")) {
                    var index = algsetName.indexOf("@")
                    options = algsetName.substring(index + 1, algsetName.length);
                    algsetName = algsetName.substring(0, index);
                    var optArr = options.split(",");
                    var validMasks = $(".cubemask option").map(function() {
                        return this.value.toLowerCase();
                    }).get();
                    var validOptions = [
                        { name: "view", values: ["ll"] },
                        { name: "mask", values: validMasks }
                    ];
                    optArr.forEach(function(opt, i) {
                        var name = opt.split(":")[0].toLowerCase();
                        var val = opt.split(":")[1].toLowerCase().replace("#", "_").replace(" ", "_");
                        if (validOptions.some(opt => opt.name === name.toLowerCase() && opt.values.includes(val.toLowerCase()))) {
                            val = val === "ll" ? "plan" : val;
                            this[i] = '"' + name + '":"' + val + '"';
                        } else {
                            success = false;
                            invalidLine = i;
                        }
                    }, optArr);
                    options = "{" + optArr.join(",") + "}";
                    options = JSON.parse(options);
                }
                // Cannot add existing algset
                if (algsets.some(algset => algsetName === algset.name) || tempAlgsets.some(algset => algsetName === algset.name)) {
                    success = false;
                    invalidLine = i;
                } else {
                    algset = new AlgSet(event, algsetName, []);
                    // If options is not empty, add it to algset
                    if (!(Object.entries(options).length === 0 && options.constructor === Object)) {
                        algset.options = options;
                    }
                    tempAlgsets.push(algset);
                    state = 2;
                }
            } else if (state === 2 || (state === 3 && subset.cases.length > 0)) {
                subset = new Subset(line.substring(1, line.length));
                algset.addsubset(subset);
                state = 3;
                caSe = undefined;
                subsetCounter++;
            }
        } else if (state === 3) {
            if (typeof caSe === 'undefined' || line === '') {
                caSe = new Case(subset.cases.length);
                subset.addCase(caSe);
                caseCounter++;
            }
            if (line.trim() != '') {
                var alg = cleanAlg(line);
                if (!evalAlg(alg, event)) {
                    success = false;
                    invalidLine = i;
                } else {
                    caSe.addAlg(alg);
                    algCounter++;
                }
            }
        } else {
            success = false;
            invalidLine = i;
        }
    }

    if (success) {
        algsets = algsets.concat(tempAlgsets);

        addAlgsetElements(tempAlgsets);

        if (localStorage.length > 0) {
            var msg = replaceTxtData(langText[txtParseSuccessMsg], tempAlgsets.length, subsetCounter, caseCounter, algCounter);
            alertPopup(langText[txtParseSuccessTitle], msg);
            $('.inputArea').val('');
            hidePopup($('#algsets'));
        }
    } else {
        var msg = replaceTxtData(langText[txtErrorMsg], invalidLine, lineIterate[invalidLine]);
        alertPopup(langText[txtErrorTitle], msg);
    }
}

// Add algset elements to the page

function addAlgsetElements(algsets) {
    for (let i = 0; i < algsets.length; i++) {
        var tag = algsets[i].event + "-" + algsets[i].name;
        // Add algset to the navigation bar
        switch (algsets[i].event) {
            case "3x3":
                $("#3x3").append("<li><a data-selected='0' " +
                    "class='algset' id='train-" + tag +
                    "' href='javascript:void(0)'>" + algsets[i].name +
                    "</a></li>");
                break;
            case "2x2":
                $("#2x2").append("<li><a data-selected='0' " +
                    "class='algset' id='train-" + tag +
                    "' href='javascript:void(0)'>" + algsets[i].name +
                    "</a></li>");
                break;
        }
        $("#train-" + tag).attr("onclick", "train('" +
            algsets[i].event + "', '" + algsets[i].name + "')");
        // Add algset to algset manager options
        $('.algsetselect').append("<option value='" + tag + "'>" + tag + "</option>");
    }

    // Sort navigation bar


    // Sort options
    $('.algsetselect').append($('.algsetselect option').sort(function(a, b) {
        if (a.value > b.value) {
            return 1;
        } else if (a.value < b.value) {
            return -1;
        } else {
            return 0;
        }
    }));
    $('.algsetselect').val($('.algsetselect option:first').val());
}

// Alg transformation

function trans(alg, n) {
    switch (n) {
        case 0:
            return alg;
        case 1:
            return transY(alg);
        case 2:
            return transYP(alg);
        case 3:
            return transYT(alg);
    }
}

function evalAlg(alg, event) {
    var validMoves = ["R", "U", "D", "F", "L", "B", "x", "y", "z"];
    var validMoves3 = ["r", "u", "d", "f", "l", "b", "M", "E", "S"];
    validMoves = event === "3x3" ? validMoves.concat(validMoves3) : validMoves;
    var moves = alg.split(" ");
    for (let i = 0; i < moves.length; i++) {
        var move = moves[i].split("");
        if (!validMoves.includes(move[0])) {
            return false;
        } else if (move.length > 1) {
            if (move[1] != "2" && move[1] != "'") {
                return false;
            } else if (move.length === 3 && move[2] != "2" && move[2] != "'") {
                return false;
            } else if (move.length > 3) {
                return false;
            }
        }
    }
    return true;
}

function transY(alg) {
    return alg
        .replace(/R/g, "A").replace(/B/g, "R").replace(/L/g, "B")
        .replace(/F/g, "L").replace(/A/g, "F").replace(/r/g, "a")
        .replace(/b/g, "r").replace(/l/g, "b").replace(/f/g, "l")
        .replace(/a/g, "f").replace(/S/g, "C").replace(/M'/g, "S")
        .replace(/M2'/g, "S2").replace(/M2/g, "S2")
        .replace(/M/g, "S'").replace(/C/g, "M")
        .replace(/z/g, "g").replace(/x/g, "z")
        .replace(/g'/g, "x").replace(/g/g, "x'");
}

function transYP(alg) {
    return alg
        .replace(/B/g, "A").replace(/R/g, "B").replace(/F/g, "R")
        .replace(/L/g, "F").replace(/A/g, "L").replace(/b/g, "a")
        .replace(/r/g, "b").replace(/f/g, "r").replace(/l/g, "f")
        .replace(/a/g, "l").replace(/S/g, "C").replace(/M/g, "S")
        .replace(/C2/g, "M2").replace(/C2'/g, "M2'")
        .replace(/C'/g, "M").replace(/C/g, "M'")
        .replace(/x/g, "g").replace(/z/g, "x")
        .replace(/g'/g, "z").replace(/g/g, "z'");
}

function transYT(alg) {
    return alg
        .replace(/B/g, "A").replace(/F/g, "B").replace(/A/g, "F")
        .replace(/R/g, "A").replace(/L/g, "R").replace(/A/g, "L")
        .replace(/b/g, "a").replace(/f/g, "b").replace(/a/g, "f")
        .replace(/r/g, "a").replace(/l/g, "r").replace(/a/g, "l")
        .replace(/M2/g, "C").replace(/M2'/g, "G").replace(/M'/g, "A")
        .replace(/M/g, "M'").replace(/C/g, "M2").replace(/G/g, "M2'")
        .replace(/A/g, "M").replace(/S'/g, "A")
        .replace(/S/g, "S'").replace(/A/g, "S")
        .replace(/x/g, "h").replace(/z/g, "i")
        .replace(/h'/g, "x").replace(/h/, "x'")
        .replace(/i'/g, "y").replace(/i/g, "y'")
}

function cleanAlg(alg) {
    return alg.replace(/[\[\]]+/g, ' ').replace(/[()]/g, ' ').replace(/\s+/g, ' ').replace(/’/g, "'").trim();
}

function invertAlg(alg) {
    var moves = alg.split(" ");
    for (let i = 0; i < moves.length; i++) {
        if (moves[i].includes("'")) {
            moves[i] = moves[i].replace("'", "");
        } else {
            moves[i] = moves[i].concat("'");
        }
    }
    return moves.reverse().join(" ");
}

// Timer

var start;
var time = 0;
var running = false;
var interval;
var timeList;
var averages = [];

function popupVisible() {
    return $(".popupback:visible").length > 0;
}

var touching = false;

function timerPressed(e) {
    if ((e.type === "touchstart" && !touching) || e.keyCode == 32) {
        if (e.type === "touchstart") {
            touching = true;
        }
        if (currentAlgSetIndex !== -1 && !popupVisible()) {
            $(".timerdisplay").css('color', '#009dff');
            if (typeof start === 'undefined') {
                start = new Date();
            } else if (running) {
                // Stop timer and add time
                clearInterval(interval);
                start = undefined;
                addTime(time);
                nextScramble();
            }
        }
        return false;
    }
}

function timerUnpressed(e) {
    if (((e.type === "touchend" && touching) || e.keyCode == 32) && currentAlgSetIndex !== -1 && !popupVisible()) {
        if (e.type === "touchend") {
            touching = false;
        }
        $(".timerdisplay").css('color', '#000000');
        if (typeof start !== 'undefined') {
            var end = new Date();
            // Start timer
            if (end - start >= 150 && !noSubsetSelected) {
                start = end;
                interval = setInterval(timer, 1);
                running = true;
            } else {
                start = undefined;
            }
        } else if (running) {
            running = false;
        }
    }
}

function keyPressed(e) {
    switch (e.keyCode) {
        // Enter
        case 13:
            nextScramble();
            break;
            // Delete
        case 46:
            const t = timeList[timeList.length - 1];
            const time = t.time;
            const subset = t.subset;
            const caSe = t.caSe;
            const lastTime = $($("div[data-subset='" + subset + "'][data-case='" + caSe + "'] .time").toArray().reverse().find((t, i) => $(t).text() === time.toString()));
            removeTime(lastTime);
            break;
    }
}

$(document).keydown(function(e) {
    timerPressed(e);
    keyPressed(e);
});

$(document).keyup(function(e) { timerUnpressed(e) });

function timer() {
    var now = new Date();
    time = ((now - start) / 1000).toFixed(2);
    $(".timerdisplay").text(time);
}

function timeKey() {
    return "time-" + currentEvent + "-" + currentAlgSet().name;
}

function saveTimeList() {
    save(timeKey(), timeList);
}

function addTime(time) {
    var timeObj = new Time(time, currentSubset, currentCase);
    timeObj.id = timeList.length;
    timeList.push(timeObj);
    saveTimeList();
    appendTimeElement(timeList.length - 1, time, currentSubset, currentCase);
}

function clearTimeListElement() {
    $(".timelist .container").children().remove();
}

function loadCubeToTooltip(tag) {
    var cube = $(".cube." + currentEvent + "-" + currentAlgSet().name + "-" + tag).html();
    if (cube === "") {
        setTimeout(function() { loadCubeToTooltip(tag) }, 100);
    } else {
        if (cube.includes("src")) {
            var ttCube = $(".ttcase#tt-" + tag + " .ttcube");
            ttCube.empty();
            ttCube.append(cube);
        } else {
            setTimeout(function() { loadCubeToTooltip(tag) }, 100);
        }
    }
}

function calculateAverage(subset, caSe) {
    caSe = parseInt(caSe);
    var caseTag = currentAlgSet().getSubset(subset).cases.length > 1 ? caSe + 1 : "";
    var caseTimelist = timeList.filter(t => t.subset === subset && t.caSe === caSe);
    var sum = 0;
    caseTimelist.forEach(function(t, i) {
        sum += parseFloat(t.time);
    });

    var average = (sum / caseTimelist.length).toFixed(2);
    $(".timecontainer#" + subset + caSe + " h2").text(subset + caseTag + " (" + average + ")");

    var averageIndex = averages.findIndex(av => {
        return av.subset === subset && av.caSe === caSe;
    });
    if (averageIndex === -1) {
        averages.push(new Time(average, subset, caSe));
    } else {
        averages[averageIndex].time = average;
    }
}

function appendTimeElement(id, time, subset, caSe) {
    var caseTag = currentAlgSet().getSubset(subset).cases.length > 1 ? caSe + 1 : "";
    var subsetAndCase = subset + caSe;
    var timeContainer = $(".timelist .container > div#" + subsetAndCase);
    // Create header if not present
    if (timeContainer.length == 0) {
        var algs = $(".manageralgs." + currentEvent + "-" + currentAlgSet().name + "-" + subset + caSe).html();
        $(".timelist .container").append("<div data-subset='" + subset + "' data-case='" + caSe + "' class='timecontainer' id='" + subsetAndCase +
            "'><div class='ttcontainer'><div class='tooltip'><h2>" + subset + caseTag + "</h2><span class='ttcase' id='tt-" + subset + caSe + "'><table><tbody><tr><td class='ttcube'></td><td>" + algs + "</td></tbody></table></span></div></div></div>");

        loadCubeToTooltip(subsetAndCase);
    }
    $(".timelist .container > .timecontainer#" + subsetAndCase).append("<a class='time' id='" +
        id + "' onclick='removeTime($(this));' href='javascript:void(0);'>" + time + "</a>");
    $(".timelist .container").append($(".timecontainer").sort(function(a, b) {
        if (a.id > b.id) {
            return 1;
        } else if (a.id < b.id) {
            return -1;
        } else {
            return 0;
        }
    }));

    calculateAverage(subset, caSe);
}

function removeTime(e) {
    const parent = e.parent();
    const subset = parent.attr('data-subset');
    const caSe = parent.attr('data-case');
    const i = timeList.findIndex((t, i) => {
        return t.subset === subset && t.caSe === parseInt(caSe) && t.time === e.text();
    });
    timeList.splice(i, 1);
    saveTimeList();
    e.remove();
    if (parent.children().length == 1) {
        parent.remove();
    }
    if (smartTraining) {
        nextScramble();
    }

    calculateAverage(subset, caSe);
}



function loadTimeList(event, algset) {
    clearTimeListElement();
    var key = "time-" + event + "-" + algset;
    if (load(key) !== null) {
        timeList = load(key);
        for (let i = 0; i < timeList.length; i++) {
            appendTimeElement(i, timeList[i].time, timeList[i].subset, timeList[i].caSe);
        }
    } else {
        timeList = [];
    }
}

function clearTimes() {
    $(".time").each((i, t) => {
        removeTime($(t));
    });

}

// Trainer code
var currentEvent;
var currentAlgSetIndex = -1;
var currentSubset;
var currentCase;
var currentScramble;
var noSubsetSelected = false;
var smartTraining = true;
var randomY = true;

function getAlgSetIndex(event, name) {
    for (let i = 0; i < algsets.length; i++) {
        if (algsets[i].event === event && algsets[i].name === name)
            return i;
    }
    return -1;
}

function getAlgSet(event, name) {
    if (name === undefined) {
        var tag = event;
        event = tag.substring(0, tag.indexOf("-"));
        name = tag.substring(tag.indexOf("-") + 1, tag.length);
    }
    return algsets[getAlgSetIndex(event, name)]
}

function currentAlgSet() {
    return algsets[currentAlgSetIndex];
}

function train(event, algset) {
    save("training", event + "-" + algset);
    if (currentAlgSetIndex !== getAlgSetIndex(event, algset)) {
        currentAlgSetIndex = getAlgSetIndex(event, algset);
        currentEvent = event;

        if ($('.managertable tbody.' + event + "-" + algset).length === 0)
            generateAlgsetManager(event, algset);

        loadTimeList(event, algset);
        $('.subbuttoncontainer').show();
        $('.timerdisplay').show();
        $('.timelist').show();
        $(".algset").attr("data-selected", "0");
        $(".algset#train-" + event + "-" + algset).attr("data-selected", "1");
        $(".setinfo").text(event + " - " + algset);
        $(".subsets").text("");

        // Load subset checkboxes
        for (let i = 0; i < currentAlgSet().subsets.length; i++) {
            var subsetName = currentAlgSet().subsets[i].name;
            var key = "enabled-" + event + "-" + algset + "-" + subsetName;
            var checked;
            if (load(key) === null) {
                save(key, true);
                checked = true;
            } else {
                checked = load(key);
            }
            timeVisible(subsetName, checked);
            $(".subsets").append(
                "<label class='checkbox'>" + subsetName +
                "<input onchange='checkboxChanged($(this));$(this).blur();' type='checkbox'" +
                "class='subset' id='" + subsetName + "' " + (checked ? "checked" : "") + ">" +
                "<span class='checkmark'></span>" +
                "&nbsp;</label>"
            );
        }
        nextScramble();
    }
}

function timeVisible(tag, visible) {
    var timeContainer = $(".timecontainer[id*='" + tag + "']");
    if (visible) {
        timeContainer.show();
    } else {
        timeContainer.hide();
    }
}

function checkboxChanged(checkbox) {
    var checked = checkbox.prop("checked");
    if (noSubsetSelected && checked) {
        noSubsetSelected = false;
    }
    if (checkbox.hasClass("subset")) {
        var key = "enabled-" + currentEvent + "-" + currentAlgSet().name + "-" + checkbox.attr("id").replace("enablecase-", "");
        save(key, checked);
        timeVisible(checkbox.attr("id"), checked);
    } else if (checkbox.hasClass("case")) {
        var event = checkbox.data("event");
        var algset = checkbox.data("algset");
        var subset = checkbox.data("subset");
        var caSe = checkbox.data("case");
        getAlgSet(event, algset).getSubset(subset).cases[parseInt(caSe)].enabled = checked;
        //save("algset-" + event + "-" + algset, getAlgSet(event, algset));
        saveAlgset(getAlgSet(event, algset));
    }
    nextScramble();
}

function checkAll() {
    if ($('input.subset:checked').length != $('input.subset').length)
        $('input.subset').each(function(i, e) {
            $(this).prop("checked", true);
            checkboxChanged($(this));
        });
}

function uncheckAll() {
    $('input.subset').each(function(i, e) {
        $(this).prop("checked", false);
        checkboxChanged($(this));
    });
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

// Weight used to calculate probability
class Weight {
    constructor(subset, caSe) {
        this.subset = subset;
        this.caSe = caSe;
        this.weight = 0;
    }
}

function nextScramble() {
    var enabledSubsets = [];
    var weights = [];
    // Gets enabled subsets from checkboxes
    $("input.subset").each(function(i, e) {
        if (e.checked) {
            enabledSubsets.push(e.id);
        }
    });
    if (enabledSubsets.length === 0) {
        $(".scramble").text(langText[txtNoSubsetsSelected]);
        noSubsetSelected = true;
        return 0;
    }

    var subset;
    var caSe;

    // Decides the next scramble based on times
    if (smartTraining && timeList.length != 0) {
        // Adds empty weights
        for (let i = 0; i < enabledSubsets.length; i++) {
            currentAlgSet().getSubset(enabledSubsets[i]).cases.forEach(c => {
                weights.push(new Weight(enabledSubsets[i], c.n));
            });
        }

        // Calculates weights from timelist only for enabled subsets
        for (let i = 0; i < timeList.length; i++) {
            if (enabledSubsets.some(ss => ss === timeList[i].subset)) {
                var subset = timeList[i].subset;
                var caSe = timeList[i].caSe;
                weights.find(w => w.subset === subset && w.caSe === caSe).weight++;
            }
        }

        // Check if all enabled subsets have at least 5 times for each case
        var atLeastFive = true;
        for (let i = 0; i < enabledSubsets.length; i++) {
            var cases = currentAlgSet().getSubset(enabledSubsets[i]).cases.filter(c => c.enabled);
            for (let j = 0; j < cases.length; j++) {
                var weight = weights.find(w => enabledSubsets[i] === w.subset && w.caSe === j).weight;
                if (weight < 5)
                    atLeastFive = false;
            }
        }

        // Every case has at least 5 times, scramble will be
        // based on time instead of ocurrence
        if (atLeastFive) {
            var enabledAverages = averages.filter(t => enabledSubsets.includes(t.subset) && currentAlgSet().getSubset(t.subset).cases[t.caSe].enabled);
            var sum = 0;
            enabledAverages.forEach(av => sum += parseFloat(av.time));
            var rng = Math.random() * sum;
            var slice = 0;
            var i = -1;
            while (rng > slice) {
                i++;
                slice += parseFloat(enabledAverages[i].time);
            }
            subset = currentAlgSet().getSubset(enabledAverages[i].subset);
            enabledCases = subset.cases.filter(c => c.enabled);
            caSe = enabledCases.find(c => c.n === enabledAverages[i].caSe);
        }
        // Not enough times, uniform scramble distribution
        else {
            var enabledTimes = timeList.filter(t => enabledSubsets.some(ess => t.subset === ess) && currentAlgSet().getSubset(t.subset).cases[parseInt(t.caSe)].enabled);
            var occurrences = [];

            // Fill occurrences with 0
            for (let i = 0; i < enabledSubsets.length; i++) {
                var cases = currentAlgSet().getSubset(enabledSubsets[i]).cases;
                for (let j = 0; j < cases.length; j++) {
                    if (cases[j].enabled)
                        occurrences.push({ subset: enabledSubsets[i], caSe: cases[j].n, o: 0 });
                }
            }

            // Calculate occurrences
            for (let i = 0; i < enabledTimes.length; i++) {
                var ss = enabledTimes[i].subset;
                var c = enabledTimes[i].caSe;
                occurrenceIndex = occurrences.findIndex(o => o.subset === ss && o.caSe === c);
                occurrences[occurrenceIndex].o++;
            }

            // Calculate lowest occurrence
            var lowestOccurrence = -1;
            for (let i = 0; i < occurrences.length; i++) {
                if (occurrences[i].o < lowestOccurrence || lowestOccurrence == -1) {
                    lowestOccurrence = occurrences[i].o
                }
            }

            var enabledOccurrences = occurrences.filter(occ => occ.o === lowestOccurrence);
            var chosenCase = enabledOccurrences[randomInt(enabledOccurrences.length)];
            subset = currentAlgSet().getSubset(chosenCase.subset);
            caSe = subset.cases[chosenCase.caSe];
        }
    }
    // No smart training, completely random
    else {
        subset = currentAlgSet().getSubset(enabledSubsets[randomInt(enabledSubsets.length)]);
        var enabledCases = subset.cases.filter(c => c.enabled);
        caSe = enabledCases[randomInt(enabledCases.length)];
    }

    var scramble = caSe.algs[randomInt(caSe.algs.length)];

    scramble = trans(scramble, randomY ? randomInt(4) : 0);
    scramble = invertAlg(scramble).replace(/2'/g, "2");

    currentScramble = scramble;
    currentSubset = subset.name;
    currentCase = caSe.n;
    $(".scramble").text(scramble);
}

// Algset manager

function showAlgsetManager(select) {
    var str = select.val();
    var i = str.indexOf('-');
    var event = str.substring(0, i);
    var algsetName = str.substring(i + 1, str.length);
    var algset = getAlgSet(event, algsetName);

    if ($('.managertable tbody.' + str).length > 0) {
        $('.managertable tbody').hide();
        $('.managertable tbody.' + str).show();
    } else {
        $('.managertable tbody').hide();
        generateAlgsetManager(event, algsetName);
    }

    // Select options accordingly
    if (algset.options.view === "plan") {
        $('.cubeview').val("LL");
    } else {
        $('.cubeview').val("Normal");
    }

    var mask = algset.options.mask;
    if (mask === undefined) {
        mask = "None";
    } else {
        mask = mask.replace("#", "_").replace(" ", "_");
        mask = mask === "cross" ? "Cross" : mask === "line" ? "Line" : mask.toUpperCase();
    }
    $('.cubemask').val(mask);
}

let SRVisualizer = window['sr-visualizer'];

function generateAlgsetManager(event, name) {
    algset = getAlgSet(event, name);
    var options = algset.options;
    var bodyClass = event + "-" + name;
    $('.managertable').append("<tbody class='" + bodyClass + "'>");
    for (let i = 0; i < algset.subsets.length; i++) {
        var subset = algset.subsets[i];
        for (let j = 0; j < subset.cases.length; j++) {
            var caSe = subset.cases[j];
            var tag = event + "-" + algset.name + "-" + subset.name + caSe.n;
            var caseTag = subset.cases.length > 1 ? caSe.n + 1 : "";

            var checked = caSe.enabled ? " checked" : "";

            $('.managertable tbody.' + bodyClass).append("<tr><th>" + subset.name + caseTag + "<br><div class='cube " +
                tag + "'></div></th><td class='manageralgs " + tag + "'>" + caSe.algs.join("<br>") + "</td><td style='text-align:center;'><label class='checkbox'>" +
                "<input onchange='checkboxChanged($(this));' class='case' id='enablecase-" + tag + "' type='checkbox'" + checked + " data-event='" + algset.event + "' data-algset='" + algset.name + "' data-subset='" + subset.name + "' data-case='" + caSe.n + "'>" +
                "<span class='checkmark'></span>" +
                "</label></td></tr>");
            var alg = caSe.algs[0];

            var fixedOptions = {
                case: alg,
                width: 100,
                height: 100,
                cubeSize: parseInt(event.substring(0, 1))
            }

            Object.assign(fixedOptions, options);

            SRVisualizer.cubePNG($('.cube.' + tag)[0], fixedOptions);
        }
    }
    $('.managertable').append("</tbody>");
}

function managerOption(input) {
    var tag = $('.algsetselect').val();
    // Parse view
    var view = {};
    var mask = {};
    switch ($('.cubeview').val()) {
        case "LL":
            view = { view: "plan" };
            break;
        case "Normal":
            view = {};
            break;
        default:
            view = { view: "plan" };
            break;
    }
    // Parse mask
    mask = $('.cubemask').val().toLowerCase().replace("#", "_").replace(" ", "_");
    mask = mask === "none" ? {} : { mask: mask };

    var options = {};
    Object.assign(options, view, mask);

    // Save options to algset
    var algset = getAlgSet(tag);
    algset.options = options;
    saveAlgset(algset);

    // Checks if updating tooltips is needed
    var updateTT = currentEvent + "-" + currentAlgSet === tag;

    $('.cube[class*=' + tag + ']').each(function(i, cube) {
        var tag = cube.className.split(" ")[1];
        var alg = $('.manageralgs.' + tag).html().split("<br>")[0];
        var cubeSize = parseInt(tag.split("-")[0].substring(0, 1));
        var fixedOptions = {
            case: alg,
            width: 100,
            height: 100,
            cubeSize: cubeSize
        };

        // Assign options
        Object.assign(options, fixedOptions);

        $('.cube.' + tag).empty();
        SRVisualizer.cubePNG($('.cube.' + tag)[0], options);

        // Update tooltips
        if (updateTT)
            loadCubeToTooltip(tag.split("-")[2]);
    });
}

function deleteAlgset() {
    if (confirm(langText[txtConfirmDelAlgset])) {
        var tag = $('.algsetSelect').val();
        $('tbody.' + tag).remove();
        $('.algsetSelect option[value="' + tag + '"]').remove();
        $('.algsetselect').val($('.algsetselect option:first').val());
        showAlgsetManager($('.algsetselect'));
        var i = getAlgSetIndex(tag.split("-")[0], tag.split("-")[1]);
        algsets.splice(i, 1);
        erase("algset-" + tag);
    }
}

function settingChanged(setting) {
    var name = setting.attr("id");
    var val;
    switch (name) {
        case "smartTraining":
            smartTraining = setting[0].checked;
            val = smartTraining;
            break;
        case "randomY":
            randomY = setting[0].checked;
            val = randomY;
            break;
        case "theme":
            val = setting.val().toLowerCase();
            switchTheme(val);
            break;
    }
    save(name, val);
}

function resetSettings() {
    if (confirm(langText[txtConfirmReset])) {
        localStorage.clear();
        location.reload();
    }
}