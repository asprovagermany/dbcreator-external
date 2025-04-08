//Initales generieren der Select Felder
let graphSelect = document.getElementById("chartType");
let tableSelect = document.getElementById("table");
let lang = getAsprovaLanguage();
//Current possible Graph Types
let iValuesGraphTypeLang = [
  {
    jpn: [
      { id: "abs", text: "絶対数" },
      { id: "radialBar", text: "ラジアルバー" },
      { id: "gauge", text: "セミサークル" },
      { id: "pie", text: "円グラフ" },
      { id: "donut", text: "ドーナツ図" },
      { id: "line", text: "線図" },
      { id: "bar", text: "棒グラフ - 垂直" },
      { id: "horizontalbar", text: "棒グラフ - 水平" },
      { id: "radar", text: "蜘蛛の巣の図" },
    ],
  },
  {
    de_DE_0: [
      { id: "abs", text: "Absolute Zahl" },
      { id: "radialBar", text: "Radial Bar" },
      { id: "gauge", text: "Halbkreis" },
      { id: "pie", text: "Torten-Diagramm" },
      { id: "donut", text: "Donut Diagramm" },
      { id: "line", text: "Linien Diagramm" },
      { id: "bar", text: "Balken Diagramm - vertikal" },
      { id: "horizontalbar", text: "Balken Diagramm - horizontal" },
      { id: "radar", text: "Spinnennetz-Diagramm" },
    ],
  },
  {
    en_US_0: [
      { id: "abs", text: "Absolute number" },
      { id: "radialBar", text: "Radial bar" },
      { id: "gauge", text: "Semicircle" },
      { id: "pie", text: "Pie chart" },
      { id: "donut", text: "Donut chart" },
      { id: "line", text: "Line chart" },
      { id: "bar", text: "Bar chart - vertical" },
      { id: "horizontalbar", text: "Bar chart - horizontal" },
      { id: "radar", text: "Radar chart" },
    ],
  },
  {
    pl_PL_0: [
      { id: "abs", text: "Liczba bezwzględna" },
      { id: "radialBar", text: "Drążek promieniowy" },
      { id: "gauge", text: "Półkole" },
      { id: "pie", text: "Wykres kołowy" },
      { id: "donut", text: "Schemat pączka" },
      { id: "line", text: "Wykres liniowy" },
      { id: "bar", text: "Wykres słupkowy - pionowy" },
      { id: "horizontalbar", text: "Wykres słupkowy - poziomy" },
      { id: "radar", text: "Schemat pajęczyny" },
    ],
  },
  {
    fr_FR_0: [
      { id: "abs", text: "Nombre absolu" },
      { id: "radialBar", text: "Barres radiales" },
      { id: "gauge", text: "Demi-cercle" },
      { id: "pie", text: "Graphique à secteurs" },
      { id: "donut", text: "Graphique Donut" },
      { id: "line", text: "Graphique linéaire" },
      { id: "bar", text: "Graphique à barres - verticales" },
      { id: "horizontalbar", text: "Graphique à barres - horizontales" },
      { id: "radar", text: "Graphique radar" },
    ],
  }

];

let iValuesTablesLang = [
  {
    jpn: [
      { id: "KPIEvalResult", text: "金銭的KPI" },
      { id: "SchedEvalResult", text: "プラン評価" },
    ],
  },
  {
    de_DE_0: [
      { id: "KPIEvalResult", text: "Monetäre KPIs" },
      { id: "SchedEvalResult", text: "Planbewertung" },
    ],
  },
  {
    en_US_0: [
      { id: "KPIEvalResult", text: "Monetary KPIs" },
      { id: "SchedEvalResult", text: "Schedule Evaluation" },
    ],
  },
  {
    pl_PL_0: [
      { id: "KPIEvalResult", text: "Pieniężne KPI" },
      { id: "SchedEvalResult", text: "Ocena planu" },
    ],
  },
  {
    fr_FR_0: [
      { id: "KPIEvalResult", text: "Résultats financiers" },
      { id: "SchedEvalResult", text: "Évaluation de l'ordonnancement" },
    ],
  }
];

let iValuesGraphType = Object.values(
  iValuesGraphTypeLang.find((elem) => lang in elem)
);
let iValuesTables = Object.values(
  iValuesTablesLang.find((elem) => lang in elem)
);

//Create and append the options to the select
for (var i = 0; i < iValuesGraphType[0].length; i++) {
  var option = document.createElement("option");
  option.value = iValuesGraphType[0][i].id;
  option.text = iValuesGraphType[0][i].text;
  graphSelect.appendChild(option);
}
for (var i = 0; i < iValuesTables[0].length; i++) {
  var option = document.createElement("option");
  option.value = iValuesTables[0][i].id;
  option.text = iValuesTables[0][i].text;
  tableSelect.appendChild(option);
}

function addKPIselect() {
  const AllKpiSelection = document.querySelectorAll(".selectData");
  let n = AllKpiSelection.length - 1;
  let kpiSelection = AllKpiSelection[n];
  // Remove existing "+" button if it exists
  const existingPlusButton = kpiSelection.querySelector(".fa-plus");
  if (existingPlusButton) {
    existingPlusButton.parentElement.removeChild(existingPlusButton);
  }

  const currentWrapperDiv = document.getElementById("wrapperSelection");
  const newWrapperDiv = document.createElement("div");
  const newSelectTableContainer = document.createElement("div");
  const newSelectKPIContainer = document.createElement("div");

  newSelectTableContainer.innerHTML = `
        <label for="modalStaticWidgetSelectTable" class="table">Tabelle: </label>
        <select onchange=getProperties(table.value) name="table" id="table" class="new-select tableSelect">
          <option class="optionPlaceholder" value="" disabled selected>Select your option</option>
        </select>        
        `;

  newSelectKPIContainer.innerHTML = `
        <select name="property" id="property" class="new-select property">
            <option class="optionPlaceholder" value="" disabled selected>Select your option</option>
        </select>
        `;

  newSelectTableContainer.onchange = function () {
    getProperties(
      document.querySelectorAll(".tableSelect")[
        document.querySelectorAll(".tableSelect").length - 1
      ].value
    );
  };

  // Create "+/-" buttons
  const addButton = document.createElement("i");
  addButton.className = "fa-solid fa-plus hidden";
  addButton.id = "addnew";
  addButton.onclick = function () {
    addKPIselect();
    generateTableSelect();
  };

  const minusButton = document.createElement("i");
  minusButton.className = "fa-solid fa-minus";
  minusButton.onclick = function () {
    deleteKPIselect(this);
  };

  newSelectKPIContainer.appendChild(minusButton);
  newSelectKPIContainer.appendChild(addButton);
  newSelectKPIContainer.onchange = function () {
    removeHidden(addnew);
  };
  newSelectKPIContainer.className = "property";

  newWrapperDiv.appendChild(newSelectTableContainer);
  newWrapperDiv.appendChild(newSelectKPIContainer);
  newWrapperDiv.className = "selectData newSelect";

  currentWrapperDiv.appendChild(newWrapperDiv);

  updateElementsWithLanguage(getSelectedLanguageObject(), "newSelect");
  newWrapperDiv.classList.remove("newSelect");
}

function generateTableSelect() {
  let allTableSelect = document.querySelectorAll(".tableSelect");
  let n = allTableSelect.length - 1;
  let tableSelect = allTableSelect[n];
  for (let i = 0; i < iValuesTables[0].length; i++) {
    let option = document.createElement("option");
    option.value = iValuesTables[0][i].id;
    option.text = iValuesTables[0][i].text;
    tableSelect.appendChild(option);
  }
}

function deleteKPIselect(element) {
  element.closest(".selectData").remove();

  let AllKpiSelection = document.querySelectorAll(".selectData");
  let n = AllKpiSelection.length - 1;
  const kpiSelection = AllKpiSelection[n];

  const wrapper = document.querySelector("#wrapperSelection");
  var existingPlusButton = [];
  try {
    var existingPlusButton = wrapper.querySelectorAll(".fa-plus");
  } catch (e) {
    console.log(e);
  }

  if (existingPlusButton.length === 0) {
    let addButton = document.createElement("i");
    addButton.className = "fa-solid fa-plus";
    addButton.onclick = function () {
      addKPIselect();
      generateTableSelect();
    };
    kpiSelection.querySelector(".property").appendChild(addButton);
  }
}
