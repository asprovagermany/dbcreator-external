//popUpMessage.js

// Funktion zum Anzeigen der Pop-ups für jeweils 5 Sekunden in der rechten unteren Ecke
function showPopup(message) {
  var popup = document.getElementById("popup");
  popup.innerHTML += "<div>" + message + "</div>"; // Neue Nachricht an unterster Stelle hinzufügen
  popup.style.display = "block";
  setTimeout(function () {
    var messageDivs = popup.querySelectorAll("div");
    messageDivs[0].remove(); // Erste Nachricht entfernen
    if (messageDivs.length == 1)
      // Wenn keine weiteren Nachrichten vorhanden sind
      popup.style.display = "none";
  }, 5000); // 5 Sekunden
}

/* Aktionen, welche die Pop-ups automatisch auslösen sollen (Bsp. Knopfdruck):
  Info: DOMContentLoaded stellt sicher, dass die EventListener erst hinzugefügt werden,
  nachdem der DOM vollständig geladen wurde */
document.addEventListener("DOMContentLoaded", function () {
  var clear = document.getElementById("clear-window");

  clear.addEventListener("click", function () {
    showPopup(getSelectedLanguageObject().popupClear);
  });
});

// Auflistung von Pop-up Funktionen zu den jeweiligen use-cases:

// 1. Wenn ein neuer Stil angelegt oder umbenannt wird
function popupStyleModal() {
  if (
    document.getElementById("adjustStyleModal").querySelector("h2")
      .textContent === getSelectedLanguageObject().newStyleTitle
  ) {
    showPopup(getSelectedLanguageObject().popupNewStyle);
  } else {
    showPopup(getSelectedLanguageObject().popupRenamedStyle);
  }
}

// 2. Wenn die Erstellung eines neuen Stils abgebrochen wird
function popupCancelled() {
  showPopup(getSelectedLanguageObject().popupAbortStyle);
}

// 3. Wenn ein Stil gelöscht wird
function popupRemoved() {
  showPopup(
    getSelectedLanguageObject().popupStyle +
      '<span style="color: ' +
      globalThis.IconsC +
      '; font-weight: bold;">' +
      globalThis.activeStyleName +
      "</span>" +
      getSelectedLanguageObject().popupDelete
  );
}

// 4. Wenn ein Stil nicht geladen werden konnte
function popupNoLoad() {
  showPopup(getSelectedLanguageObject().popupErrorLoadStyle);
}

// 5. Wenn ein Stil geladen wurde
function popupLoad() {
  showPopup(
    getSelectedLanguageObject().popupStyle +
      '<span style="color: ' +
      globalThis.IconsC +
      '; font-weight: bold;">' +
      globalThis.activeStyleName +
      "</span>" +
      getSelectedLanguageObject().popupLoad
  );
}

// 6. Wenn ein Stil gespeichert wurde
function popupSaved() {
  showPopup(
    getSelectedLanguageObject().popupStyle +
      '<span style="color: ' +
      globalThis.IconsC +
      '; font-weight: bold;">' +
      globalThis.activeStyleName +
      "</span>" +
      getSelectedLanguageObject().popupSave
  );
}

// 7. Wenn die Einstellungen bestätigt wurden
function popupSettingsSaved() {
  showPopup(getSelectedLanguageObject().popupSettingsConfirm);
}

// 8. Wenn Änderungen an den Einstellungen verworfen wurden
function popupSettingsCanceled() {
  showPopup(getSelectedLanguageObject().popupSettingsAbort);
}

// 9. Wenn beim Laden der Seite gespeicherte Daten aus dem LocalStorage geladen werden konnten
function popupLocalStorageLoaded() {
  showPopup(getSelectedLanguageObject().popupLoadSavedData);
}

// 10. Wenn eine Farbpalette ausgewählt wurde
function popupPaletteSelection(name) {
  showPopup(
    getSelectedLanguageObject().popupPalette +
      '<span style="color: ' +
      globalThis.IconsC +
      '; font-weight: bold;">' +
      name +
      "</span>" +
      getSelectedLanguageObject().popupSelected
  );
}

// 11. Wenn eine Custom-Farbpalette überschrieben wurde
function popupOverwriteCustomPalette(name) {
  showPopup(
    getSelectedLanguageObject().popupPalette +
      '<span style="color: ' +
      globalThis.IconsC +
      '; font-weight: bold;">' +
      name +
      "</span>" +
      getSelectedLanguageObject().popupOverwritten
  );
}

// 12. Wenn ein Widget entfernt wurde
function popupDeleteWidget(title) {
  showPopup(
    '<span style="color: ' +
      globalThis.IconsC +
      '; font-weight: bold;">' +
      title +
      "</span>" +
      getSelectedLanguageObject().popupDelete2
  );
}

// 13. Wenn ein Widget fixiert wurde
function popupWidgetFixed(title) {
  showPopup(
    '<span style="color: ' +
      globalThis.IconsC +
      '; font-weight: bold;">' +
      title +
      "</span>" +
      getSelectedLanguageObject().popupLock
  );
}

// 14. Wenn die Fixierung eines Widgets gelöst wurde
function popupWidgetUnfixed(title) {
  showPopup(
    '<span style="color: ' +
      globalThis.IconsC +
      '; font-weight: bold;">' +
      title +
      "</span>" +
      getSelectedLanguageObject().popupUnlock
  );
}

// 15. Wenn kein Stil mehr existiert und somit kein Stil mehr geladen werden kann
function popupNoStyleAvailable() {
  showPopup(getSelectedLanguageObject().popupNoStyleAvailable);
}

// 16. Wenn kein Stil mehr existiert und somit kein Stil mehr gelöscht werden kann
function popupNoStyleToDelete() {
  showPopup(getSelectedLanguageObject().popupNoStyleToDelete);
}
