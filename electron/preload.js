const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld('api', {
  enviarDatosFormulario: (datos) => {
    ipcRenderer.send('formulario:enviar', datos);
  },
  recibirRespuesta: (callback) => {
    ipcRenderer.on('formulario:respuesta', (event, data) => {
      callback(data.mensaje);
    });
  },
});