// indexGS.js

// Funktionen bei Interaktion (noch nicht einer einzelnen Datei zugeordnet):

// Funktion zum Entfernen aller Widgets aus dem Gridstack
function clearWindow() {
  // Zähler zurücksetzen
  globalThis.widgetCount = 0;

  const gridStack = document.querySelector(".grid-stack");

  // Schleife über alle Widgets
  while (gridStack.firstChild) {
    const widget = gridStack.firstChild;

    // Entferne das Widget aus dem GridStack
    gridStack.removeChild(widget);

    // Entferne das Widget von der Gridstack-Instanz
    globalThis.grid.removeWidget(widget);
  }
}

// Funktion, welche die vertikale Buttonleiste ein- oder ausblendet
// Funktion, welche die vertikale Buttonleiste ein- oder ausblendet
function changeAdjustVisibility() {
  var container = document.getElementById("button-container-vertical");
  var buttons = document.getElementsByClassName("style-adjust-button");

  if (container.classList.contains("show")) {
    // Buttonleiste ausblenden
    container.style.opacity = 0;
    container.style.pointerEvents = "none"; // Deaktiviere Klick-Ereignisse während des Ausblendens
    container.style.zIndex = -1;
    setTimeout(() => {
      container.classList.toggle("show");
      container.style.pointerEvents = ""; // Aktiviere Klick-Ereignisse nach dem Ausblenden
    }, 200); // Wartezeit vor dem Ausblenden der Buttonleiste
    // Buttons ausblenden
    Array.from(buttons).forEach((button) => {
      button.style.opacity = 0;
      button.style.pointerEvents = "none"; // Deaktiviere Klick-Ereignisse während des Ausblendens
    });
  } else {
    // Buttonleiste einblenden
    container.classList.toggle("show");
    setTimeout(() => {
      container.style.opacity = 1;
      container.style.zIndex = 800;
    }, 50); // Wartezeit vor dem Einblenden des Containers
    // Buttons einblenden
    setTimeout(() => {
      Array.from(buttons).forEach((button) => {
        button.style.opacity = 1;
        button.style.pointerEvents = ""; // Aktiviere Klick-Ereignisse nach dem Einblenden
      });
    }, 200); // Wartezeit vor dem Einblenden der Buttons
  }
}

// Nav-bar Funktionen:
//Funktion, welche die nav-bar ein- oder ausblendet
function changeNavbarVisibility() {
  const navBar = document.getElementById("nav-bar");
  const navBarDisplayStyle = window
    .getComputedStyle(navBar)
    .getPropertyValue("display");
  const content = document.getElementById("content");
  const stylebar = document.getElementById("stylebar-container");

  if (navBarDisplayStyle === "flex") {
    // Wenn die Navigationsleiste sichtbar ist, dann ausklappen (verstecken)
    navBar.style.animation = "slideOut 0.5s ease forwards";

    setTimeout(() => {
      navBar.style.display = "none";
      content.style.paddingLeft = "0px";
      stylebar.style.maxWidth = "calc(100vw - 225px)";
      checkScroll();
    }, 500); // Hier 500 ist die Dauer der Animation in Millisekunden
  } else {
    // Wenn die Navigationsleiste ausgeblendet ist, dann einblenden (anzeigen)
    content.style.paddingLeft = "74px";
    navBar.style.display = "flex";
    navBar.style.animation = "slideIn 0.5s ease forwards";
    stylebar.style.maxWidth = "calc(100vw - 300px)"; // Vergrößerung der Stylebar
    checkScroll();
  }
}

function openHome() {
  /* openPage("indexGridstack.html");*/
}

function openSample() {
  /*openPage("sampleSite.html");*/
}

function openPage(pageUrl) {
  window.open(pageUrl);
}

function reloadPage() {
  location.reload();
}
