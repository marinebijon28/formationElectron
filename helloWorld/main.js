const { app, BrowserWindow } = require('electron');

function createWindow() {
    // Create window
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true
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

app.whenReady().then(createWindow);
