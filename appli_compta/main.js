const { app, BrowserWindow } = require('electron');

function createWindow() {
    // Create window
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration : true
        }
    })
    // load file html page
    win.loadFile('views/home/home.html');

    // listener's of event closed window 
    win.on('closed', () => {
        win = null;
    })
}

// Create the window
app.whenReady().then(createWindow);