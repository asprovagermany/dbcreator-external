//localStorage.js

// Funktion zum Überprüfen, ob es schon gespeicherte Daten für das Dashboard im Localstorage gibt
// Lädt einen Teil der gespeicherten Daten in die Oberfläche
// TODO: ggf. Aufteilung der Funktion, sodass Laden der Daten in anderer Funktion gemacht wird
/*function checkLocalStorage() {
  //Prüfen, ob schon globale Dashboarddaten im LocalStorage vohanden sind
  if (localStorage.getItem("globalDashboardData") !== null) {
    // Globale Daten wurden gefunden
    //alert("Es wurden bereits gespeicherte Daten gefunden");
    const savedData = localStorage.getItem("globalDashboardData");
    // Wenn es ein Item mit dem Namen "globalDashboardData" im localStorage gibt, dann werden die Daten geladen:
    if (savedData) {
      const data = JSON.parse(savedData);
      globalThis.globalWidgetCounter = data.globalWidgetCounter;
      globalThis.globalStyleCounter = data.globalStyleCounter;
      document.getElementById("header-title").textContent = data.headerTitle;
      document.getElementById("headerImageValue").src = data.headerImage;
      popupLocalStorageLoaded();
    }
    return true;
  } else {
    // Keine Globale Daten wurden gefunden
    //alert("Im LocalStorage wurden keine Daten aus einer vergangenen Sitzung gefunden");
    // TODO: Möchtest du Daten hochladen?
    return false;
  }
}
*/

const propIDglobalData = project.RootObject.LookUpPropID("GlobalDashboardCreatorData");
const propIDstyleData = project.RootObject.LookUpPropID("DashboardCreatorStyleData");

function checkAsprovaStorageGlobalData() {
  let globalData = project.GetAsStr(propIDglobalData,1);
  if(globalData !== '') {
    console.log('Asprova Global Dashboard Daten sind vorhanden')
    const data = JSON.parse(globalData);
      globalThis.globalWidgetCounter = data.globalWidgetCounter;
      globalThis.globalStyleCounter = data.globalStyleCounter;
      document.getElementById("header-title").textContent = data.headerTitle;
      document.getElementById("headerImageValue").src = data.headerImage;
      popupLocalStorageLoaded();
    return true;
  }  else {
    console.log('Asprova Daten sind leer, initialisiere Dashboard')
    return false
  }
}


// Funktion, die ausgeführt wird, wenn initial das Item GlobalDashboardData angelegt wird
function initialGLobalDashboardData() {
  var globalDashboardData = {}; // Beginn mit leeren Klammern
  // Setzen des globalWidgetCounter-Werts
  globalDashboardData.globalWidgetCounter = globalThis.globalWidgetCounter;
  globalDashboardData.globalStyleCounter = globalThis.globalStyleCounter;

  // Speichern des default header title
  var headerTitle = document.getElementById("header-title").textContent;
  globalDashboardData.headerTitle = headerTitle;

  // Setzen der default Farbpalette als aktive zu Beginn
  globalDashboardData.PrimaryColor = "#efeff2";
  globalDashboardData.SecondaryColor = "#eff4f7";
  globalDashboardData.IconsColor = "#3db39e";
  globalDashboardData.FontColor = "#000000";
  globalDashboardData.TitleColor = "#000000";

  globalDashboardData.palettes = [
    // Light Mode
    {
      Name: "Light Mode",
      PrimaryColor: "#efeff2",
      SecondaryColor: "#eff4f7",
      IconsColor: "#3db39e",
      FontColor: "#000000",
      TitleColor: "#000000",
    },
    // Dark Mode
    {
      Name: "Dark Mode",
      PrimaryColor: "#181818",
      SecondaryColor: "#2c2c2c",
      IconsColor: "#3db39e",
      FontColor: "#ffffff",
      TitleColor: "#ffffff",
    },
    // custom 1
    {
      Name: "Custom 1",
      PrimaryColor: "null",
      SecondaryColor: "null",
      IconsColor: "null",
      FontColor: "null",
      TitleColor: "null",
    },
    // custom 2
    {
      Name: "Custom 2",
      PrimaryColor: "null",
      SecondaryColor: "null",
      IconsColor: "null",
      FontColor: "null",
      TitleColor: "null",
    },
    // custom 3
    {
      Name: "Custom 3",
      PrimaryColor: "null",
      SecondaryColor: "null",
      IconsColor: "null",
      FontColor: "null",
      TitleColor: "null",
    },
  ];

  // Speichern des default Bildes
  var headerImageValue = document.getElementById("headerImageValue");
  if (headerImageValue && headerImageValue.src) {
    globalDashboardData.headerImage = headerImageValue.src;
  }

  // Speichern der Daten im LocalStorage im Format einer JSON Datei
  /*localStorage.setItem(
    "globalDashboardData",
    JSON.stringify(globalDashboardData)
  ); */
  project.SetAsStr(propIDglobalData,1,JSON.stringify(globalDashboardData));
}

// Funktion, die ausgeführt wird, wenn das Item "GlobalDashboardData" im Local Storage aktualisiert wird
function updateGlobalDashboardData(info) {
  // Zuweisen des aktuellen Werts von globalDashboardData (falls vorhanden)
  var currentValue = project.GetAsStr(propIDglobalData,1);
  var globalDashboardData = JSON.parse(currentValue);

  // Daten aus dem SettingsModal werden aktualisiert
  if (info === "settings") {
    // Aktualisieren und Speichern des HeaderTitels
    var headerTitle = document.getElementById("header-title").textContent;
    globalDashboardData.headerTitle = headerTitle;

    // Aktualisieren und Speichern der Farbwerte
    globalDashboardData.PrimaryColor = globalThis.PrimaryC;
    globalDashboardData.SecondaryColor = globalThis.SecondaryC;
    globalDashboardData.IconsColor = globalThis.IconsC;
    globalDashboardData.FontColor = globalThis.FontC;
    globalDashboardData.TitleColor = globalThis.TitleC;

    var palettesArray = globalDashboardData.palettes;
    palettesArray[2] = globalThis.Custom1;
    palettesArray[3] = globalThis.Custom2;
    palettesArray[4] = globalThis.Custom3;

    // Überprüfen, ob ein Bild ausgewählt wurde
    var headerImageValue = document.getElementById("headerImageValue");
    if (headerImageValue && headerImageValue.src) {
      globalDashboardData.headerImage = headerImageValue.src;
    }
  } else if (info === "gridstack") {
    // Aktualisieren oder Setzen des globalWidgetCounter-Werts
    globalDashboardData.globalWidgetCounter = globalThis.globalWidgetCounter;
  } else if (info === "style") {
    // Aktualisieren oder Setzen des globalStyleCounter-Werts
    globalDashboardData.globalStyleCounter = globalThis.globalStyleCounter;
  }

  // Speichern der Daten im LocalStorage im JSON-Format
  /*
  localStorage.setItem(
    "globalDashboardData",
    JSON.stringify(globalDashboardData)
  );*/

  project.SetAsStr(propIDglobalData,1,JSON.stringify(globalDashboardData));
}

// Funktion zum Laden der gespeicherten Stile und Widget-Informationen
function loadData(styleNumber) {
  clearWindow();
  const savedData = project.GetAsStr(propIDstyleData,styleNumber);
  if (savedData) {
    const data = JSON.parse(savedData);

    // Widgets hinzufügen
    data.widgets.forEach((widgetInfo) => {
      createWidgetFromLoad(
        widgetInfo.title,
        widgetInfo.width,
        widgetInfo.height,
        widgetInfo.x,
        widgetInfo.y,
        widgetInfo.lock,
        widgetInfo.id,
        widgetInfo.chartType,
        widgetInfo.chartData,
        widgetInfo.NumOfEvals,
        widgetInfo.upToDate,
        widgetInfo.filter
      );
    });
    popupLoad();
  }
  // keine gespeicherten Daten zum Stil vorhanden
  else {
    popupNoLoad();
  }
}

// Funktion zum Speichern des aktuellen Stils und Widget-Informationen
function saveStyle() {
  const widgetData = [];
  const gridItems = document.querySelectorAll(".grid-stack-item");
  gridItems.forEach((item) => {
    const widgetInfo = {
      id: item.id,
      title: item.querySelector("h3").textContent,
      width: parseInt(item.getAttribute("gs-w")),
      height: parseInt(item.getAttribute("gs-h")),
      x: parseInt(item.getAttribute("gs-x")),
      y: parseInt(item.getAttribute("gs-y")),
      lock: item.getAttribute("lock"),
      chartType: item.getAttribute("chartType"),
      chartData: item.getAttribute("data"),
      NumOfEvals: parseInt(item.getAttribute("NumOfEvals")),
      upToDate: item.getAttribute("upToDate"),
      filter: item.getAttribute("filter"),
    };
    widgetData.push(widgetInfo);
  });
  const data = {
    styleNumber: activeStyle,
    styleTitle: getActiveStyleButton().textContent,
    widgets: widgetData,
  };
  /*
  localStorage.setItem(
    "savedData" + globalThis.activeStyle,
    JSON.stringify(data)
  );
  */
  project.SetAsStr(propIDstyleData,globalThis.activeStyle,JSON.stringify(data))

  updateGlobalDashboardData("gridstack");
  popupSaved();
}

// Funktion zum Laden eines Stils
function loadStyle(styleNumber) {
  clearWindow();
  //Prüfen, ob schon Daten im LocalStorage zu dem jeweiligen Stil existieren
  if (project.GetAsStr(propIDstyleData,styleNumber) !== null) {
    // falls ja, dann werden diese in den Gridstack geladen
    loadData(styleNumber);
  } else {
    clearWindow();
  }
}

// Send to Backend
function uploadGlobalData() {
  let localStorageData = getLocalStorageData();
  console.log(localStorageData);
  sendDataToBackend(localStorageData);
}

function getLocalStorageData() {
  let data = {};
  const regex = new RegExp("remember*");
  for (let i = 0; i < localStorage.length; i++) {
    if (regex.test(localStorage.key(i))) {
    } else {
      let key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
  }
  return data;
}

function sendDataToBackend(data) {
  fetch("http://localhost:3000/saveData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
