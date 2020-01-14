function updateSheets(){
  // 
  var spreadSheetsId = '1p1lgpHDuOOEYncIE2pDUA38Y2hxxLrCLFRXmfu4mtB0';
  var googleSlidesId = '1r_yCZYJh-ulCuoGIokoAQOUrK5OGMWh1bSn2tI2tSEs';
  var linkTable = null;
  
  // Open a presentation by ID.
  var presentation = SlidesApp.openById(googleSlidesId);
  var sheetForm = SpreadsheetApp.openById(spreadSheetsId);
  
  var firstSlide = presentation.getSlides()[0];
  
  //columnas y filas del spreadsheet
  var rows = sheetForm.getSheetByName('Hoja 1').getLastRow();
  var columns = sheetForm.getSheetByName('Hoja 1').getLastColumn();
  
  var values = sheetForm.getSheetByName('Hoja 1').getRange(1,1,rows, columns).getValues();
  linkTable = firstSlide.getTables()[0];

  //columnas y filas de la tabla de la presentacion
  var prColumns = linkTable.getNumColumns();
  var prRows = linkTable.getNumRows();
  
  if(linkTable==null){
    var table = firstSlide.insertTable(rows, columns);
  }
  else if(columns!=prColumns || rows!=prRows){
    linkTable.remove();
    var table = firstSlide.insertTable(rows, columns);
  }
  else{
    var table = linkTable;
  }
 
  for(var i=0;i<prRows;i++){
    for(var j=0;j<prColumns;j++){
      table.getRow(i).getCell(j).getText().clear();
      table.getRow(i).getCell(j).getText().appendText(values[i][j]);
    }
  }

}
