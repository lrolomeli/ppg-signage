function insertValuesIntoTable(table, values, rows, columns){
  
  for(var i=0;i<rows;i++){
    for(var j=0;j<columns;j++){
      table.getRow(i).getCell(j).getText().appendText(values[i][j]);
    }
  }
  //table.getRow(0).setHeight(20);
  //table.setHeight(355);
  table.setLeft(0);
  table.setTop(0);
  //table.scaleHeight(0.1);
  //table.scaleHeight(0.1);
  //table.setWidth(620);esta funcion no existe
  //table.setHeight(355);esta funcion no existe
}

function readValues(spreadsheet, sheetName){
  
  return spreadsheet.getSheetByName(sheetName).getDataRange().getValues();
}

function insertTableIntoSlide(slide, rows, columns){

  var left = 50;
  var top = 50;
  var width = 620;  //Max aprox 720.
  var height = 355; //Max aprox 450.
  
  return slide.insertTable(rows, columns, left, top, width, height);
}

function readRange(spreadsheet, sheetName){
  
  return spreadsheet.getSheetByName(sheetName).getDataRange();
}

function updateTable(slide){
  var spreadSheetsId = '1p1lgpHDuOOEYncIE2pDUA38Y2hxxLrCLFRXmfu4mtB0';
  var spreadsheet = SpreadsheetApp.openById(spreadSheetsId);
  var sheetName = 'Hoja 1';
  
  var range = readRange(spreadsheet, sheetName);
  var rows = range.getLastRow() - range.getRow();
  var columns = range.getLastColumn() - range.getColumn();
  var table = insertTableIntoSlide(slide, rows, columns);
  var values = readValues(spreadsheet, sheetName);
  return insertValuesIntoTable(table, values, rows, columns);

}

function actualizarPedidos(){
  
  var googleSlidesId = '1r_yCZYJh-ulCuoGIokoAQOUrK5OGMWh1bSn2tI2tSEs';
  // Open a presentation by ID.
  var presentation = SlidesApp.openById(googleSlidesId);
  var slide = presentation.getSlides()[0];
  
  updateTable(slide); 
}
