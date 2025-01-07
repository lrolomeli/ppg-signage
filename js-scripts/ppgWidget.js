// Google Slides Presentation ID
var gspid = '1VECSVyUE7VubLX3TI4SPwetNa54jbMtVEM-P5uyPgj8';
// Google Spreadsheets ID
var gssid = '15QyxJ-_qsIC6gDHrdAieVubFJDVtyfminR7rg4mCCcw';

var cpFechaId = "SLIDES_API632405331_0";
var cpClienteId = "SLIDES_API632405331_1";
var cpProductoId = "SLIDES_API632405331_2";
var cpCantidadId = "SLIDES_API632405331_3";
//SlidesApp.openById(gspid).getSlides()[0].getPageElementById(textboxId).asShape().getText().setText("hoal");
var iyFechaId = "SLIDES_API175318808_0";
var iyClienteId = "SLIDES_API175318808_1";
var iyProductoId = "SLIDES_API175318808_2";
var iyCantidadId = "SLIDES_API175318808_3";

var inFechaId = "SLIDES_API1307280295_0";
var inClienteId = "SLIDES_API1307280295_1";
var inProductoId = "SLIDES_API1307280295_2";
var inCantidadId = "SLIDES_API1307280295_3";


var DATE_COLUMN = 1;
var ROW_CEPILLO = 2;
var ROW_INYECCION = 3;
var ROW_INSERCION = 4;


function myFunction() {

  actualizarDatos(obtenerActividades());
  
}

function actualizarDatos(values){

  var shapes = SlidesApp.openById(gspid).getSlides()[0];
  shapes.getPageElementById(cpFechaId).asShape().getText().setText(values[ROW_CEPILLO][1]);
  shapes.getPageElementById(cpClienteId).asShape().getText().setText(values[ROW_CEPILLO][2]);
  shapes.getPageElementById(cpProductoId).asShape().getText().setText(values[ROW_CEPILLO][3]);
  shapes.getPageElementById(cpCantidadId).asShape().getText().setText(values[ROW_CEPILLO][4]);
  
  shapes.getPageElementById(iyFechaId).asShape().getText().setText(values[ROW_INYECCION][1]);
  shapes.getPageElementById(iyClienteId).asShape().getText().setText(values[ROW_INYECCION][2]);
  shapes.getPageElementById(iyProductoId).asShape().getText().setText(values[ROW_INYECCION][3]);
  shapes.getPageElementById(iyCantidadId).asShape().getText().setText(values[ROW_INYECCION][4]);
  
  shapes.getPageElementById(inFechaId).asShape().getText().setText(values[ROW_INSERCION][1]);
  shapes.getPageElementById(inClienteId).asShape().getText().setText(values[ROW_INSERCION][2]);
  shapes.getPageElementById(inProductoId).asShape().getText().setText(values[ROW_INSERCION][3]);
  shapes.getPageElementById(inCantidadId).asShape().getText().setText(values[ROW_INSERCION][4]);

}

function obtenerActividades(){

  var values = SpreadsheetApp.openById(gssid).getRange("A1:E5").getValues();
  values[2][1] = Utilities.formatDate(values[2][DATE_COLUMN], "GMT", "dd/MM/yyyy");
  values[3][1] = Utilities.formatDate(values[3][DATE_COLUMN], "GMT", "dd/MM/yyyy");
  values[4][1] = Utilities.formatDate(values[4][DATE_COLUMN], "GMT", "dd/MM/yyyy");
  return values;
  
}
