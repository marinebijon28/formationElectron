const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

// Function for update the balance sheet
function generateBalanceSheet(newBalanceSheet) {
    balaneceSheetElem = $('#balanceSheet');
    
    // add the bilan of recipes and expenses
    balaneceSheetElem.text(newBalanceSheet + '€');

    // If balance sheet is superior to 0 then green background else red background
    if (newBalanceSheet < 0)
        balaneceSheetElem.addClass("bg-danger");
    else
        balaneceSheetElem.addClass("bg-success");
}

// Function for generate the table row
function generateTableRow(idTable, tabledata, typeItem) {
    // Retrieve the correct table body
    tBodyELem = $(idTable);
    
    // Create the complete row
    tabledata.forEach(rowData => {
        const tr = ($('<tr id="row' + typeItem + '_' + rowData.id + '" class="table-light">'));
        tr.append('<th scope="row">' + rowData.id + '</td>');
        tr.append('<td>' + rowData.label + '</td>');
        tr.append('<td>' + rowData.value + '€</td>');
        tr.append('<td>\n' +
            '<button id="modify' + typeItem + '_' + rowData.id + '" class="btn btn-outline-warning mr-2">Modifier</button>\n' +
            '<button id="delete' + typeItem + '_' + rowData.id + '" class="btn btn-outline-danger mr-2">Supprimer</button>\n' +
            '</td>\n' + 
        '</tr>');

        // Append it to the table
        tBodyELem.append(tr);

        // Create the listener for the delete button
        const deleteBtn = $('#delete' + typeItem + '_' + rowData.id);
        deleteBtn.on("click", (evnt) => {
            evnt.preventDefault();

            // First show a dialog in order to be sure the user really want to delete the item
            dialog.showMessageBox({
                type: 'warning',
                buttons: ["Non", "Oui"],
                title: 'Confirmation',
                message: "Êtes-vous sûr de vouloir supprimer de cet élément ?"
            }).then(res => {

                // Send the id and the target of the item for delete it
                if (res.response == 1)
                    ipcRenderer.send('delete-item', {
                        id: rowData.id,
                        typeItem: typeItem
                    })
            }).catch(err => {
                console.log(err);
            })
        });
    });
}

// Listener for store-data
ipcRenderer.on('store-data', (evt, arg) => {
    
    // Add expenses data to the array
    generateTableRow('#expensesTbody', arg.expensesData, 'Expense');

    // Add recipes data to the array
    generateTableRow('#recipesTbody', arg.recipesData, 'Recipe');

    // Update balance sheet div
    generateBalanceSheet(arg.balanceSheet);
});

// Listener on the click of add recipe and expense
const openWindowAddItem = (evt) => {

    // Send a request to the main process for open a new window
    ipcRenderer.send('open-new-item-window', evt.target.id);
}

$('#addExpense').on('click', openWindowAddItem);

$('#addRecipe').on('click', openWindowAddItem);

// Listener for update-with-new-item channel
ipcRenderer.on('update-with-new-item', (evnt, arg) => {
    let tableId = '#expensesTbody';
    let typeItem = 'Expense';
    if (arg.targetId === 'addRecipe'){
        tableId = '#recipesTbody';
        typeItem = 'Recipe';
    }

    // Add the new item
    generateTableRow(tableId, arg.newItem, typeItem);

    // Update balance sheet div
    generateBalanceSheet(arg.balanceSheet);
});

// Listener for update-delete-item channel
ipcRenderer.on('update-delete-item', (evnt, arg) => {

    // Delete the row item from the view
    $('#row' + arg.typeItem + '_' + arg.id).remove();

    // Update balance sheet div
    generateBalanceSheet(arg.balanceSheet);
});