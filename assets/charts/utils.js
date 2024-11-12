var data = [];

function saveCombination() {
  data = [];

  const treeData = document.getElementsByClassName(
    "treeselect-input__tags-name"
  );
  let schedRuns = [];
  for (i = 0; i < treeData.length; i++) {
    schedRuns.push(treeData.item(i).innerText);
  }

  const nodeListKPI = document.querySelectorAll('[id="property"]');
  const kpiValues = Array.from(nodeListKPI).map((select) => select.value);

  const nodeListTable = document.querySelectorAll('[id="table"]');
  const tableValues = Array.from(nodeListTable).map((select) => select.value);

  const resDocument = document.getElementById("resourceSelect");
  const resValue = resDocument.value;

  const maxLength = Math.max(kpiValues.length, tableValues.length);

  for (let i = 0; i < maxLength; i++) {
    const obj = {
      table: tableValues[i] !== undefined ? tableValues[i] : null,
      kpi: kpiValues[i] !== undefined ? kpiValues[i] : null,
      normalize: false,
      res: resValue !== undefined ? resValue.split("_")[0] : null,
      resI: resValue.split("_")[1],
      upToDate: schedRuns.length == 0 ? true : false,
      runs: schedRuns,
    };
    data.push(obj);
  }
  return data;
}

function removeHidden(...elem) {
  try {
    elem.forEach((e) => {
      e.classList.remove("hidden");
    });
  } catch (e) {
    console.log(e);
  }
}

function addHidden(...elem) {
  try {
    elem.forEach((e) => {
      e.classList.add("hidden");
    });
  } catch (e) {
    console.log(e);
  }
}

function resetSelectValues() {
  document.getElementById("table").selectedIndex = 0;
  document.getElementById("chartType").selectedIndex = 0;
  document.getElementById("property").selectedIndex = 0;
  document.getElementById("modalStaticWidgetNumOfEvals").value = 1;
  document.getElementById("modalWidgetFilter").value = "";
  document.getElementById("selectSchedRun").innerHTML = "";
  document.getElementById("resourceSelect").innerHTML = "";
  document.getElementById("modalStaticWidgetupToDate").checked = true;
  addHidden(NumOfEvals, Ressource, wrapperSchedOptions);
  removeHidden(filterSchedRun);

  var newSelects = document.querySelectorAll(".new-select");
  newSelects.forEach(function (element) {
    var closestDiv = element.closest(".selectData");
    closestDiv.remove();
  });

  //Delete "+" when closing the modal
  let selectKPI = document.getElementById("selectKPIs");
  var plusButtons = selectKPI.querySelectorAll("i");
  plusButtons.forEach((elem) => elem.remove());

  //Add the "+" again
  const kpiSelection = document.getElementById("selectKPIs");
  const addButton = document.createElement("i");
  addButton.className = "fa-solid fa-plus hidden";
  addButton.id = "addButton";

  addButton.onclick = function () {
    addKPIselect();
    generateTableSelect();
    getProperties(document.getElementById("table").value);
  };
  kpiSelection.appendChild(addButton);
}

function splitStringOnce(str, separator) {
  const index = str.indexOf(separator);

  // Check if the separator is found
  if (index === -1) {
    return [str]; // Separator not found, return the original string in an array
  }

  // Split the string into two parts
  const firstPart = str.substring(0, index);
  const secondPart = str.substring(index + separator.length);

  return [firstPart, secondPart];
}

// Function to filter the array
function filterArray(array, pattern) {
  if (pattern === "Resource") {
    const regex1 = new RegExp("Res_");
    const regex2 = new RegExp("KPIEvalResult_");
    return array.filter((object) => {
      const values = Object.values(object);
      // Check if the first value includes matches the regex
      return regex1.test(values[0]) || regex2.test(values[0]);
    });
  } else {
    const regex = new RegExp(pattern);
    return array.filter((object) => {
      const values = Object.values(object);
      // Check if the first value includes matches the regex
      return regex.test(values[0]);
    });
  }
}

function groupByCode(data) {
  const tempStorage = {};
  data.forEach(({ name, data, code }) => {
    code.forEach((codeValue, index) => {
      if (!tempStorage[codeValue]) {
        tempStorage[codeValue] = { code: codeValue, data: [], name: [] };
      }
      tempStorage[codeValue].data.push(data[index]);
      tempStorage[codeValue].name.push(name);
    });
  });
  return Object.values(tempStorage);
}

function appendAllChild(obj, property) {
  let temp = [];
  for (let i = 0; i < obj.length; i++) {
    temp = temp.concat(obj[i][property]);
  }
  return temp;
}

function printPage() {
  window.print();
  location.reload();
}

function splitStringNicely(str) {
  if (str.length > 15) {
    const middleIndex = Math.floor(str.length / 2);
    let spaceIndex = str.indexOf(" ", middleIndex);

    if (spaceIndex === -1) {
      // If no space is found to the right, search to the left
      spaceIndex = str.lastIndexOf(" ", middleIndex);
    }

    if (spaceIndex !== -1) {
      // Split the string at the nearest space
      return [str.substring(0, spaceIndex), str.substring(spaceIndex + 1)];
    } else {
      // If no spaces found, return the whole string in one part, and an empty string as the other
      return [str, ""];
    }
  } else {
    return str;
  }
}

function parseTimeSpan(s) {
  let days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0;

  // Extract days, hours, minutes, and seconds using regex
  const dayMatch = s.match(/(\d+)D/);
  const hourMatch = s.match(/(\d+)h/);
  const minuteMatch = s.match(/(\d+)m/);
  const secondMatch = s.match(/(\d+)s/);

  if (dayMatch) days = parseInt(dayMatch[1]);
  if (hourMatch) hours = parseInt(hourMatch[1]);
  if (minuteMatch) minutes = parseInt(minuteMatch[1]);
  if (secondMatch) seconds = parseInt(secondMatch[1]);

  // Convert to milliseconds
  const milliseconds =
    days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000;
  return milliseconds;
}

function dynamicConvert(s) {
  s = s.trim();
  // Replace commas with dots if they're used as decimal separators in the entire string
  // This will not handle thousands separators correctly, but assumes all commas are decimal
  s = s.replace(/(\d),(\d)/g, "$1.$2");

  // Check for timespan (e.g., "4D13h11m44s")
  if (/^\d*D?\d*h?\d*m?\d*s?$/.test(s) && /(?:D|h|m|s)/.test(s)) {
    return parseTimeSpan(s);
  }

  // Check for numbers followed explicitly by non-digit characters (excluding spaces at the end)
  const numberWithTextMatch = s.match(
    /([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/
  );
  if (numberWithTextMatch) {
    return parseFloat(numberWithTextMatch[0]);
  }

  // Check for integer (e.g., "123")
  if (/^-?\d+$/.test(s)) {
    return parseInt(s);
  }

  // Check for float (e.g., "123.456")
  if (/^-?\d*\.\d+$/.test(s)) {
    return parseFloat(parseFloat(s).toFixed(2));
  }

  // Check for date (assuming YYYY-MM-DD format)
  const date = new Date(s);
  if (!isNaN(date.getTime())) {
    return date.getTime();
  }

  // Return the original string if no pattern matches
  console.log("Keine Conversion gefunden");
  console.log(s);
  return s;
}

function normalize(data, aspCode) {
  let temp = [];
  let temp2 = data;
  const scalerMax = new MaxMinScaler();
  const scalerMin = new MinMaxScaler();
  if (negativeKPI.includes(aspCode)) {
    temp2 = scalerMax.fitTransform(temp2);
    temp.push(temp2);
  } else {
    temp2 = scalerMin.fitTransform(temp2);
    temp.push(temp2);
  }
  return temp2;
}

function filterObjectByCodes(obj, codes) {
  const indices = obj[0].code.reduce((acc, curr, index) => {
    if (codes.includes(curr)) {
      acc.push(index);
    }
    return acc;
  }, []);
  console.log(indices);
  console.log(indices.length);
  let temp = [];
  for (let i = 0; i < obj.length; i++) {
    temp[i] = {
      ...obj[i],
      code: obj[i].code.filter((_, index) => indices.includes(index)),
      data: obj[i].data.filter((_, index) => indices.includes(index)),
      normData: obj[i].normData.filter((_, index) => indices.includes(index)),
      tempData: obj[i].tempData.filter((_, index) => indices.includes(index)),
    };
  }
  return temp;
}
