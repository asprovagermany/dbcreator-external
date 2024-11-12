/*adjustWidgetModal.js
Beinhaltet vor allem Funktionen, welche die Interaktion des Benutzers mit den Modals zum Erstellen und Bearbeiten von Widgets festlegt
*/
// TODO: Ggf. Teile von createWidgetFromLoad und create Widget auslagern in weitere Funktion. Aktuell hard coded sample data als anzeige der Widgets

// Funktion zum Erstellen eines Widgets mit bestimmten Eigenschaften (Titel, Breite, Höhe, x-Position, y-Position, ID)
function createWidgetFromLoad(
  title,
  width,
  height,
  x,
  y,
  lock,
  id,
  widgetChartType,
  widgetChartData,
  widgetNumOfEval,
  widgetUpToDate,
  widgetFilter
) {
  widgetCount++;
  const newWidget = document.createElement("div");
  newWidget.className = "grid-stack-item";
  newWidget.setAttribute("chartType", widgetChartType);
  newWidget.setAttribute("data", widgetChartData);
  newWidget.setAttribute("NumOfEvals", widgetNumOfEval);
  newWidget.setAttribute("upToDate", widgetUpToDate);
  newWidget.setAttribute("filter", widgetFilter);
  newWidget.id = id;
  newWidget.innerHTML = `
<div class="grid-stack-item-content">
<div><h3>${title}</h3></div>
<div class="fullHeight" id="chart-${id}"></div>
<div class="widget-controls">
  <button class="lock-widget" onclick="lockWidget('${id}', 'popup')"><i class="fa-solid fa-lock-open"></i></button>
  <button class="unlock-widget" onclick="unlockWidget('${id}')"> <i class="fa-solid fa-lock"></i></button>
  <button class="edit-widget" onclick="editWidget('${id}')"><i class="fa-solid fa-pencil"></i></button>
  <button class="delete-widget" onclick="deleteWidget('${id}')"> <i class="fa-solid fa-xmark"></i> </button>
</div>
</div>
`;
  let chartData = JSON.parse(widgetChartData);
  const gridStack = document.querySelector(".grid-stack");
  gridStack.appendChild(newWidget);

  // Füge das Widget zum Rasterlayout hinzu mit den angegebenen Eigenschaften
  globalThis.grid.addWidget(newWidget, { w: width, h: height, x: x, y: y });
  if (widgetUpToDate != "false") {
    chartData = refreshData(chartData, id, widgetFilter);
  }

  if (lock == "true") {
    lockWidget(id, "noPopup");
  }

  // Erstellung eines neuen ApexCharts-Diagramms
  if (widgetChartType === "abs") {
    new ChartWidget(id, widgetChartType, chartData);
  } else {
    const chart = new ChartWidget(id, widgetChartType, chartData);
    chart.createChart();
  }
  addWidgetTooltips(id);
  updateElementsWithLanguage(getSelectedLanguageObject());
}

// Funktion zum Erstellen eines Widgets
function createWidget(
  title = "Widget",
  width,
  height,
  widgetChartType,
  widgetChartData,
  widgetNumOfEval,
  widgetUpToDate,
  widgetFilter
) {
  globalThis.globalWidgetCounter++;
  globalThis.widgetCount++;
  const widgetId = globalThis.globalWidgetCounter;
  const newWidget = document.createElement("div");
  newWidget.className = "grid-stack-item";
  newWidget.setAttribute("chartType", widgetChartType);
  newWidget.setAttribute("data", JSON.stringify(widgetChartData));
  newWidget.setAttribute("NumOfEvals", widgetNumOfEval);
  newWidget.setAttribute("upToDate", widgetUpToDate);
  newWidget.setAttribute("filter", widgetFilter);
  newWidget.id = widgetId;
  newWidget.innerHTML = `
<div class="grid-stack-item-content">
<div><h3>${title}</h3></div>
<div class="fullHeight" id="chart-${widgetId}"></div>
<div class="widget-controls">
  <button class="lock-widget" onclick="lockWidget('${widgetId}', 'popup')"><i class="fa-solid fa-lock-open"></i></button>
  <button class="unlock-widget" onclick="unlockWidget('${widgetId}')"> <i class="fa-solid fa-lock"></i></button>
  <button class="edit-widget" onclick="editWidget('${widgetId}')"><i class="fa-solid fa-pencil"></i></button>
  <button class="delete-widget" onclick="deleteWidget('${widgetId}')"> <i class="fa-solid fa-xmark"></i> </button>
</div>
</div>
`;

  const gridStack = document.querySelector(".grid-stack");
  gridStack.appendChild(newWidget);

  // Füge das Widget zum Rasterlayout hinzu mit der Größe aus den Parametern. Die Position wird automatisch ermittelt
  globalThis.grid.addWidget(newWidget, { w: width, h: height });

  //Konstruiere Chart, wenn nicht Absolute Zahl
  if (widgetChartType === "abs") {
    new ChartWidget(
      widgetId,
      widgetChartType,
      widgetChartData,
      widgetNumOfEval
    );
  } else {
    const chart = new ChartWidget(
      widgetId,
      widgetChartType,
      widgetChartData,
      widgetNumOfEval
    );
    chart.createChart();
  }
  addWidgetTooltips(widgetId);
  updateElementsWithLanguage(getSelectedLanguageObject());
}

// Funktion um das Modal zu öffnen, um dort Parameter für ein neues Widget festzulegen (vor dem tatsächlichen Hinzufügen eines neuen Widgets)
function addWidgetButton() {
  document.getElementById("modalWidgetWidth").value = 6; //Default Breite von neuen Widgets
  document.getElementById("modalWidgetHeight").value = 6; //Default Höhe von neuen Widgets
  // Holen des aktuellen Wertes von widgetCount und Setzen des Titels in die Textbox
  const currentCount = globalThis.widgetCount + 1;
  document.getElementById("modalWidgetTitle").value = "Widget-" + currentCount;
  openWidgetModal();
}

// Funktion zum Aktualisieren eines Widgets nachdem die neuen Daten bestätigt worden sind
function updateWidget(
  widgetId,
  title,
  widgetChartType,
  widgetChartData,
  widgetNumOfEval,
  width,
  height
) {
  const widget = document.getElementById(widgetId);
  const oldChart = document.getElementById(`chart-${widgetId}`);
  const widgetTitleElement = widget.querySelector("h3");

  //widget.setAttribute("table",widgetTable);
  widget.setAttribute("chartType", widgetChartType);
  //widget.setAttribute("property",widgetKPI);
  widget.setAttribute("data", JSON.stringify(widgetChartData));
  widget.setAttribute("NumOfEvals", widgetNumOfEval);

  oldChart.innerHTML = "";
  // Aktualisiere den Titel des Widgets
  widgetTitleElement.textContent = title;

  //Konstruiere Chart, wenn nicht Absolute Zahl
  if (widgetChartType === "abs") {
    new ChartWidget(
      widgetId,
      widgetChartType,
      widgetChartData,
      widgetNumOfEval
    );
  } else {
    const chart = new ChartWidget(
      widgetId,
      widgetChartType,
      widgetChartData,
      widgetNumOfEval
    );

    chart.createChart();
  }

  // Aktualisiere die Größe des Widgets im Gridstack
  globalThis.grid.update(widget, { w: width, h: height });
}

// Funktion zum überprüfen der Breite und Höhe beim Erstellen oder Editieren eines Widgets. Sperrt bei ungültiger Validierung den Bestätigungsbutton
function validateWidgetInput() {
  const widthInput = document.getElementById("modalWidgetWidth").value;
  const heightInput = document.getElementById("modalWidgetHeight").value;
  const widthError = document.getElementById("widthError");
  const heightError = document.getElementById("heightError");
  const confirmButton = document.getElementById("modalConfirmButton");

  /* Überprüfen, ob die Eingabe für Breite und Höhe eine Zahl zwischen 1 und 12 ist
     ^\d+$ ist ein regulärer Ausdruck
     ^ --> Anfang der Zeichenkette
     d+ --> eine oder mehrere Ziffern
     $ --> Ende der Zeichenkette
    */
  const isValidWidth =
    /^\d+$/.test(widthInput) && widthInput >= 1 && widthInput <= 12;
  const isValidHeight =
    /^\d+$/.test(heightInput) && heightInput >= 1 && heightInput <= 12;

  // Aktualisieren der Fehlermeldungen und Bestätigungsbutton-Zustand
  if (!isValidWidth) {
    widthError.textContent = getSelectedLanguageObject().widthError;
    confirmButton.disabled = true;
  } else {
    widthError.textContent = "";
  }
  if (!isValidHeight) {
    heightError.textContent = getSelectedLanguageObject().heightError;
    confirmButton.disabled = true;
  } else {
    heightError.textContent = "";
  }
  if (isValidWidth && isValidHeight) {
    confirmButton.disabled = false;
  }
}

// Funktion zum Ändern des Titels im oberen Bereich des Modal
function changeModalTitle(newTitle) {
  // Zugriff auf das <h2>-Element im Modal und Ändern des Textinhalts
  document.getElementById("adjustWidgetModal").querySelector("h2").textContent =
    newTitle;
}

function closeWidgetSettingsModal() {
  globalThis.editingWidgetId = null;
  document.getElementById("settingsWidgetModal").style.display = "none";
  document.getElementById("modalSettingsWidgetOverlay").style.display = "none";
}

function confirmWidgetSettingsModal(widgetId) {
  const widget = document.getElementById(widgetId);
  const widgetID = widgetId;
  const widgetChartType = widget.getAttribute("charttype");
  const widgetNumOfEval = widget.getAttribute("numofevals");
  const width = widget.getAttribute("gs-w");
  const height = widget.getAttribute("gs-h");
  const title = document
    .getElementById("settingsWidgetModal")
    .querySelector("#modalWidgetTitle").value;
  let newData;

  widget.querySelector("h3").textContent = title;
  const slider = document.getElementById("normalizeSlider");
  if (slider.checked) {
    let style = JSON.parse(localStorage.getItem("savedData" + activeStyle));
    let currentWidget = style.widgets.find(
      (item) => item.id === editingWidgetId
    );
    let tData = JSON.parse(currentWidget.chartData);
    let someCheck = tData.map((e) => e.data.some((el) => el > 1));
    if (someCheck.some((el) => el == true)) {
      console.log("NormCheck aber nicht normalisiert");
      newData = JSON.parse(currentWidget.chartData).map((item) => {
        return {
          name: item.name,
          aspCode: item.aspCode,
          data: item.normData,
          normData: item.normData,
          code: item.code,
          normalize: true,
          tempData: item.data,
          res: item.res,
        };
      });
      widget.setAttribute("data", JSON.stringify(newData));
    } else {
      console.log("NormCheck aber schon normalisiert");
      newData = JSON.parse(currentWidget.chartData).map((item) => {
        return {
          name: item.name,
          aspCode: item.aspCode,
          data: item.data,
          normData: item.normData,
          code: item.code,
          normalize: true,
          tempData: item.tempData,
          res: item.res,
        };
      });
      widget.setAttribute("data", JSON.stringify(newData));
    }
  } else {
    let style = JSON.parse(localStorage.getItem("savedData" + activeStyle));
    let currentWidget = style.widgets.find(
      (item) => item.id === editingWidgetId
    );
    let tData = JSON.parse(currentWidget.chartData);
    let someCheck = tData.map((e) => e.data.some((el) => el > 1));
    if (someCheck.some((el) => el == true)) {
      console.log("Kein NormCheck und nicht normalisiert");
      newData = JSON.parse(currentWidget.chartData).map((item) => {
        return {
          name: item.name,
          aspCode: item.aspCode,
          data: item.data,
          normData: item.normData,
          code: item.code,
          normalize: false,
          tempData: item.tempData,
          res: item.res,
        };
      });
      widget.setAttribute("data", JSON.stringify(newData));
    } else {
      newData = JSON.parse(currentWidget.chartData).map((item) => {
        console.log("Kein NormCheck aber normalisiert");
        return {
          name: item.name,
          aspCode: item.aspCode,
          data: item.tempData,
          normData: item.normData,
          code: item.code,
          normalize: false,
          tempData: item.tempData,
          res: item.res,
        };
      });
      widget.setAttribute("data", JSON.stringify(newData));
    }
  }
  saveStyle();
  updateWidget(
    widgetID,
    title,
    widgetChartType,
    newData,
    widgetNumOfEval,
    width,
    height
  );
  closeWidgetSettingsModal();
}

// Funktion zum Öffnen/Anzeigen des Widget-Modals
function openWidgetModal() {
  var modalOverlay = document.getElementById("modalWidgetOverlay");
  var modal = document.getElementById("adjustWidgetModal");
  modalOverlay.style.display = "block";
  modal.style.display = "block";
}
// Funktion zum Schließen/Ausblenden des Widget-Modals
function closeWidgetModal() {
  var modalOverlay = document.getElementById("modalWidgetOverlay");
  var modal = document.getElementById("adjustWidgetModal");
  modalOverlay.style.display = "none";
  modal.style.display = "none";
}

// Funktion, welche nach dem Drücken des "Bestätigen"-Buttons des Modals aufgerufen wird
// --> Führt zum Erstellen oder Bearbeiten eines Widgets basierend auf den Werten im Modal
function confirmWidgetModal() {
  const widgetTitle = document.getElementById("modalWidgetTitle").value;
  const widgetChartType = document.getElementById("chartType").value;
  const temp = data;
  const widgetNumOfEval = document.getElementById(
    "modalStaticWidgetNumOfEvals"
  ).value;
  const widgetUpToDate = document.getElementById(
    "modalStaticWidgetupToDate"
  ).checked;
  const widgetFilter = document.getElementById("modalWidgetFilter").value;

  const widgetChartData = getData(
    temp,
    widgetNumOfEval,
    false,
    widgetUpToDate,
    widgetFilter
  );
  // Sicherstellung, dass die eingegebenen Werte im Dezimalsystem sind
  const widgetWidth = parseInt(
    document.getElementById("modalWidgetWidth").value,
    10
  );
  const widgetHeight = parseInt(
    document.getElementById("modalWidgetHeight").value,
    10
  );

  if (globalThis.editingWidgetId === null) {
    createWidget(
      widgetTitle,
      widgetWidth,
      widgetHeight,
      widgetChartType,
      widgetChartData,
      widgetNumOfEval,
      widgetUpToDate,
      widgetFilter
    );
  }
  // Schließe das Modal
  closeWidgetModal();
}
