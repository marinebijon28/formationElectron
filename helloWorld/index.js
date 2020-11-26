const { ipcRenderer } = require('electron');

// Send a event newTitle
$('#changeTitle').on('click', () => {
    ipcRenderer.send('newTitle', '');
});

// Listen giveNewTitle and replace with params sended
ipcRenderer.on('giveNewTitle', (evt, arg) => {
    $('h1').text(arg);
})