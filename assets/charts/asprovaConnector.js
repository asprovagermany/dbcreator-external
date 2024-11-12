const asprova = window.chrome.webview.hostObjects.sync.asprova;
const project = asprova.ActiveProject;
let x = 1;
let y = 1;
const propIDnegativeKPI = project.RootObject.LookUpPropID(
  "ProjectUser_NegativeKPINormalize"
);
const negativeKPI = [];

while (x != 2147483647) {
  negativeKPI.push(project.GetAsInteger(propIDnegativeKPI, y));
  x = project.GetAsInteger(propIDnegativeKPI, y);
  y++;
}
negativeKPI.pop();

function getProperties(type) {
  var itemPropCount = project.FindChild("ClassDef").ChildCount;
  var i = 1;
  var propList = [];
  var propIDdisplay = project.RootObject.LookUpPropID("DisplayedProperties");
  var tableClass = project.FindChild("ClassDef").FindChild(type);

  while (i <= itemPropCount) {
    try {
      propList.push({
        Code: tableClass.GetAsObject(propIDdisplay, i).Code,
        DisplayString: tableClass.GetAsObject(propIDdisplay, i).DisplayString,
        PropID: tableClass.GetAsObject(propIDdisplay, i).PropertyID,
      });
    } catch (e) {}
    i++;
  }
  propList = filterArray(propList, type);
  propList = propList.sort((a, b) =>
    a.DisplayString > b.DisplayString
      ? 1
      : b.DisplayString > a.DisplayString
      ? -1
      : 0
  );
  const allElements = document.querySelectorAll(".property");
  const lastElementOfSameID = allElements[allElements.length - 1];

  lastElementOfSameID.innerHTML = "";
  for (var n = 0; n < propList.length; n++) {
    let option = document.createElement("option");
    option.value = propList[n].Code;
    option.text = propList[n].DisplayString;
    lastElementOfSameID.appendChild(option);
  }
}

function getRessources() {
  let resCount = project.RootResource.ChildCount;
  let i = 1;
  let resources = project.RootResource.ChildAsResource;
  let temp = [];
  let resList = [];
  let propIDResGroup = project.RootObject.LookUpPropID("Res_Group");

  while (i <= resCount) {
    let res = resources[i];
    try {
      temp[i] = {
        Code: res.Code,
        Name: res.Name,
        Group: res.GetAsStr(propIDResGroup, 1),
        i: i,
      };
    } catch (e) {}
    i++;
  }
  resList = temp.filter((e) => e.Group != "");
  console.log(resList);
  const selectResource = document.getElementById("resourceSelect");
  for (var n = 0; n < resList.length; n++) {
    let option = document.createElement("option");
    option.value = resList[n].Code + "_" + resList[n].i;
    option.text = resList[n].Name ? resList[n].Name : resList[n].Code;
    selectResource.appendChild(option);
  }
}

function getKPIname(code) {
  let propIDkpi = project.RootObject.LookUpPropID(code);
  return project.RootObject.LookupPropertyDefFromPropID(propIDkpi)
    .DisplayString;
}

function getAsprovaLanguage() {
  return project.RootObject.RootProject.FindChild("LocaleDef").Child[1].Code;
}

function getSelectedLanguageObject() {
  let language =
    project.RootObject.RootProject.FindChild("LocaleDef").Child[1].Code;
  let temp = languages.find((obj) => obj.hasOwnProperty(language));
  return Object.values(temp)[0];
}

function updateElementsWithLanguage(languageObject, classList) {
  if (!(typeof classList == "string")) {
    // Iterate over the keys in the language object
    Object.keys(languageObject).forEach((key) => {
      let temp = "." + key;
      // Find all elements with the class name matching the current key
      const elements = document.querySelectorAll(temp);
      try {
        switch (Object.keys(elements[0].dataset)[0]) {
          case "tooltipRight":
            // Update each element's innerHTML with the value from the language object
            elements.forEach((element) => {
              element.dataset.tooltipRight = languageObject[key];
            });
            break;
          case "tooltipLeft":
            // Update each element's innerHTML with the value from the language object
            elements.forEach((element) => {
              element.dataset.tooltipLeft = languageObject[key];
            });
            break;
          case "tooltipLeftTop":
            elements.forEach((element) => {
              element.dataset.tooltipLeftTop = languageObject[key];
            });
            break;
          case "tooltipRightTop":
            elements.forEach((element) => {
              element.dataset.tooltipRightTop = languageObject[key];
            });
            break;
          default:
            // Update each element's innerHTML with the value from the language object
            elements.forEach((element) => {
              element.innerHTML = languageObject[key];
            });
            break;
        }
      } catch (error) {}
    });
  } else {
    // Find all elements with the class name matching the current key
    Object.keys(languageObject).forEach((key) => {
      let temp = "." + classList;
      // Find all elements with the class name matching the current key
      const elements = document.querySelectorAll(temp);
      elements.forEach((e) => {
        let temp = "." + key;
        const elem = e.querySelectorAll(temp);
        try {
          elem.forEach((element) => {
            element.innerHTML = languageObject[key];
          });
        } catch (error) {}
      });
    });
  }
}
function addLangWidgetButtons() {
  try {
    const buttonContainer = document.querySelector(".stylebar-container");
    const styleButtons = buttonContainer.querySelectorAll(".style-button");
    styleButtons.forEach((entry) =>
      entry.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") {
          updateElementsWithLanguage(getSelectedLanguageObject());
        }
      })
    );
  } catch (error) {
    console.log(error);
  }
}

function getData(
  chartData,
  NumOfEvals,
  norm,
  keepUpToDate = true,
  filter = ""
) {
  let results = [];
  //When Resource selected, keep sorting in mind. StrPropsIf sorts via ObjectID
  //First Loop for different kpis
  for (let i = 0; i < chartData.length; i++) {
    let liste = project.RootObject.CreateObjectList();
    let kpis = [];
    let table = project.FindChild(chartData[i].table);
    let count = table.ChildCount;
    let kpiName = chartData[i].kpi;
    let propIDKPI = project.RootObject.LookupPropID(kpiName);
    let numRuns;

    //Create filtered List from COM ObjectList
    for (let k = 1; k <= count; k++) {
      liste.AddObject(0, table.Child[k]);
    }
    filter != "" ? liste.FilterByExprStr(filter) : liste;
    if (chartData[i].runs) {
      chartData[i].runs.length > 0
        ? (numRuns = liste.ObjectCount)
        : (numRuns = Math.min(liste.ObjectCount, NumOfEvals));
    } else {
      numRuns = NumOfEvals;
    }

    for (let j = 1; j <= numRuns; j++) {
      let entry = liste.Object[j];
      try {
        kpis[j - 1] = {
          Code: entry.Code,
          kpiValue: chartData[i].res
            ? dynamicConvert(
                entry.GetAsStr(propIDKPI, 1).split(";")[chartData[i].resI - 1]
              )
            : dynamicConvert(entry.GetAsStr(propIDKPI, 1)),
        };
      } catch (e) {}
    }
    kpis = kpis.filter((n) => n);
    try {
      results[i] = {
        name: getKPIname(kpiName),
        aspCode: propIDKPI,
        data: norm
          ? normalize(
              kpis.map((entry) => entry.kpiValue),
              propIDKPI
            )
          : kpis.map((entry) => entry.kpiValue),
        normData: normalize(
          kpis.map((entry) => entry.kpiValue),
          propIDKPI
        ),
        code: kpis.map((entry) => entry.Code),
        normalize: norm,
        tempData: kpis.map((entry) => entry.kpiValue),
        resource: chartData[i].res,
        resI: chartData[i].resI,
      };
    } catch (e) {
      console.log(e);
    }
  }
  if (chartData[0].runs) {
    return chartData[0].runs.length > 0
      ? filterObjectByCodes(results, chartData[0].runs)
      : results;
  } else {
    return results;
  }
}

function transformData(data, keyPairs) {
  if (keyPairs.length === 1) {
    const [originalKey, newKey] = keyPairs[0];
    // Return an array of values directly if only one keyPair is specified
    return data.map((item) => item[originalKey]);
  } else {
    return data.map((item) => {
      let newItem = {};
      keyPairs.forEach(([originalKey, newKey]) => {
        // No special processing needed for 'data' anymore, directly copy/rename the key
        if (item.hasOwnProperty(originalKey)) {
          newItem[newKey] = item[originalKey];
        }
      });
      return newItem;
    });
  }
}

function refreshData(data, id, filter) {
  let widgetID = id;
  const oldData = data;
  const widget = document.getElementById(widgetID);
  let newData = [];
  let chartData = [];
  let re = /User_/;

  for (let i = 0; i < oldData.length; i++) {
    let kpi = project.RootObject.LookupPropertyDefFromPropID(
      oldData[i].aspCode
    ).Code;
    let table = project.RootObject.LookupPropertyDefFromPropID(
      oldData[i].aspCode
    ).Code.match(re)
      ? project.RootObject.LookupPropertyDefFromPropID(
          oldData[i].aspCode
        ).Code.split("User_")[0]
      : project.RootObject.LookupPropertyDefFromPropID(
          oldData[i].aspCode
        ).Code.split("_")[0];
    let numOfEvals = oldData[i].data.length;
    chartData[i] = {
      table: table,
      kpi: kpi,
      normalize: oldData[i].normalize,
      res: false,
      numOfEvals: numOfEvals,
    };
  }

  newData = getData(
    chartData,
    chartData[0].numOfEvals,
    chartData[0].normalize,
    true,
    filter
  );
  widget.setAttribute("data", JSON.stringify(newData));
  return newData;
}

function getAllSchedRuns() {
  let tableCode = document.getElementById("table").value;
  if (tableCode != "Resource") {
    try {
      let table = project.FindChild(tableCode);
      let count = table.ChildCount;
      let tree = [];

      for (i = 1; i <= count; i++) {
        let entry = table.Child[i];
        tree[i - 1] = {
          name: entry.Code,
          value: i,
        };
      }
      return tree;
    } catch (error) {}
  }
}
