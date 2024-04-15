// Configuraciones de Electro
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

const isDev = process.env.IS_DEV == "true" ? true : false;


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

const options = {
  preview: false,
  margin: '0 0 0 0',
  copies: 1,
  printerName: 'XP-80C',
  timeOutPerLine: 400,
  pageSize: '80mm' // page size
}

const dataE = [
  {
      type: 'image',
      url: 'https://randomuser.me/api/portraits/men/43.jpg',     // file path
      position: 'center',                                  // position of image: 'left' | 'center' | 'right'
      width: '160px',                                           // width of image in px; default: auto
      height: '60px',                                          // width of image in px; default: 50 or '50px'
  },{
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: 'SAMPLE HEADING',
      style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}
  },{
      type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: 'Secondary text',
      style: {textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red"}
  },{
      type: 'barCode',
      value: '023456789010',
      height: 40,                     // height of barcode, applicable only to bar and QR codes
      width: 2,                       // width of barcode, applicable only to bar and QR codes
      displayValue: true,             // Display value below barcode
      fontsize: 12,
  },{
      type: 'qrCode',
      value: 'https://github.com/Hubertformin/electron-pos-printer',
      height: 55,
      width: 55,
      style: { margin: '10 20px 20 20px' }
  },{
      type: 'table',
      // style the table
      style: {border: '1px solid #ddd'},
      // list of the columns to be rendered in the table header
      tableHeader: ['Animal', 'Age'],
      // multi dimensional array depicting the rows and columns of the table body
      tableBody: [
          ['Cat', 2],
          ['Dog', 4],
          ['Horse', 12],
          ['Pig', 4],
      ],
      // list of columns to be rendered in the table footer
      tableFooter: ['Animal', 'Age'],
      // custom style for the table header
      tableHeaderStyle: { backgroundColor: '#000', color: 'white'},
      // custom style for the table body
      tableBodyStyle: {'border': '0.5px solid #ddd'},
      // custom style for the table footer
      tableFooterStyle: {backgroundColor: '#000', color: 'white'},
  },{
      type: 'table',
      style: {border: '1px solid #ddd'},             // style the table
      // list of the columns to be rendered in the table header
      tableHeader: [{type: 'text', value: 'People'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
      // multi-dimensional array depicting the rows and columns of the table body
      tableBody: [
          [{type: 'text', value: 'Marcus'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/43.jpg'}],
          [{type: 'text', value: 'Boris'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/41.jpg'}],
          [{type: 'text', value: 'Andrew'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/23.jpg'}],
          [{type: 'text', value: 'Tyresse'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/53.jpg'}],
      ],
      // list of columns to be rendered in the table footer
      tableFooter: [{type: 'text', value: 'People'}, 'Image'],
      // custom style for the table header
      tableHeaderStyle: { backgroundColor: 'red', color: 'white'},
      // custom style for the table body
      tableBodyStyle: {'border': '0.5px solid #ddd'},
      // custom style for the table footer
      tableFooterStyle: {backgroundColor: '#000', color: 'white'},
  },
]

// Configuración de IPC
// Manejar mensajes IPC del proceso de renderizado (al frontend) 
ipcMain.on('formulario:enviar', (event, data) => {
  console.log('Datos recibidos desde el formulario:', data);
  // Aquí manejar el procesamiento los datos recibidos desde el formulario y realizar acciones en el backend

  // Luego, mandar una respuesta de vuelta al proceso de renderizado (al frontend) si es necesario 
 
  event.reply('formulario:respuesta', { mensaje: 'Datos recibidos correctamente.' });

  PosPrinter.print(dataE, options)
 .then(console.log)
 .catch((error) => {
    console.error(error);
  });


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