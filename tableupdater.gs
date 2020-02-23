  // Google Slides Presentation ID
  var gspid = '1B134X93vjGaY6DX_k8ucjn6WbpnzkCm1NRS2advHhdo';
  // Google Spreadsheets ID
  var gssid = '1p1lgpHDuOOEYncIE2pDUA38Y2hxxLrCLFRXmfu4mtB0';
  // Instead of creating a new slide we want to modify an existing slide
  var pageId = "35a57c39-8f40-4144-9134-fd7ec7d85645";
  // Instead of creating a table we are going to re use it.
  var tableId = "c3356d7a-1c57-4e57-a7a7-9363faa51f00";
  // Obtaining table from id
  var table = SlidesApp.openById(gspid).getSlideById(pageId).getPageElementById(tableId).asTable();
  
  var ROWS = SpreadsheetApp.openById(gssid).getDataRange().getValues().length;
  
  var ROWS_PER_SLIDE = 3;

  var LEFTOVER = ROWS % ROWS_PER_SLIDE; //Si las filas son exactas devuelve true.

  var DIAPOSITIVAS = ROWS/ROWS_PER_SLIDE;

  var DIAPOSITIVAS_ENTERAS = parseInt(DIAPOSITIVAS);

  var neededSlides = (LEFTOVER) ? DIAPOSITIVAS : DIAPOSITIVAS_ENTERAS + 1;


// Esta funcion se esta llamando cada vez que se ejecuta un cambio y si se hace uno tras otro se llamara antes de que la funcion pueda realizar el cambio.
// Las Celdas combinadas estan propensas a errores con este codigo
// Se deben tomar en cuenta para poderlas utilizar y adaptar el codigo a ellas.
function makeChanges(){
 
  // Primero Obtener las filas
  var range = SpreadsheetApp.openById(gssid).getDataRange();
  // Obtener las diapositivas que tenemos
  var numberSlides = SlidesApp.openById(gspid).getSlides().length;
  // Obtener las diapositivas necesarias para que quepan las filas
  // Agregar o Quitar diapositivas para emparejar
  emparejarDiapositivas(numberSlides, neededSlides);
  // Checar que las filas de cada tabla esten correctas
  actualizarTablas(ROWS, neededSlides);
  // Modificar el contenido de las tablas en las diapositivas, asi como formato y color.
  escribirTablas(range);
  
}

function checkingErrors(){
  var range = SpreadsheetApp.openById(gssid).getDataRange();
  escribirTablas(range);
}

/* Marcador funcion aprobada */
function escribirTablas(range){
  var values = range.getValues();
  var slideNumber = 0;
  var bgColors = range.getBackgrounds();
        
  //Se indica la diapositiva donde esta la tabla
  var tabla = null;
  
  for(var i=0;i<values.length;i++){
    //Aqui entra cada que pasan 10 filas
    if((i%ROWS_PER_SLIDE)==0)
    {
      Logger.log(i);
      tabla = SlidesApp.openById(gspid).getSlides()[slideNumber].getPageElements()[0].asTable();
      slideNumber++;
    }
    for(var j=0; j<8; j++){
      //Se escriben las 8 filas de cada fila en la tabla respectiva.
      tabla.getRow(i%ROWS_PER_SLIDE).getCell(j).getText().setText(values[i][j]);
      //Checar si la celda tiene texto para modificar sus parametros o no.
      //tabla.getRow(i%10).getCell(j).getText().isEmpty()
      if(values[i][j].length!=0){
        tabla.getRow(i%ROWS_PER_SLIDE).getCell(j).getText().getTextStyle().setFontSize(20);
      }
      
      tabla.getRow(i%ROWS_PER_SLIDE).getCell(j).getFill().setSolidFill(bgColors[i][j]);
    }
    
  }
}

// Marcador funcion aprobada
function emparejarDiapositivas(numberSlides, neededSlides){

  if(numberSlides == neededSlides)
    return;
  
  else if(numberSlides>neededSlides){
    var slides = numberSlides-neededSlides;
    //Se deben quitar slides diapositivas
    deleteSlides(numberSlides, slides);
    
  }
  else{
    var slides = neededSlides-numberSlides;
    //Se deben agregar slides diapositivas
    addSlides(numberSlides, slides);
  }

}


function coincidirFilas(tabla, necessaryRows){
  
  //sacamos el numero de filas en la tabla i
  var filas = tabla.getNumRows();
  
  if(filas == necessaryRows)
    return;
  else if(filas > necessaryRows){
    //Quitar filas
    for(i=0; i<(filas-necessaryRows); i++){
      tabla.getRow(0).remove();
    }
  }
  else{
    //Agregar filas
    for(i=0; i<(necessaryRows-filas); i++){
      tabla.appendRow();
    }
  }
  
}

/* Marcador funcion aprobada */
function actualizarTablas(){
  
  var tabla;
  
  if(LEFTOVER){
    tabla = SlidesApp.openById(gspid).getSlides()[DIAPOSITIVAS_ENTERAS].getTables()[0];
    coincidirFilas(tabla, LEFTOVER)
  }
  
  for(i=0; i<neededSlides; i++){
    //obtenemos la diapositiva i                                           
    tabla = SlidesApp.openById(gspid).getSlides()[i].getTables()[0];
    coincidirFilas(tabla, ROWS_PER_SLIDE);
  }
}


/* Marcador funcion aprobada */
function actualizarFilas(rowsheet, numDeTablas){
  var tabla;
  var i = 0;
  //si hay 2 tablas
  for(i=0; i<numDeTablas; i++){
    //obtenemos la tabla i                                           // Esta linea llama al metodo getpageelement de undefined
    tabla = SlidesApp.openById(gspid).getSlides()[i].getTables()[0]; // Solucionado era por que no se percataba que ya se crearon las diapositivas
    //sacamos el numero de filas en la tabla i
    var filas = tabla.getNumRows();
    Logger.log(i);
    
    // En la segunda corrida si las filas del documento son mayor a 20 hay que hacerlas
    //comparamos con el numero de filas del sheet
    if(rowsheet>(10+10*i)){
      //entonces en la primera corrida si hay mas de diez filas tenemos que tomar unicamente 10
      //vemos cuantas filas tiene la tabla y la igualamos a 10
      if(filas<10){
        //Agregar filas
        for(i=0; i<(10-filas); i++){
          tabla.appendRow();
        }
      }
      else if(filas>10){
        //Quitar filas
        for(i=0; i<(filas-10); i++){
          tabla.getRow(10).remove();
        }
      }
      
    }
    
    // en caso de que no sean mayor a 20 tenemos 
    //Si no hay mas de diez filas en el spreasheet
    //Se tienen que acomodar todas las filas en la primer diapositiva
    else
    {
      var trueRows = rowsheet - (10*i);
      //vemos cuantas filas tiene la tabla y la igualamos a rowsheet
      if(filas<trueRows){
        //Agregar filas cuando faltan para igualar al ss
        for(var j=0; j<(trueRows-filas); j++){
          Logger.log("Se agrego una fila"+j);
          tabla.appendRow();
        }
      }
      else if(filas>trueRows){
        Logger.log("sientro");
        //Quitar filas para igualar al spreadsheet.
        for(var k=0; k<(filas-trueRows); k++){
          Logger.log("Se quito una fila"+k);
          tabla.getRow(filas-k-1).remove();
        }
      }
    }
    
  }
}

// Marcador de funcion aprobada
//function obtenerDiapositivas2(){
  //Obtener las diapositivas necesarias
  //var diapositivas = 0;
  //Primer Metodo
  //Por cada 10 filas es una diapositiva nueva
  //for(var i=0; i<rows; i++){
    //if((i)%rowsPerSlide == 0){
      //diapositivas++;
    //}
  //}
  
  //Segundo Metodo
  //diapositivas = Math.ceil(rows/rowsPerSlide);
  
  //Tercer Metodo
  

    
  //Cuarto Metodo
  //var diap = rows/rowsPerSlide;
  //diapositivas = parseInt(diap);
  //if(diap>diapositivas)
  //{
    //diapositivas++;
  //}
  
  //return diapositivas;
//}

// Marcador de funcion aprobada
function addSlides(length, slides){
  var slide = SlidesApp.openById(gspid).getSlides()[0];
  for(var i=0;i<slides;i++){
    slide.duplicate()
  }

}

//en caso de tener que eliminar 2 diapositivas nos colocamos en la diapositiva length - 2
// Marcador de funcion aprobada
function deleteSlides(length, slides)
{
  for(var i=1; i<slides+1; i++){
    SlidesApp.openById(gspid).getSlides()[length-i].remove();
  }
}

//Esto Permitira Establecer siempre el mismo largo de cada columna
//Y la altura de cada fila.
function modificarDimensionesTabla(){
  

}

/**
 * Create a new slide.
 * @param {string} presentationId The presentation to add the slide to.
 */
function autoResizeTable(rows){
  
  var requests = [];
  
  for (var i = 0; i < rows; i++) {
    
    requests.push
    ({updateTableRowProperties: 
      {
        tableRowProperties: 
        {minRowHeight: {magnitude: 10, unit: "PT"}},
        rowIndices: [i],
        objectId: tableId,
        fields: "minRowHeight"
      }
     }
    );
  }
  
  var response = Slides.Presentations.batchUpdate({'requests': requests}, gspid);

}

/**
 * Create a new slide.
 * @param {string} presentationId The presentation to add the slide to.
 */
function formatColumnSize(){
    
  var widthForColumns = [60,60,60,170,100,50,70,150]; //SUMAN 720
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

/**
 * Create a new slide.
 * @param {string} presentationId The presentation to add the slide to.
 */
function setTablePosition(){
  var requests = [{
      "updatePageElementTransform": {
        "objectId": tableId,
        "applyMode": "ABSOLUTE",
        "transform": {
            "scaleX": 1,
            "scaleY": 1,
            "translateX": 0,
            "translateY":  0,
            "unit": "PT"
        }
      }
    }];
  var response = Slides.Presentations.batchUpdate({'requests': requests}, gspid);

}
