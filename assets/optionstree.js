function generateTreeSelect(bool) {
  const optionsTreeSchedRun = getAllSchedRuns();

  const containerEP = document.getElementById("selectSchedRun");
  const treeSelectSchedRun = new Treeselect({
    parentHtmlContainer: containerEP,
    options: optionsTreeSchedRun,
    placeholder: "Wähle Planungsbefehle aus",
    isSingleSelect: bool,
  });
}
