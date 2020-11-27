const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    // Create window
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // load file html page
    win.loadFile('index.html');
    // listener's of event closed window 
    win.on('closed', () => {
        win = null;
    });
    return win;
}

// Create the window
app.whenReady().then(createWindow);

// listen newTitle recovered address of function sendered and send a new avant giveNewTitle
ipcMain.on('newTitle', (evt, arg) => {
    evt.sender.send('giveNewTitle', 'Nouveau titre');
});
