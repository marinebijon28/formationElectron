const { ipcRenderer } = require('electron');

let item = null;
let typeItem = null;

// Add listener when the form for update the item is submit
$('#updateItem').on('submit', (evnt) => {
    evnt.preventDefault();

    // Serialize the data of the form
    const updateItem = $('#updateItem').serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});

    // Set the id to the new update object
    updateItem.id = item.id;

    // Then send it to the main process for some manipulation
    ipcRenderer.send('update-item', {
        item: updateItem,
        typeItem: typeItem
    });
});

ipcRenderer.on('item-data', (evnt, arg) => {
    item = arg.item;
    typeItem = arg.typeItem;

    // Fill the form with the current val
    $('#itemLabel').val(item.label);
    $('#itemValue').val(item.value);
});