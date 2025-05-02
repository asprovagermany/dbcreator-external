//Initales generieren der Select Felder
let graphSelect = document.getElementById("chartType");
let tableSelect = document.getElementById("table");
let lang = getAsprovaLanguage();


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
