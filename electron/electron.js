// Configuraciones de Electro
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.IS_DEV == "true" ? true : false;
// const {PosPrinter  } = require('@plick/electron-pos-printer');
const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    autoHideMenuBar: true,
    resizable: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    },
  });

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// Configuración de IPC
// Manejar mensajes IPC del proceso de renderizado (al frontend) 
ipcMain.on('formulario:enviar', async (event, data) => {
  console.log('Datos recibidos desde el formulario:', data);
  // Aquí manejar el procesamiento los datos recibidos desde el formulario y realizar acciones en el backend

  // Luego, mandar una respuesta de vuelta al proceso de renderizado (al frontend) si es necesario


  // const dataE = [
  //   {
  //     type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table' | 'divider'
  //     value: 'SAMPLE HEADING',
  //     style: { fontWeight: '700', textAlign: 'center', fontSize: '60px', top: 0, position: "absolute" },
  //   },
  //   {
  //     type: 'divider', // we could style it using the style property, we can use divider anywhere, except on the table header
  //   },
  //   {
  //     type: 'text',
  //     value: 'Secondary text',
  //     style: { textDecoration: 'underline', fontSize: '60px', textAlign: 'center', color: 'red' },
  //   },
  //   {
  //     type: 'divider', // we could style it using the style property, we can use divider anywhere, except on the table header
  //   },
  //   {
  //     type: 'barCode',
  //     value: '023456789010',
  //     height: 140, // height of barcode, applicable only to bar and QR codes
  //     width: 2, // width of barcode, applicable only to bar and QR codes
  //     displayValue: true, // Display value below barcode
  //     fontSize: 155,
  //   },
  //   //   {
  //   //   type: 'table',
  //   //   // estilo de la tabla
  //   //   style: { fontFamily: 'sans-serif', width: '100%' }, // ajuste el ancho según sea necesario
  //   //   // lista de columnas para el encabezado de la tabla
  //   //   tableHeader: [
  //   //     { type: 'text', value: 'Animal', width: '100%' }, // ajuste el ancho según sea necesario
  //   //     { type: 'text', value: 'Count', width: '100%' }, // ajuste el ancho según sea necesario
  //   //   ],
  //   //   // matriz multidimensional que representa las filas y columnas del cuerpo de la tabla
  //   //   tableBody: [
  //   //     [
  //   //       { type: 'text', value: 'Cat', width: '100%' }, // ajuste el ancho según sea necesario
  //   //       { type: 'text', value: '10', width: '100%' }, // ajuste el ancho según sea necesario
  //   //     ],
  //   //     [
  //   //       { type: 'text', value: 'Dog', width: '100%' }, // ajuste el ancho según sea necesario
  //   //       { type: 'text', value: '5', width: '100%' }, // ajuste el ancho según sea necesario
  //   //     ],
  //   //     [
  //   //       { type: 'text', value: 'Pig', width: '50%' }, // ajuste el ancho según sea necesario
  //   //       { type: 'text', value: '7', width: '100%' }, // ajuste el ancho según sea necesario
  //   //     ],
  //   //   ],
  //   //   // lista de filas para el pie de la tabla
  //   //   tableFooter: [
  //   //     [
  //   //       { type: 'text', value: 'Subtotal', width: '100%' }, // ajuste el ancho según sea necesario
  //   //       { type: 'text', value: '22', width: '100%' }, // ajuste el ancho según sea necesario
  //   //     ],
  //   //     [
  //   //       { type: 'text', value: 'Total', width: '100%' }, // ajuste el ancho según sea necesario
  //   //       { type: 'text', value: '22', width: '100%' }, // ajuste el ancho según sea necesario
  //   //     ],
  //   //   ],
  //   //   // estilo personalizado para el encabezado de la tabla
  //   //   tableHeaderStyle: { backgroundColor: '#000', color: 'black' },
  //   //   // estilo personalizado para el cuerpo de la tabla
  //   //   tableBodyStyle: { border: '45px solid #ddd' },
  //   //   // estilo personalizado para el pie de la tabla
  //   //   tableFooterStyle: { backgroundColor: '#000', color: 'black' },
  //   //   // estilo personalizado para las celdas del encabezado
  //   //   tableHeaderCellStyle: {
  //   //     padding: '500px', // ajuste según sea necesario
  //   //     textAlign: 'center',
  //   //   },
  //   //   // estilo personalizado para las celdas del cuerpo
  //   //   tableBodyCellStyle: {
  //   //     padding: '500px', // ajuste según sea necesario
  //   //     textAlign: 'center',
  //   //   },
  //   //   // estilo personalizado para las celdas del pie
  //   //   tableFooterCellStyle: {
  //   //     padding: '500px', // ajuste según sea necesario
  //   //     fontWeight: '1000',
  //   //     textAlign: 'center',
  //   //   },
  //   // },
  // ];



  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,                                  // Printer type: 'star' or 'epson'
    interface: '//./COM0',                       // Printer interface

  });


  let isConnected = await printer.isPrinterConnected();

  if (isConnected) {
    console.log("conectado");
    await printer.alignCenter();
    printer.println("Hello World");
    printer.printQR("https://github.com/Klemen1337/node-thermal-printer");
    printer.cut()
    printer.execute(function (err) {
      if (err) {
        console.error("Print Failed", err);
      } else {
        console.log("Print Done");
      }
    })
    event.reply('formulario:respuesta', {mensaje: 'Impresión completada.'});

  }
  else {
    event.reply('formulario:respuesta', {mensaje: 'No Conectado.'});

  }


  // PosPrinter.print(dataE, {preview: false,   margin: '0 0 0 0', printerName: 'Epson Printer',
  //   pageSize: '76mm', silent: true, timeOutPerLine: 400,
  //
  // })
  //     .then(() => {console.log("Impresion completa");
  //       event.reply('formulario:respuesta', { mensaje: 'Datos recibidos correctamente.' });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
});


app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});