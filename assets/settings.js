/* settings.js
  Umfasst alle Funktionen, welche im Einstellungsmenü (SettingsModal, geöffnet durch Zahnrad-Schaltfläche) benötigt werden 
*/

// Funktion, welche vor dem Anzeigen des SettingsModals ausgeführt wird, und die sichtbaren Daten lädt
function prepareSettingsModal() {
  document.getElementById("modalSettingsHeader").value =
    document.getElementById("header-title").textContent;

  // Hex-Code in die label überhalb der Icons Laden:
  loadHexCodes();
  // Aktuelle Farben in die Icons Laden:
  loadIconColors();
  // Prüfen, ob Custom-Paletten verfügbar sind
  checkPaletteAvailability();
  // Prüfe, ob eine bestehende Palette aktuell ausgewählt ist, wenn ja highlighte diese, wenn nein Info
  checkActivePalette(0);

  document.getElementById("settingsModalPrimaryColor").style.color =
    globalThis.PrimaryC;
  document.getElementById("settingsModalSecondaryColor").style.color =
    globalThis.SecondaryC;
  document.getElementById("settingsModalIconsColor").style.color =
    globalThis.IconsC;
  document.getElementById("settingsModalFontColor").style.color =
    globalThis.FontC;
  document.getElementById("settingsModalTitleColor").style.color =
    globalThis.TitleC;
}

// Funktion, welche das SettingsModal sichtbar macht
function openSettingsModal() {
  // Bevor das Settings Modal angezeigt wird:
  prepareSettingsModal();

  // Settings Modal anzeigen:
  var modalOverlay = document.getElementById("modalSettingsOverlay");
  var modal = document.getElementById("adjustSettingsModal");
  modalOverlay.style.display = "block";
  modal.style.display = "block";
}

// Funktion, welche das SettingsModal schließt
function closeSettingsModal() {
  var modal = document.getElementById("adjustSettingsModal");
  var modalOverlay = document.getElementById("modalSettingsOverlay");
  modalOverlay.style.display = "none";
  modal.style.display = "none";
}

// Funktion, welche nicht bestätigte Änderungen rückgängig macht und dann das Settingsmodal schließt
function cancelSettingsModal() {
  getStorageColorProperties(); // setzt die aktiven Farbwerte zurück zu den letzten im Storage gespeicherten
  getStorageCustomPalettes(); // stellt die zu letzt gespeicherten Paletten wiederher
  var headerImage = document.getElementById("headerImageValue");
  headerImage.src = getSavedHeaderImage();
  closeSettingsModal();
  popupSettingsCanceled();
}

// Funktion, welche ausgeführt wird nachdem auf den "Bestätigen" Button gedrückt wird
function confirmSettingsModal() {
  document.getElementById("header-title").textContent = document.getElementById(
    "modalSettingsHeader"
  ).value;
  updateGlobalDashboardData("settings");
  updateColorVariables();
  updateStyleButtonColor(parseInt(globalThis.activeStyle));
  closeSettingsModal();
  popupSettingsSaved();
}

// Header-Funktionen:

// Funktion, welche bei Betätigung des "Bilddatei auswählen Knopfs" den Explorer öffnet, um ein Bild auszuwählen
function chooseImageforHeader() {
  // Erstellen Sie ein unsichtbares Datei-Eingabefeld
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";

  // Fügen Sie das Datei-Eingabefeld zum Dokument hinzu
  document.body.appendChild(fileInput);

  // Fügen Sie einen Event-Listener hinzu, um auf die Auswahl der Datei zu reagieren
  fileInput.addEventListener("change", function () {
    var file = this.files[0];

    if (file) {
      // Überprüfen Sie, ob die ausgewählte Datei eine Bilddatei ist
      if (file.type.startsWith("image/")) {
        // Lesen Sie die Datei als URL
        var reader = new FileReader();
        reader.onload = function (event) {
          // Ändern Sie die Quelle des headerImageValue-Elements
          var headerImage = document.getElementById("headerImageValue");
          headerImage.src = event.target.result;

          // Entfernen Sie das Datei-Eingabefeld vom Dokument
          document.body.removeChild(fileInput);
        };
        reader.readAsDataURL(file);
      } else {
        alert(
          "Die ausgewählte Datei ist keine Bilddatei. Bitte wählen Sie eine Bilddatei aus."
        );
      }
    }
  });

  // Öffnen Sie das Datei-Eingabefeld
  fileInput.click();
}

// Funktion, welche aus dem LocalStorage das gespeicherte Bild zurückgibt
function getSavedHeaderImage() {
  const savedData = project.GetAsStr(propIDglobalData,1);
  const data = JSON.parse(savedData);
  return data.headerImage;
}

// Color & Themes Funktionen:

// Hex-Code in die label überhalb der Icons Laden:
function loadHexCodes() {
  document.getElementById("modalSettingsPrimaryValue").textContent =
    globalThis.PrimaryC;
  document.getElementById("modalSettingsSecondaryValue").textContent =
    globalThis.SecondaryC;
  document.getElementById("modalSettingsIconsValue").textContent =
    globalThis.IconsC;
  document.getElementById("modalSettingsFontValue").textContent =
    globalThis.FontC;
  document.getElementById("modalSettingsTitleValue").textContent =
    globalThis.TitleC;
}

// Funktion, welche die aktuell aktiven Farben aus den globalen variablen in die Icons (Kreise) lädt
function loadIconColors() {
  // Aktuelle Farben in die Icons Laden:
  document.getElementById("settingsModalPrimaryColor").style.color =
    globalThis.PrimaryC;
  document.getElementById("settingsModalSecondaryColor").style.color =
    globalThis.SecondaryC;
  document.getElementById("settingsModalIconsColor").style.color =
    globalThis.IconsC;
  document.getElementById("settingsModalFontColor").style.color =
    globalThis.FontC;
  document.getElementById("settingsModalTitleColor").style.color =
    globalThis.TitleC;
}

// Funktion, welche vor dem Anzeigen des Settingsmodals und beim Überschrieben von Custom Paletten prüft, welche Custom Paletten gespeicherte Daten haben
// Die Buttons Custom-Paletten ohne gespeicherte Daten werden deaktiviert und das Icon ist durchgestrichen
function checkPaletteAvailability() {
  const savedData = project.GetAsStr(propIDglobalData,1);
  const data = JSON.parse(savedData);
  var palettesArray = data.palettes;
  const empty = "null"; // Initial haben die Custom-Paletten in ihren Farbwerten "null" stehen

  const buttonC1 = document.getElementById("buttonScheme3");
  const buttonC2 = document.getElementById("buttonScheme4");
  const buttonC3 = document.getElementById("buttonScheme5");

  for (let i = 2; i < palettesArray.length; i++) {
    const element = palettesArray[i];
    if (element.PrimaryColor === empty && i === 2) {
      buttonC1.disabled = true;
      buttonC1.querySelector("i").className = "fa-solid fa-droplet-slash";
    } else if (i === 2) {
      buttonC1.disabled = false;
      buttonC1.querySelector("i").className = "fa-solid fa-droplet";
    } else if (element.PrimaryColor === empty && i === 3) {
      buttonC2.disabled = true;
      buttonC2.querySelector("i").className = "fa-solid fa-droplet-slash";
    } else if (i === 3) {
      buttonC2.disabled = false;
      buttonC2.querySelector("i").className = "fa-solid fa-droplet";
    } else if (element.PrimaryColor === empty && i === 4) {
      buttonC3.disabled = true;
      buttonC3.querySelector("i").className = "fa-solid fa-droplet-slash";
    } else if (i === 4) {
      buttonC3.disabled = false;
      buttonC3.querySelector("i").className = "fa-solid fa-droplet";
    }
  }
}

// Funktion, welche vor dem Anzeigen des Settingsmodal prüft, ob das aktuelle Farbschema eines der gespeicherten ist
function checkActivePalette(startNumber) {
  const savedData = project.GetAsStr(propIDglobalData,1);
  const data = JSON.parse(savedData);
  var palettesArray = data.palettes;

  clearHighlightedPalette();

  var labelElement = document.querySelector(
    'label[for="infoActiveColorscheme"]'
  );
  labelElement.textContent = "";

  var labelWarning = document.querySelector(
    'label[for="warningActiveColorScheme"]'
  );
  labelWarning.style.display = "inline";

  for (let i = startNumber; i < palettesArray.length; i++) {
    if (i == 0 || i == 1) {
      const element = palettesArray[i];
      if (checkSimilarColors(element)) {
        if (i == 0) {
          document.getElementById("buttonScheme1").style.backgroundColor =
            "var(--iconsColor)";
        } else {
          document.getElementById("buttonScheme2").style.backgroundColor =
            "var(--iconsColor)";
        }
        labelElement.textContent = element.Name;
        labelWarning.style.display = "none";
        break;
      }
    } else {
      if (i == 2) {
        const element = globalThis.Custom1;
        if (checkSimilarColors(element)) {
          document.getElementById("buttonScheme3").style.backgroundColor =
            "var(--iconsColor)";
          labelElement.textContent = element.Name;
          labelWarning.style.display = "none";
          break;
        }
      } else if (i == 3) {
        const element = globalThis.Custom2;
        if (checkSimilarColors(element)) {
          document.getElementById("buttonScheme4").style.backgroundColor =
            "var(--iconsColor)";
          labelElement.textContent = element.Name;
          labelWarning.style.display = "none";
          break;
        }
      } else if (i == 4) {
        const element = globalThis.Custom3;
        if (checkSimilarColors(element)) {
          document.getElementById("buttonScheme5").style.backgroundColor =
            "var(--iconsColor)";
          labelElement.textContent = element.Name;
          labelWarning.style.display = "none";
          break;
        }
      }
    }
  }
}

// Funktion, welche den Hintergund aller Farbpalettenbuttons unsichtbar macht
function clearHighlightedPalette() {
  document.getElementById("buttonScheme1").style.backgroundColor =
    "transparent";
  document.getElementById("buttonScheme2").style.backgroundColor =
    "transparent";
  document.getElementById("buttonScheme3").style.backgroundColor =
    "transparent";
  document.getElementById("buttonScheme4").style.backgroundColor =
    "transparent";
  document.getElementById("buttonScheme5").style.backgroundColor =
    "transparent";
}

// Prüft, ob von einer übergebenen Palette alle Farben mit den aktuell ausgewählten Farben übereinstimmt.
// Wird in der Funktion "checkActivePalette" genutzt
function checkSimilarColors(element) {
  if (
    globalThis.PrimaryC == element.PrimaryColor &&
    globalThis.SecondaryC == element.SecondaryColor &&
    globalThis.IconsC == element.IconsColor &&
    globalThis.FontC == element.FontColor &&
    globalThis.TitleC == element.TitleColor
  ) {
    return true;
  }
}

// Funktion, welche die im LocalStorage gespeicherten aktiven Farbwerte in die globalen variablen lädt
function getStorageColorProperties() {
  const savedData = project.GetAsStr(propIDglobalData,1);
  const data = JSON.parse(savedData);
  globalThis.PrimaryC = data.PrimaryColor;
  globalThis.SecondaryC = data.SecondaryColor;
  globalThis.IconsC = data.IconsColor;
  globalThis.FontC = data.FontColor;
  globalThis.TitleC = data.TitleColor;
  updateColorVariables();
}

// Funktion, welche die im LocalStorage gespeicherten oder initialisierten Paletten in globale Variablen lädt
function getStorageCustomPalettes() {
  const savedData = project.GetAsStr(propIDglobalData,1);
  const data = JSON.parse(savedData);
  var palettesArray = data.palettes;
  globalThis.Custom1 = palettesArray[2];
  globalThis.Custom2 = palettesArray[3];
  globalThis.Custom3 = palettesArray[4];
}

// Funktion, welche den ColorPicker öffnet
function openColorPicker(buttonId) {
  // globalThis.colorPickerStatus = 1;
  globalThis.activeColorButton = buttonId;
  let colorInput = document.getElementById("colorPickerWindow");
  colorInput.click();
}

// Funktion, welche die CSS-Variablen für die Farben aktualsiert, indem die Werte der globalen Variablen der Farben in diesen Wert geladen wird
function updateColorVariables() {
  // Set CSS variables using global variables
  document.documentElement.style.setProperty(
    "--primaryColor",
    globalThis.PrimaryC
  );
  document.documentElement.style.setProperty(
    "--secondaryColor",
    globalThis.SecondaryC
  );
  document.documentElement.style.setProperty("--iconsColor", globalThis.IconsC);
  document.documentElement.style.setProperty("--fontColor", globalThis.FontC);
  document.documentElement.style.setProperty("--titleColor", globalThis.TitleC);
}

// Funktion, welche ausgeführt wird, wenn beim ColorPicker eine neue Farbe ausgewählt wurde.
// Der ausgewählte Farbwert wird im Icon angezeigt und in der jeweiligen globalen Variable gespeichert
// Auch der Hexcode wird dabei aktualisiert
function setColor(buttonId) {
  let colorInput = document.getElementById("colorPickerWindow");
  let color = colorInput.value;

  if (buttonId === "settingsModalPrimaryColor") {
    globalThis.PrimaryC = color;
    document.getElementById("settingsModalPrimaryColor").style.color =
      globalThis.PrimaryC;
  } else if (buttonId === "settingsModalSecondaryColor") {
    globalThis.SecondaryC = color;
    document.getElementById("settingsModalSecondaryColor").style.color =
      globalThis.SecondaryC;
  } else if (buttonId === "settingsModalIconsColor") {
    globalThis.IconsC = color;
    document.getElementById("settingsModalIconsColor").style.color =
      globalThis.IconsC;
  } else if (buttonId === "settingsModalFontColor") {
    globalThis.FontC = color;
    document.getElementById("settingsModalFontColor").style.color =
      globalThis.FontC;
  } else if (buttonId === "settingsModalTitleColor") {
    globalThis.TitleC = color;
    document.getElementById("settingsModalTitleColor").style.color =
      globalThis.TitleC;
  }

  loadHexCodes();
  checkActivePalette(getPaletteNumberFromId(buttonId));
}

// Hilfsfunktion, welche ausgehend von der ButtonId die Position/ Nummer des Palettenbuttons zurückgibt
function getPaletteNumberFromId(buttonId) {
  if (buttonId == "settingsModalPrimaryColor") {
    return 0;
  } else if (buttonId == "settingsModalSecondaryColor") {
    return 1;
  } else if (buttonId == "settingsModalIconsColor") {
    return 2;
  } else if (buttonId == "settingsModalFontColor") {
    return 3;
  } else if (buttonId == "settingsModalTitleColor") {
    return 4;
  }
}

// Funktion, welche das durch die buttons ausgewählte Farbschema lädt.
// Bei Dark Mode & Light Mode die Farbwerte aus dem Local Storage geladen
// Bei den 3 Custom Paletten werden die Farbwerte aus den globalen Variablen geladen
function loadScheme(number) {
  var savedData = project.GetAsStr(propIDglobalData,1);
  var data = JSON.parse(savedData);
  var palettesArray = data.palettes;

  for (let i = 0; i <= 1; i++) {
    if (i == number) {
      setPalette(palettesArray[number]);
      popupPaletteSelection(palettesArray[number].Name);
      checkActivePalette(number);
      return;
    }
  }
  if (number == 2) {
    setPalette(globalThis.Custom1);
    popupPaletteSelection(globalThis.Custom1.Name);
  } else if (number == 3) {
    setPalette(globalThis.Custom2);
    popupPaletteSelection(globalThis.Custom2.Name);
  } else if (number == 4) {
    setPalette(globalThis.Custom3);
    popupPaletteSelection(globalThis.Custom3.Name);
  }
  checkActivePalette(number);
}

// Funktion, welche durch die Funktion loadScheme() aufgerufen wird und in die globalen Variablen die gespeicherten Farben der ausgewählten Palette reinlädt
function setPalette(palette) {
  globalThis.PrimaryC = palette.PrimaryColor;
  globalThis.SecondaryC = palette.SecondaryColor;
  globalThis.IconsC = palette.IconsColor;
  globalThis.FontC = palette.FontColor;
  globalThis.TitleC = palette.TitleColor;
  loadHexCodes();
  loadIconColors();
}

// Funktion, welche bei Buttonklick auf die "Überschreiben"-Buttons ausgeführt wird und die ausgewählten Farben in die globalen Variablen lädt
function updateCustomPalette(number) {
  const warning = document.querySelector(
    'label[for="warningActiveColorScheme"]'
  );

  // Custom Palette kann nur angelegt werden, wenn die aktuelle Paletten Kombination noch nicht gespeichert ist
  // --> Funktionalität, dass Custom-Palette überschrieben wird, wird nur dann gewährleistet, wenn Warninfo aktiv ist
  if (warning.style.display != "none") {
    const buttonC1 = document.getElementById("buttonScheme3");
    const buttonC2 = document.getElementById("buttonScheme4");
    const buttonC3 = document.getElementById("buttonScheme5");

    var palette = null;
    if (number == 2) {
      palette = globalThis.Custom1;
      buttonC1.querySelector("i").className = "fa-solid fa-droplet";
      buttonC1.disabled = false;
      popupOverwriteCustomPalette("Custom 1");
    } else if (number == 3) {
      palette = globalThis.Custom2;
      buttonC2.querySelector("i").className = "fa-solid fa-droplet";
      buttonC2.disabled = false;
      popupOverwriteCustomPalette("Custom 2");
    } else if (number == 4) {
      palette = globalThis.Custom3;
      buttonC3.querySelector("i").className = "fa-solid fa-droplet";
      buttonC3.disabled = false;
      popupOverwriteCustomPalette("Custom 3");
    }

    palette.PrimaryColor = globalThis.PrimaryC;
    palette.SecondaryColor = globalThis.SecondaryC;
    palette.IconsColor = globalThis.IconsC;
    palette.FontColor = globalThis.FontC;
    palette.TitleColor = globalThis.TitleC;
    checkActivePalette(number);
  }
}
