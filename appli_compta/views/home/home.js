const { ipcRenderer } = require('electron');
const { dialog, Menu, MenuItem, getCurrentWindow } = require('electron').remote;

// Function for update the balance sheet
function generateBalanceSheet(newBalanceSheet) {
    balanceSheetElem = $('#balanceSheet');

   // Remove the classes added before
   balanceSheetElem.removeClass('bg-success bg-danger');
  
    // add the bilan of recipes and expenses
    balanceSheetElem.text(newBalanceSheet + '€');

    // If balance sheet is superior to 0 then green background else red background
    if (newBalanceSheet < 0)
        balanceSheetElem.addClass("bg-danger");
    else
        balanceSheetElem.addClass("bg-success");
}

// Function for generate the table row
function generateTableRow(idTable, tabledata, typeItem) {
    // Retrieve the correct table body
    tBodyELem = $(idTable);
    
    
    tabledata.forEach(rowData => {

        // Create the complete row
        const tr = ($('<tr id="row' + typeItem + '_' + rowData.id + '" class="table-light">'));
        tr.append('<th scope="row">' + rowData.id + '</td>');
        tr.append('<td id="label' + typeItem + '_' + rowData.id + '">' + rowData.label + '</td>');
        tr.append('<td id="value' + typeItem + '_' + rowData.id + '">' + rowData.value + '€</td>');
        tr.append('<td id="cell' + typeItem + '_' + rowData.id + '" style="display:none">\n' +
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

        // Create the listener for the modify button
        const modifyBtn = $('#modify' + typeItem + '_' + rowData.id);
        modifyBtn.on("click", (evnt) => {
            evnt.preventDefault();

            // Send all the data for create the view with them
            ipcRenderer.send("open-update-item-window", {
                item: rowData,
                typeItem: typeItem
            });
        });
    });
}

// Listener for updated-item channel
ipcRenderer.on('updated-item', (evnt, arg) => {

    // Update the row item from the view
    $('#label' + arg.typeItem + '_' + arg.item.id).text(arg.item.label);
    $('#value' + arg.typeItem + '_' + arg.item.id).text(arg.item.value + ' €');

    // Update balance sheet div
    generateBalanceSheet(arg.balanceSheet);
})

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

    expenseActionsElem = $('#expenseActions');
    recipeActionsElem = $('#recipeActions');
    expenseCellActionsElems = $('[id^=cellExpense_]');
    recipeCellActionsElems = $('[id^=cellRecipe_]');

    // The new item style is hide 
    if (expenseActionsElem.is(':visible') && recipeActionsElem.is(':visible'))
    {
        expenseActionsElem.show();
        recipeActionsElem.show();
        expenseCellActionsElems.show();
        recipeCellActionsElems.show();
    }
    else
    {
        expenseActionsElem.hide();
        recipeActionsElem.hide();
        expenseCellActionsElems.hide();
        recipeCellActionsElems.hide();
    }
});

// Listener for update-delete-item channel
ipcRenderer.on('update-delete-item', (evnt, arg) => {

    // Delete the row item from the view
    $('#row' + arg.typeItem + '_' + arg.id).remove();

    // Update balance sheet div
    generateBalanceSheet(arg.balanceSheet);
});

// Function for toggle edition mode
function toggleEditionMode() {
    expenseActionsElem = $('#expenseActions');
    recipeActionsElem = $('#recipeActions');
    expenseCellActionsElems = $('[id^=cellExpense_]');
    recipeCellActionsElems = $('[id^=cellRecipe_]');

    // Just show or hide the column action on the two tables
    if (!expenseActionsElem.is(':visible') && !recipeActionsElem.is(':visible'))
    {
        expenseActionsElem.show();
        recipeActionsElem.show();
        expenseCellActionsElems.show();
        recipeCellActionsElems.show();
    }
    else
    {
        expenseActionsElem.hide();
        recipeActionsElem.hide();
        expenseCellActionsElems.hide();
        recipeCellActionsElems.hide();
    }
}

// Listener for toggle-edition-mode channel
ipcRenderer.on('toggle-edition-mode', (evnt, arg) => {
    toggleEditionMode();
});

// Wait for the dom to be ready
$(() => {

    // Create the context menu
    const menu = new Menu();

    menu.append(new MenuItem(
        {
            label: "Nouvelle Dépense",
            click() 
            {
                openWindowAddItem(
                {
                    target: 
                    {
                        id: "addExpense"
                    }
                })
            }
        }
    ));
    menu.append(new MenuItem(
        {
            label: "Nouvelle Recette",
            click() 
            {
                openWindowAddItem(
                {
                    target: 
                    {
                        id: "addRecipe"
                    }
                })
            }
        }
    ));
    menu.append(new MenuItem(
        {
            label: "Activer / désactiver du mode édition",
            click() 
            {
                toggleEditionMode();
            }
        }
    ));

    // Add event listener for show the new menu when user make a right click
    $(document).on('contextmenu', (evnt) => {
        evnt.preventDefault();

        menu.popup({window: getCurrentWindow()});
    })
});