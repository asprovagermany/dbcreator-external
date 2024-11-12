// eventListener.js

// Funktion zum Überwachen der Eingabefelder und Aktualisierung des Bestätigungsbuttons in den Modals
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("modalWidgetWidth")
    .addEventListener("input", validateWidgetInput);
  document
    .getElementById("modalWidgetHeight")
    .addEventListener("input", validateWidgetInput);
  document
    .getElementById("modalStyleTitle")
    .addEventListener("input", validateStyleInput);

  // JavaScript, um Modals zu schließen, wenn außerhalb des Modals geklickt wird
  window.onclick = function (event) {
    var modalStyle = document.getElementById("adjustStyleModal");
    var modalStyleOverlay = document.getElementById("modalStyleOverlay");
    var modalSettings = document.getElementById("adjustSettingsModal");
    var modalSettingsOverlay = document.getElementById("modalSettingsOverlay");
    var modalWidget = document.getElementById("adjustWidgetModal");
    var modalWidgetOverlay = document.getElementById("modalWidgetOverlay");
    var modalSettingsWidget = document.getElementById("settingsWidgetModal");
    var modalSettingsWidgetOverlay = document.getElementById(
      "modalSettingsWidgetOverlay"
    );

    if (event.target == modalStyle || event.target == modalStyleOverlay) {
      closeStyleModal("forcedExit");
    } else if (
      event.target == modalSettings ||
      event.target == modalSettingsOverlay
    ) {
      cancelSettingsModal();
    } else if (
      event.target == modalWidget ||
      event.target == modalWidgetOverlay
    ) {
      closeWidgetModal();
    } else if (
      event.target == modalSettingsWidget ||
      event.target == modalSettingsWidgetOverlay
    ) {
      closeWidgetSettingsModal();
    }
  };
});

window.addEventListener("load", function () {
  updateElementsWithLanguage(getSelectedLanguageObject());
});

window.addEventListener("DOMContentLoaded", function () {
  // Beim Laden der Seite wird gecheckt, ob scrollbuttons aktiviert werden sollen
  checkScroll();
  // Überprüfen beim Laden der Seite und beim Ändern der Fenstergröße
  window.addEventListener("resize", checkScroll);
});

// Überprüfen, ob das horizontale Scrollen möglich sein sollte
function checkScroll() {
  // checkAddButton();
  var container = document.querySelector(".stylebar-container");
  var scrollLeftButton = document.getElementById("scroll-button-left");
  var scrollRightButton = document.getElementById("scroll-button-right");
  // Überprüfung ob die eigentliche Größe des Containers größer ist als die tatsächlich angezeigte Größe
  if (container.scrollWidth > container.clientWidth) {
    // Wenn ja, dann zeige die Scrollbuttons
    scrollLeftButton.style.display = "block";
    scrollRightButton.style.display = "block";
  } else {
    // Wenn nein, verstecke die Scrollbuttons
    scrollLeftButton.style.display = "none";
    scrollRightButton.style.display = "none";
  }
}

/* // Funktion, welche den addStyle button nach rechts verschiebt, damit der tooltip komplett angezeigt wird
function checkAddButton() {
  var stylebarWrapperWidth = document.querySelector(
    ".stylebar-container-wrapper"
  ).offsetWidth;
  var addButton = document.querySelector(".add-style-button");

  // Wenn die Breite des Containers kleiner als 150px ist
  if (stylebarWrapperWidth < 150) {
    addButton.style.marginLeft = (150-stylebarWrapperWidth) + 'px';
  } else {
    // Ansonsten setze den Margin des Buttons auf 5px
    addButton.style.marginLeft = "5px";
  }
}*/
