/* widgetButtons.js
Umfasst die Funktionen, welche bei Betätigung der Schaltflächen auf einem einzelnen Widget ausgeführt werden
*/

// Funktion, um ein Widget zu entsperren
function unlockWidget(widgetId) {
  var widget = document.getElementById(widgetId);
  var lockButton = widget.querySelector(".lock-widget");
  var unlockButton = widget.querySelector(".unlock-widget");

  lockButton.style.display = "block";
  unlockButton.style.display = "none";
  widget.setAttribute("lock", "false");

  grid.update(widget, {
    locked: false,
    noResize: false,
    noMove: false,
  });

  popupWidgetUnfixed(widget.querySelector("h3").textContent);
}

// Funktion, um ein Widget in der Position und Größe zu fixieren
function lockWidget(widgetId, popup) {
  var widget = document.getElementById(widgetId);
  var lockButton = widget.querySelector(".lock-widget");
  var unlockButton = widget.querySelector(".unlock-widget");

  lockButton.style.display = "none";
  unlockButton.style.display = "block";
  widget.setAttribute("lock", "true");

  grid.update(widget, {
    locked: true,
    noResize: true,
    noMove: true,
  });

  if (popup === "popup") {
    popupWidgetFixed(widget.querySelector("h3").textContent);
  }
}

// Funktion welche nach Betätigung des Editieren-Buttons (Stift) ausgelöst wird
// Bereitet Daten und das Modal zum Editieren vor
function editWidget(widgetId) {
  document.getElementById("settingsWidgetModal").style.display = "block";
  document.getElementById("modalSettingsWidgetOverlay").style.display = "block";

  const widget = document.getElementById(widgetId);
  const widgetTitle = widget.querySelector("h3").textContent;
  const slider = document.getElementById("normalizeSlider");
  let style = JSON.parse(localStorage.getItem("savedData" + activeStyle));
  let currentWidget = style.widgets.find((item) => item.id === widgetId);
  let widgetData = JSON.parse(currentWidget.chartData);
  if (widgetData[0].normalize) {
    slider.checked = true;
  } else {
    slider.checked = false;
  }
  document
    .getElementById("settingsWidgetModal")
    .querySelector("#modalWidgetTitle").value = widgetTitle;
  // Setze den Wert der Variable editingWidgetId auf die ID des zu bearbeitenden Widgets
  globalThis.editingWidgetId = widgetId;
}

// Funktion, welche das Widget aus dem Grid entfernt
function deleteWidget(widgetId) {
  globalThis.widgetCount--;
  const widget = document.getElementById(widgetId);
  const gridStack = document.querySelector(".grid-stack");

  // Entferne das Widget aus dem GridStack
  gridStack.removeChild(widget);

  // Entferne das Widget von der Gridstack-Instanz
  globalThis.grid.removeWidget(widget);

  popupDeleteWidget(widget.querySelector("h3").textContent);
}

// Funktion, die beim Erstellen oder Laden von Widgets die Tooltips für die oberen Buttons hinzufügt
function addWidgetTooltips(widgetId) {
  var widget = document.getElementById(widgetId);

  // Nehme die Buttons aus dem Widget
  var lockButton = widget.querySelector(".lock-widget");
  var unlockButton = widget.querySelector(".unlock-widget");
  var editButton = widget.querySelector(".edit-widget");
  var deleteButton = widget.querySelector(".delete-widget");

  // Setze Tooltips für die Schaltflächen
  lockButton.setAttribute("data-tooltip-left", "Fixieren");
  lockButton.classList.add("lockButtonHover");
  unlockButton.setAttribute("data-tooltip-left", "Fixierung aufheben");
  unlockButton.classList.add("unlockButtonHover");
  editButton.setAttribute("data-tooltip-left", "Widget Editieren");
  editButton.classList.add("editButtonHover");
  deleteButton.setAttribute("data-tooltip-left", "Löschen");
  deleteButton.classList.add("deleteButtonHover");
}
