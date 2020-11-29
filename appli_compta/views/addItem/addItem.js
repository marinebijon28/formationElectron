const { ipcRenderer } = require('electron');

// Add listener when the form for add a new item is submit
$('#addItem').on('submit', (evnt) => {
    evnt.preventDefault();

    // Serialize the data of the form
    const newItem = $('#addItem').serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});

     // Then send it to the main process for some manipulation
    ipcRenderer.send('add-new-item', newItem);

    // reset the window
    $('#addItem')[0].reset();
});