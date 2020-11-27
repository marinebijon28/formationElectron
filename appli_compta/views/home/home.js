const { ipcRenderer } = require('electron');

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
function generateTableRow(idTable, tabledata) {
    // Retrieve the correct table body
    tBodyELem = $(idTable);
    
    // Create the complete row
    tabledata.forEach(rowData => {
        const tr = ($('<tr class="table-light">'));
        tr.append('<th scope="row">' + rowData.id + '</td>');
        tr.append('<td>' + rowData.label + '</td>');
        tr.append('<td>' + rowData.value + '€</td>');
        tr.append('<td>\n' +
            '<button class="btn btn-outline-warning mr-2">Modifier</button>\n' +
            '<button class="btn btn-outline-danger mr-2">Supprimer</button>\n' +
            '</td>\n' + 
        '</tr>');

        // Append it to the table
        tBodyELem.append(tr);
    });
}

// Listener for store-data
ipcRenderer.on('store-data', (evnt, arg) => {
    
    // Add expenses data to the array
    generateTableRow('#expensesTbody', arg.expensesData);

    // Add recipes data to the array
    generateTableRow('#recipesTbody', arg.recipesData);

    // Update balance sheet div
    generateBalanceSheet(arg.balanceSheet);
});