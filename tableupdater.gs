// Google Slides Presentation ID
var gspid = '1B134X93vjGaY6DX_k8ucjn6WbpnzkCm1NRS2advHhdo';
// Google Spreadsheets ID
var gssid = '1oiEN7twPu4VzPloKiGW12LumqvOvLkWTYzhCj0eCML0';
// Instead of creating a new slide we want to modify an existing slide
var pageId = "35a57c39-8f40-4144-9134-fd7ec7d85645";
// Instead of creating a table we are going to re use it.
var tableId = "c3356d7a-1c57-4e57-a7a7-9363faa51f00";
// Celdas que contienen informacion de pedidos
var range = SpreadsheetApp.openById(gssid).getDataRange();
// Cantidad de Filas en el documento de pedidos en spreadsheet
var numFilas = range.getValues().length;
// Numero de filas que quieres que haya por diapositiva
var filasXSlide = 13;
// Numero de filas sobrantes en la ultima diapositiva
var filasDeSobra = numFilas % filasXSlide;
// Si no hay filas sobrantes significa que el numero de diapositivas es 
// igual a la cantidad de filas entre el numero de filas por diapositiva
// si hay filas sobrantes redondeamos hacia arriba el resultado
var neededSlides = (filasDeSobra == 0) ? (numFilas / filasXSlide) : parseInt(numFilas / filasXSlide) + 1;
// Cantidad actual de diapositivas
var numberSlides = SlidesApp.openById(gspid).getSlides().length;

function main() {

    emparejarDiapositivas();
    // Checar que las filas de cada tabla esten correctas
    actualizarTablas();
    // Modificar el contenido de las tablas en las diapositivas, asi como formato y color.
    escribirTablas();
}

function emparejarDiapositivas() {

    if (numberSlides == neededSlides)
        return;

    else if (numberSlides > neededSlides) {
        var slides = numberSlides - neededSlides;
        //Se deben quitar slides diapositivas
        deleteSlides(numberSlides, slides);

    }
    else {
        var slides = neededSlides - numberSlides;
        //Se deben agregar slides diapositivas
        addSlides(numberSlides, slides);
    }

}

function addSlides(length, slides) {
    var slide = SlidesApp.openById(gspid).getSlides()[0];
    for (var i = 0; i < slides; i++) {
        slide.duplicate()
    }

}
//slides son las diapositivas por quitar
//length son las diapositivas que tenemos
//length - 1 nos coloca en la ultima diapositiva.
function deleteSlides(length, slides) {
    for (var i = 1; i < slides + 1; i++) {
        SlidesApp.openById(gspid).getSlides()[length - i].remove();
    }
}

function actualizarTablas() {

    var tabla=null;
    //Si leftOver es positivo quiere decir que sobran filas
    if (filasDeSobra) {
        //Esas filas son las que se deben agregar en la ultima diapositiva
        Logger.log("diapositiva"+(neededSlides - 1));
        tabla = SlidesApp.openById(gspid).getSlides()[neededSlides - 1].getTables()[0];
        coincidirFilas(tabla, filasDeSobra);
      
      Logger.log("Filas necesarias"+neededSlides);

        for (var i = 0; i < neededSlides - 1; i++) {
            Logger.log("diapositiva "+i);
            //obtenemos la diapositiva i                                           
            tabla = SlidesApp.openById(gspid).getSlides()[i].getTables()[0];
            coincidirFilas(tabla, filasXSlide);
        }
    }
    else {
        //Solamente si las filas son exactas no hay necesidad de colocarnos en la ultima diapositiva
        for (var n = 0; n < neededSlides; n++) {
            //obtenemos la diapositiva i   
            Logger.log("diapositiva "+n);
            tabla = SlidesApp.openById(gspid).getSlides()[n].getTables()[0];
            coincidirFilas(tabla, filasXSlide);
        }
    }

}

function coincidirFilas(tabla, necessaryRows) {

    //sacamos el numero de filas en la tabla i
    var filas = tabla.getNumRows();

    if (filas == necessaryRows) {
        //Logger.log("Iguales");
    }
    else if (filas > necessaryRows) {
        //Quitar filas
        for (var i = 0; i < (filas - necessaryRows); i++) {
            tabla.getRow(0).remove();
        }
    }
    else {
        //Agregar filas
        for (var i = 0; i < (necessaryRows - filas); i++) {
            tabla.appendRow();
        }
    }
    //Al mandar a llamar esta linea le estoy mandando
    Logger.log("Numero real de filas: "+tabla.getNumRows());
    Logger.log("Filas necesarias: "+necessaryRows);
    // necessaryRows = ROWPERSLIDE O LEFTOVER
  //autoresize solo se debe usar despues de una corrida habiendo modificado la tabla
  //no acepta cambios repentinos.  
  //autoResizeTable(necessaryRows, tabla);

}

/* Marcador funcion aprobada */
function escribirTablas(){
    var values = range.getValues();
    var slideNumber = 0;
    var bgColors = range.getBackgrounds();
  var fontColor = range.getFontColors();
          
    //Se indica la diapositiva donde esta la tabla
    var tabla = null;
  
    for(var i=0;i<values.length;i++){
      //Aqui entra cada que pasan las filas que caben por slide
      if((i%filasXSlide)==0)
      {
        //Logger.log(i);
        tabla = SlidesApp.openById(gspid).getSlides()[slideNumber].getPageElements()[0].asTable();
        slideNumber++;
      }
      for(var j=0; j<8; j++){
        
        if(i>1 && j==6){
          if(values[i][j].length!=0)
            values[i][j] = Utilities.formatDate(values[i][j], "GMT", "dd/MM/yyyy");
        }
        tabla.getCell(i%filasXSlide, j).getText().setText(values[i][j]);
        //Se escriben las 8 columnas de cada fila en la tabla respectiva.
        /*
        if(i==0){
          tabla.getCell(i%filasXSlide, j).getText().setText(" ");
          if(j==3)
            tabla.getCell(i%filasXSlide, j).getText().setText("PEDIDOS");
        }
        else{
          tabla.getCell(i%filasXSlide, j).getText().setText(values[i][j]);
        }
        
        if(i==1&&j==5){
          tabla.getCell(i%filasXSlide, j).getText().setText("Codigo Color");
        }
        */
        
        //Checar si la celda tiene texto para modificar sus parametros o no.
        //tabla.getCell(i%ROWS_PER_SLIDE, j).getText().isEmpty()
        if(values[i][j].length!=0){
          if(i==0){
            tabla.getCell(i%filasXSlide, j).setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setForegroundColor(fontColor[i][j]);
            tabla.getCell(i%filasXSlide, j).getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setBold(true);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setFontSize(8);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setFontFamily("Arial");
          }
          else if(i==1){
            tabla.getCell(i%filasXSlide, j).setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
            tabla.getCell(i%filasXSlide, j).getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setForegroundColor(fontColor[i][j]);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setBold(true);
            
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setFontSize(8);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setFontFamily("Arial");
          }
          else{

            tabla.getCell(i%filasXSlide, j).setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
            tabla.getCell(i%filasXSlide, j).getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setBold(true);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setForegroundColor(fontColor[i][j]);
            
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setFontSize(8);
            tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setFontFamily("Arial");
          }
        }
        
        tabla.getRow(i%filasXSlide).getCell(j).getFill().setSolidFill(bgColors[i][j]);
        
      }
      
    }
  }

  function autoResizeTable(rows,tabla){
  
    var requests = [];
    Logger.log("Numero de filas para el metodo autoresize"+rows);
    for (var i = 0; i < rows; i++) {
      Logger.log("iteracion autoresize"+i);
      requests.push
      ({updateTableRowProperties: 
        {
          tableRowProperties: 
          {minRowHeight: {magnitude: 5, unit: "PT"}},
          rowIndices: [i],
          objectId: tabla.getObjectId(),
          fields: "minRowHeight"
        }
       }
      );
    }
    
    var response = Slides.Presentations.batchUpdate({'requests': requests}, gspid);
  
  }

  function formatColumnSize(){
    
    var widthForColumns = [65,60,60,170,100,60,60,145]; //SUMAN 720
    var requests = [];
    
    for(var j in widthForColumns){    
        requests.push
        ({updateTableColumnProperties: 
          {tableColumnProperties:                           
           {columnWidth: {magnitude: widthForColumns[j], unit: "PT"}},
           columnIndices: [j],
           objectId: tableId,
           fields: "columnWidth"
          }
         });
         
    }
    var response = Slides.Presentations.batchUpdate({'requests': requests}, gspid);
  }
