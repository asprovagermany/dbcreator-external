// styleLogic.js

// Funktion, welche bei Betätigung des rechten Scrollbuttons ausgelöst wird
// Die Funktion berechnet die Breite, wie weit nach rechts gescrollt wird, damit der nächste Button am linken Anfang des sichtbaren bereichs angezeigt wird
function scrollR() {
  const container = document.querySelector(".stylebar-container");
  // Aktuelle Scrollposition des Containers, angepasst um 40px, weil realer und sichtbarer anfang unterschiedlich sind
  const scrollLeft = container.scrollLeft + 40;
  const containerWidth = container.clientWidth; // Breite des sichtbaren Containers
  const buttons = Array.from(container.querySelectorAll(".style-button")); // Stylebuttons in ein Array, damit sie durchgegangen werden in for-Schleife

  // Finden des ersten Buttons, von dem ein Teil oder alles im sichtbaren Bereich liegt
  let firstVisibleButton = null;
  for (const button of buttons) {
    const buttonRight = button.offsetLeft + button.offsetWidth;
    if (
      (button.offsetLeft >= scrollLeft &&
        button.offsetLeft < scrollLeft + containerWidth) ||
      (buttonRight > scrollLeft && buttonRight <= scrollLeft + containerWidth)
    ) {
      firstVisibleButton = button;
      break;
    }
  }

  if (firstVisibleButton) {
    // Berechnen, um wie viel px nach rechts gescrollt werden muss:
    var scrollAmount =
      firstVisibleButton.offsetLeft +
      firstVisibleButton.offsetWidth -
      scrollLeft;
    if (scrollAmount < 2) {
      scrollAmount = 2;
    }
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
}

// Funktion, welche bei Betätigung des linken Scrollbuttons ausgelöst wird
// Die Funktion berechnet die Breite, wie weit nach rechts gescrollt wird, damit der nächste Button am linken Anfang des sichtbaren bereichs angezeigt wird
function scrollL() {
  const container = document.querySelector(".stylebar-container");
  // Aktuelle Scrollposition des Containers, angepasst mit 40, weil realer und sichtbarer Anfang unterschiedlich sind
  // 58px ist Beginn des ersten Buttons
  const scrollLeft = container.scrollLeft + 40;
  const buttons = Array.from(container.querySelectorAll(".style-button"));
  let targetButton = null;
  var remember = null;

  // Suche nach dem ersten Button, der entweder geteilt wird oder links außerhalb des sichtbaren Bereichs liegt
  for (const button of buttons) {
    const buttonRight = button.offsetLeft + button.offsetWidth; // Rechtes Ende des Buttons

    // Fall 1: Überprüfung, ob der Button geteilt wird
    if (button.offsetLeft < scrollLeft && buttonRight > scrollLeft) {
      targetButton = button;
      break;
    }

    // Fall 2: Überprüfung, ob der Button komplett links außerhalb des sichtbaren Bereichs liegt
    if (buttonRight <= scrollLeft) {
      remember = button;
    }
  }

  // Falls es keinen Button gibt, der geteilt wurde wird der rechteste Button genommen, der komplett links außerhalb des sichtbaren Bereichs ist
  if (targetButton == null) {
    targetButton = remember;
  }

  if (targetButton) {
    const scrollAmount = Math.abs(targetButton.offsetLeft - scrollLeft) + 10; // + 10 wegen margin-right: 10 für die style buttons
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" }); // Scrollen nach links
  }
  // Wenn kein Button links neben dem sichbaren Bereich gefunden wurde, dann wird defaultmäßig 100 nach links gescrollt
  else {
    const scrollAmount = 100;
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" }); // Scrollen nach links
  }
}

function styleButtonLoadTitle(button, styleData) {
  button.textContent = styleData.styleTitle;
}

// Funktion zum Laden der gespeicherten Stilbuttons beim Start der Seite
function loadSavedStyleButtons() {
  let styleBarContainer = document.getElementById("stylebar-container");
  styleBarContainer.innerHTML = '';
  for (let i = 1; i <= project.RootObject.PropertyValueCount(project,propIDstyleData); i++) {
    const savedData = project.GetAsStr(propIDstyleData,i);
    if (savedData !== null) {
      const data = JSON.parse(savedData);
      addStyleButtonFromSave(i, data.styleTitle);
    }
  }
  checkScroll();
}

// Funktion, welche beim laden der Seite ausgeführt wird und für jeden gespeicherten Stil aus dem LocalStorage einen Button in der Stilleiste hinzufügt
function addStyleButtonFromSave(idNumber, stylename) {
  const styleBarContainer = document.getElementById("stylebar-container");

  const newButton = document.createElement("button");
  const newButtonId = "style_" + idNumber;

  newButton.classList.add("style-button");
  newButton.id = newButtonId;
  newButton.textContent = stylename;
  newButton.addEventListener("click", function () {
    setActiveStyle(idNumber);
  });

  styleBarContainer.appendChild(newButton);
}

// Funktion, welche den gespeicherten Stil mit dem geringsten Index findet und dessen Nummer zurückgibt
function getFirstStyleNumber() {
  for (let i = 1; i <= globalStyleCounter; i++) {
    const savedData = project.GetAsStr(propIDstyleData,i);
    if (savedData !== null) {
      return i;
    }
  }
  return null; // Es wurde kein gespeicherter Stil gefunden
}

// Funktion, welche den gespeicherten Stil findet, der am nähesten links vom aktiven Stil ist.
// Alternativ wird der Stil, der am nähesten rechts vom aktiven Stil ist gefunden
// Gibt es keinen weiteren gespeicherten Stil, dann gibt die Funktion null zurück
function getClosestStyleNumber() {
  let closestLowerStyleNumber = null;
  let closestHigherStyleNumber = null;

  for (let i = 1; i <= globalStyleCounter; i++) {
    const savedData = project.GetAsStr(propIDstyleData,i);
    if (savedData !== null) {
      if (i <= globalThis.activeStyle) {
        if (
          !closestLowerStyleNumber ||
          globalThis.activeStyle - i <
            globalThis.activeStyle - closestLowerStyleNumber
        ) {
          closestLowerStyleNumber = i;
        }
      } else {
        if (
          !closestHigherStyleNumber ||
          i - globalThis.activeStyle <
            closestHigherStyleNumber - globalThis.activeStyle
        ) {
          closestHigherStyleNumber = i;
        }
      }
    }
  }

  if (closestLowerStyleNumber !== null) {
    return closestLowerStyleNumber;
  } else {
    return closestHigherStyleNumber;
  }
}

// Funktion zum Hinzufügen eines Stil-Buttons, indem ein neuer Button generiert und in das DOM hinzugefügt wird
function addStyleButton() {
  const styleBarContainer = document.getElementById("stylebar-container");

  // Prüfen, ob das Maximum an Stilen erreicht wurde
  if (styleBarContainer.children.length >= 20) {
    alert("Maximal 20 Stile können erstellt werden.");
    return;
  }

  // Wenn das Limit noch nicht erreicht wurde, dann wird ein neuer Button für einen neuen Stil angelegt:
  const idNumber = globalThis.globalStyleCounter + 1;
  const newButton = document.createElement("button");
  const newButtonId = "style_" + idNumber;

  newButton.classList.add("style-button");
  newButton.id = newButtonId;
  newButton.textContent = "style_" + idNumber;
  newButton.addEventListener("click", function () {
    setActiveStyle(idNumber);
  });
  styleBarContainer.appendChild(newButton);
  setActiveStyle(idNumber);
  checkScroll();

  // Nachdem der neue Stil sichtlich hinzugefügt wurde öffnet sich das Modal zum Anlegen des Stils:
  openStyleModal("", newButton);
}

// Funktion, welche die Daten des ausgewählten Stils lädt
function setActiveStyle(pressedButtonNumber) {
  if (pressedButtonNumber !== null) {
    // Stellt sicher, dass, falls noch kein Stil gespeichert ist, ein initialer Stil angelegt wird
    if (pressedButtonNumber === "Initial") {
      pressedButtonNumber = 1;
      addStyleButton();
    }

    // Aktualisiere die Werte des aktives Stil
    globalThis.activeStyle = pressedButtonNumber;
    globalThis.activeStyleName = getActiveStyleButton().textContent;
    loadStyle(globalThis.activeStyle); // Lade gespeicherte Daten des Stils aus dem LocalStorage
    updateStyleButtonColor(parseInt(globalThis.activeStyle));
    addLangWidgetButtons();
  } else {
    popupNoStyleAvailable();
  }
}

// Funktion, welche den Button des aktuell ausgewählten oder geladenen Stil türkis highlighted
function updateStyleButtonColor(pressedButtonNumber) {
  // Alle Style-Buttons erhalten ihre Standardhintergrundfarbe zurück
  var styleButtons = document.querySelectorAll(".style-button");
  styleButtons.forEach(function (button) {
    button.style.backgroundColor = ""; // Leer lassen, um zum Standard zurückzukehren
  });

  // Der aktuell gedrückte Style-Button wird türkis
  var pressedButton = document.getElementById("style_" + pressedButtonNumber);
  if (pressedButton !== null) {
    const iconcolor =
      document.documentElement.style.getPropertyValue("--iconsColor");
    pressedButton.style.backgroundColor = iconcolor; // Icon Farbe
  }
  checkScroll();
}

// Funktion, welche den Button des Aktiven Stils zurückgibt
function getActiveStyleButton() {
  const styleButtons = document.querySelectorAll(".style-button");
  let activeButton = null;

  styleButtons.forEach((button) => {
    const buttonId = button.id;
    const buttonNumber = buttonId.split("_")[1]; // Extrahiere die Zahl aus der ID
    if (buttonNumber === globalThis.activeStyle.toString()) {
      activeButton = button; // Der aktive Button wurde gefunden
    }
  });
  return activeButton; // Gib den aktiven Button zurück (kann auch null sein)
}

// Funktion, welche den aktuell ausgewählten Stil aus dem LocalStorage und entfernt und den button aus dem DOM-Baum entfernt
function deleteStyle() {
  if (globalThis.activeStyle !== null) {

    project.SetAsStr(propIDstyleData, globalThis.activeStyle,'');
    popupRemoved();
    adjustSavedStyleNumber(globalThis.activeStyle);


    const styleBarContainer = document.getElementById("stylebar-container");
    const buttonToRemove = document.getElementById(
      "style_" + globalThis.activeStyle
    );

    if (buttonToRemove) {
      styleBarContainer.removeChild(buttonToRemove);
      checkScroll();
    }
    loadSavedStyleButtons()
  } else {
    popupNoStyleToDelete();
    return;
  }

  const styleToLoad = getClosestStyleNumber();
  if (styleToLoad !== null) {
    setActiveStyle(styleToLoad);
  } else {
    globalThis.activeStyle = null;
    globalThis.activeStyleName = null;
    popupNoStyleAvailable();
  }
}

function adjustSavedStyleNumber(activeStyle) {
  let styleCount = project.RootObject.PropertyValueCount(project,propIDstyleData);
  let deletedStyle = activeStyle;

  for (let i = 1; i <= styleCount; i++) {
    let currentStyleData = JSON.parse(project.GetAsStr(propIDstyleData,i));
    currentStyleData.styleNumber > deletedStyle ? currentStyleData.styleNumber = currentStyleData.styleNumber-1:false;
    project.SetAsStr(propIDstyleData,i,JSON.stringify(currentStyleData))
  }
  let globalData = JSON.parse(project.GetAsStr(propIDglobalData,1));
  globalData.globalStyleCounter = project.RootObject.PropertyValueCount(project,propIDstyleData);
  project.SetAsStr(propIDglobalData,1,JSON.stringify(globalData));
  globalThis.globalStyleCounter = project.RootObject.PropertyValueCount(project,propIDstyleData);
}

// Code für das Stil Modal
// Funktion zum Öffnen des Style-Modals
function openStyleModal(info, availableButton) {
  // Anzeigen des Modals
  if (info === "umbenennen") {
    document.getElementById("modalStyleTitle").value =
      getActiveStyleButton().textContent;
    changeStyleModalTitle(getSelectedLanguageObject().editStyleTitle);
  } else {
    document.getElementById("modalStyleTitle").value = availableButton.id;
    changeStyleModalTitle(getSelectedLanguageObject().newStyleTitle);
  }
  validateStyleInput();

  var modalOverlay = document.getElementById("modalStyleOverlay");
  var modal = document.getElementById("adjustStyleModal");
  modalOverlay.style.display = "block";
  modal.style.display = "block";
}

// Funktion zum Ändern des Titels im oberen Bereich des Modal
function changeStyleModalTitle(newTitle) {
  // Zugriff auf das <h2>-Element im Modal und Ändern des Textinhalts
  document.getElementById("adjustStyleModal").querySelector("h2").textContent =
    newTitle;
}

// Funktion zum Schließen des Style-Modals
function closeStyleModal(info) {
  var modal = document.getElementById("adjustStyleModal");
  var modalOverlay = document.getElementById("modalStyleOverlay");

  // Abbruch beim Erstellen eines neuen Stils führt dazu, dass der Button in der Stilliste verschwindet und der erste verfügbare Stil geladen wird
  if (
    modal.querySelector("h2").textContent ===
      getSelectedLanguageObject().newStyleTitle &&
    info === "forcedExit"
  ) {
    deleteStyle();
    popupCancelled();
    const styleToLoad = getClosestStyleNumber();
    setActiveStyle(styleToLoad);
  }

  modalOverlay.style.display = "none";
  modal.style.display = "none";
}

// Funktion zum Bestätigung der Anlegung eines neuen Stils oder der Namensänderung eines bestehenden Stils
function confirmStyleModal(confirmInfo) {
  const styleButton = getActiveStyleButton();

  // lese Inhalt aus dem Textfeld für den Stilnamen
  const styleTitle = document.getElementById("modalStyleTitle").value;

  styleButton.textContent = styleTitle;
  globalThis.activeStyleName = getActiveStyleButton().textContent;
  popupStyleModal();

  // Zusätzliches Speichern des Stil, da der "Speichern und Bestätigen" betätigt wurde
  if (confirmInfo === "Save") {
    globalThis.globalStyleCounter++; // +1 Erhöhung, da ein neuer Stil angelegt und gespeichert wurde
    updateGlobalDashboardData("style"); // Aktualisiert den globalStyleCounter im LocalStorage
    saveStyle(); // Speichern des Stils im LocalStorage
    globalThis.activeStyleName = getActiveStyleButton().textContent;
  }

  closeStyleModal("exitConfirm");
  checkScroll();
}

// Funktion zum überprüfen der Breite und Höhe beim Erstellen oder Editieren eines Widgets. Sperrt bei ungültiger Validierung den Bestätigungsbutton
function validateStyleInput() {
  const titleInput = document.getElementById("modalStyleTitle").value;

  const titleError = document.getElementById("styleTitleError");

  const confirmAndSaveButton = document.getElementById(
    "styleModalConfirmAndSaveButton"
  );

  // Überprüfen, ob die Eingabe für den Titel des Stils zwischen 1 und 25 Zeichen liegt
  const isValidTitle = titleInput.length > 0 && titleInput.length <= 25;
  const modalStyleHeader = document
    .getElementById("adjustStyleModal")
    .querySelector("h2").textContent;

  // Aktualisieren der Fehlermeldungen und Bestätigungsbutton-Zustand
  if (!isValidTitle) {
    titleError.textContent =
      "Der Stilname muss zwischen 1 und 25 Zeichen lang sein";
    confirmAndSaveButton.disabled = true;
  } else {
    titleError.textContent = "";
    if (modalStyleHeader !== "Neuen Stil erstellen") {
      confirmAndSaveButton.disabled = false;
    } else {
      confirmAndSaveButton.disabled = false;
    }
  }
}
