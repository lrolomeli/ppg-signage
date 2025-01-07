function runLastCall2() {
  var global = SpreadsheetApp.openById("1oiEN7twPu4VzPloKiGW12LumqvOvLkWTYzhCj0eCML0").getSheetByName("modnum").getRange("A1");
  const lock2 = LockService.getScriptLock();
  lock2.tryLock(5000);
  if(lock2.hasLock()){
    var local = global.getValue();
    local = (local > 498) ? 0 : local + 1;
    global.setValue(local);
    SpreadsheetApp.flush();
    lock2.releaseLock();
    Utilities.sleep(30000);
    if(global.getValue()==local){
      run();
    }
  }
}

function runLastCall() {
  var sheetName = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getSheetName();
  if (sheetName == 'PEDIDOS (PRODUCION)') {
    var cache = CacheService.getScriptCache();
    const lock2 = LockService.getScriptLock();
    lock2.tryLock(5000);
    if(lock2.hasLock()){
      var global = cache.get('global');
      global = (global==null) ? 0 : parseInt(global, 10) + 1;
      var local = global;
      cache.put('global',local);
      lock2.releaseLock();
      Utilities.sleep(30000);
      if(parseInt(cache.get('global'),10)==local){
        run();
      }
    }
  }
}

function run()  {
  const lock = LockService.getScriptLock();
  lock.tryLock(90000);
  if(lock.hasLock()){
    main();
    lock.releaseLock();
  }
  else{
    console.log("No se realizo el cambio intente aumentar el tiempo de espera");
  }
  /*Modificaciones conforme al codigo anterior*/
  // var lock = LockService.getDocumentLock(); // 
  // lock.tryLock(30000);
  // if(lock.hasLock()){main();}
  // lock.releaseLock();
}

function main()  {
  //
  var range = SpreadsheetApp.openById("1oiEN7twPu4VzPloKiGW12LumqvOvLkWTYzhCj0eCML0").getDataRange();
  // Cantidad de Filas en el documento de pedidos en spreadsheet
  var numFilas = range.getValues().length;
  // Numero de filas que quieres que haya por diapositiva
  var filasXSlide = 13;
  // Numero de filas sobrantes en la ultima diapositiva
  var filasDeSobra = numFilas % filasXSlide;
  // Si no hay filas sobrantes significa que el numero de diapositivas es 
  // igual a la cantidad de filas entre el numero de filas por diapositiva
  // si hay filas sobrantes redondeamos hacia arriba el resultado
  //var neededSlides = (filasDeSobra == 0) ? (numFilas / filasXSlide) : parseInt(numFilas / filasXSlide) + 1;
  //CALCULO DE DIAPOSITIVAS CON FUNCION TECHO
  var neededSlides = Math.ceil(numFilas / filasXSlide);
  var slides = SlidesApp.openById('1B134X93vjGaY6DX_k8ucjn6WbpnzkCm1NRS2advHhdo').getSlides();
  // Cantidad actual de diapositivas
  var numberSlides = slides.length;
  
  emparejarDiapositivas(slides, numberSlides, neededSlides);
  slides = SlidesApp.openById('1B134X93vjGaY6DX_k8ucjn6WbpnzkCm1NRS2advHhdo').getSlides();
  actualizarTablas(slides, range, neededSlides, filasDeSobra, filasXSlide);
  escribirTablas(slides, range, filasXSlide);
  
}

function emparejarDiapositivas(slides, numberSlides, neededSlides) {
  
  if (numberSlides == neededSlides)
  {
    return;
  }
  else if (numberSlides > neededSlides) {
    var slidesToDelete = numberSlides - neededSlides;
    //Se deben quitar slides diapositivas
    deleteSlides(slides, numberSlides, slidesToDelete);
    
  }
  else {
    var slidesToAdd = neededSlides - numberSlides;
    //Se deben agregar slides diapositivas
    addSlides(slides, numberSlides, slidesToAdd);
  }
  
}

function addSlides(slides, length, slidesToAdd) {
    for (var i = 0; i < slidesToAdd; i++) {
        slides[0].duplicate()
    }

}
//slides son las diapositivas por quitar
//length son las diapositivas que tenemos
//length - 1 nos coloca en la ultima diapositiva.
function deleteSlides(slides, length, slidesToDelete) {
    for (var i = 1; i < slidesToDelete + 1; i++) {
        slides[length - i].remove();
    }
}

function actualizarTablas(slides, range, neededSlides, filasDeSobra, filasXSlide) {

  var tabla=null;
  
  //Si leftOver es positivo quiere decir que sobran filas
  if (filasDeSobra) {
    //Esas filas son las que se deben agregar en la ultima diapositiva
    tabla = slides[neededSlides - 1].getTables()[0];
    coincidirFilas(tabla, filasDeSobra);
    
    
    for (var i = 0; i < neededSlides - 1; i++) {
      //obtenemos la diapositiva i                                           
      tabla = slides[i].getTables()[0];
      coincidirFilas(tabla, filasXSlide);
    }
  }
  else {
    //Solamente si las filas son exactas no hay necesidad de colocarnos en la ultima diapositiva
    for (var n = 0; n < neededSlides; n++) {
      //obtenemos la diapositiva n
      tabla = slides[n].getTables()[0];
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
    // necessaryRows = ROWPERSLIDE O LEFTOVER
  //autoresize solo se debe usar despues de una corrida habiendo modificado la tabla
  //no acepta cambios repentinos.  
  //autoResizeTable(necessaryRows, tabla);

}

/*Checar en esta funcion al momento de escribir texto sobre la presentacion.
	Ver que hacer si no hay texto escrito previamente en la celda
	Ver que pasa si ya hay texto
	Ver si es necesario borrar para escribir
	Ver que pasa cuando se realizan dos cambios inmediatos
*/
function escribirTablas(slides, range, filasXSlide){
  // Celdas que contienen informacion de pedidos
  var values = range.getValues();
  var bgColors = range.getBackgrounds();
  var fontColor = range.getFontColors();
  var slideNumber = 0;  
  //Se indica la diapositiva donde esta la tabla
  var tabla = null;
  
  for(var i=0;i<values.length;i++)
  {
    try {
      values[i][6] = Utilities.formatDate(values[i][6], "GMT", "dd/MM/yyyy");
    }
    catch(err) {
      Logger.log(err);
    } 
    //Aqui entra cada que pasan las filas que caben por slide
    if((i%filasXSlide)==0)
    {
      //Logger.log(i);
      tabla = slides[slideNumber].getPageElements()[0].asTable();
      slideNumber++;
    }
    for(var j=0; j<8; j++)
    {   
      // Modificar el contenido de las tablas en las diapositivas, asi como formato y color.
      try {
        /*Con la siguiente linea escribimos la informacion tal cual del spreadsheet.**/
        tabla.getCell(i%filasXSlide, j).getText().setText(values[i][j].toString());
        // Establecer el color de la celda igual que el del spreadsheet.
        tabla.getCell(i%filasXSlide, j).getFill().setSolidFill(bgColors[i][j]);
        // Establecer el contenido de la celda verticalmente alineado
        tabla.getCell(i%filasXSlide, j).setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
        // Establecer el contenido de la celda horizontalmente alineado
        tabla.getCell(i%filasXSlide, j).getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
        // Texto en negritas = true
        tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setBold(true);
        // Establecer el mismo color de letra que en el spreadsheet.
        tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setForegroundColor(fontColor[i][j]);
        // Establecer el tamano de la letra.
        tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setFontSize(8);
        // Establecer la fuente para el texto.
        tabla.getCell(i%filasXSlide, j).getText().getTextStyle().setFontFamily("Arial");
      }
      catch(err) {
        //Checar si la celda tiene texto para modificar sus parametros o no.
        //Se necesita mayor indagacion sobre la siguiente linea para saber cuando es posible utilizarla.
        //tabla.getCell(i%ROWS_PER_SLIDE, j).getText().getLength()>0
        //Por el momento este parametros nos ha funcionado para determinar si existe informacion escrita
        //En la celda de la tabla del spreadsheet length.
        //Pero se debe analizar tambien si hay algo escrito sobre la presentacion en google slides.
      } 
     
    }
    
  }
  
}
