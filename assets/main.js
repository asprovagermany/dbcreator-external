// main.js

// Nach dem Laden des DOM-Baum ablaufender Code
// vergleichbar mit einer main-Methode

document.addEventListener("DOMContentLoaded", function () {
  globalThis.options = {
    resizable: {
      handles: "se, sw, ne, nw", // Ermöglicht die Größenänderung eines Widgets durch Ziehen an allen vier Ecken
    },
  };
  globalThis.grid = GridStack.init(globalThis.options);

  globalThis.widgetCount = 0; // Zählt die Anzahl an Widgets im Gridstack
  globalThis.globalWidgetCounter = 0; // Zählt die globale Anzahl von Widgets, um Doppeldeutigkeiten zu vermeiden
  globalThis.globalStyleCounter = 0; // Zählt die globale Anzahl von Stilen, um Doppeldeutigkeiten zu vermeiden

  globalThis.dataAvailable = checkLocalStorage(); // Prüfe, ob es schon gespeicherte Daten gibt

  globalThis.activeStyle = 0; // Aktuell aktiver Stil
  globalThis.activeStyleName = ""; // Name des aktiven Stils
  globalThis.activeColorButton = 0;

  globalThis.styleScrollPos = 0; // Position des Scrollen im Stil Container. Gibt an welcher Stil ganz links ist

  if (globalThis.dataAvailable) {
    // Falls es bereits Daten im LocalStorage gibt tue dies:
    getStorageColorProperties(); //Lädt die gespeicherten Werte der Farben in Variablen
    loadSavedStyleButtons();
    setActiveStyle(getFirstStyleNumber()); // Laden des ersten gespeicherten Stils
  } else {
    // Falls es noch keine Daten im LocalStorage gibt tue dies:
    initialGLobalDashboardData(); // Initialisierung des localStorage Item "GlobalDashboardData" mit default Werten

    getStorageColorProperties(); //Lädt die gespeicherten Werte der Farben in Variablen

    setActiveStyle("Initial"); // Erstellen des initialen Stils
  }
  getStorageCustomPalettes(); // Laden der gespeicherten oder initialisierten Paletten in globale Variablen

  globalThis.editingWidgetId = null; // Variable zum Speichern der ID des zu bearbeitenden Widgets
});
