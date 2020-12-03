const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const Store = require('electron-store');
const store = new Store();

let mainWindow = null;
let targetAddItemId = null;

// Load data from local BDD
let expenses = store.has('expenses') ? store.get('expenses') : [];
let recipes = store.has('recipes') ? store.get('recipes') : [];

// Function for generate the current balance sheet
function generateBalanceSheet(recipes, expenses) {
    const sumRecipes = recipes.reduce((a, b) => 
        a + (parseFloat(b.value) || 0), 0
        );
    const sumExpenses = expenses.reduce((a, b) => 
        a + (parseFloat(b.value) || 0), 0
    );
    return sumRecipes - sumExpenses;
}

function createWindow(pathFile, widthWindow = 1200, heightWindow = 800) {
    // Create window
    let win = new BrowserWindow({
        width: widthWindow,
        height: heightWindow,
        webPreferences: {
            nodeIntegration : true,
            enableRemoteModule: true
        }
    })
    // load file html page
    win.loadFile(pathFile);

    // listener's of event closed window 
    win.on('closed', () => {
        win = null;
    })

    return win;
}

// Create the window
app.whenReady().then(() => {
    mainWindow = createWindow('views/home/home.html');

    // Only the first time the win is loaded we send data
    mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.send('store-data', {
        expensesData : expenses,
        recipesData : recipes,
        balanceSheet: generateBalanceSheet(recipes, expenses)
        });
    });
});

// Listener for the open new item window channel
ipcMain.on('open-new-item-window', (evt, arg) => {

    // Create the new item window
    const win = createWindow('views/addItem/addItem.html', 500, 450);

    // Assign target id for after
    targetAddItemId = arg;

    // listener's of event closed window 
    win.on('closed', () => {
        targetAddItemId = null;
    });
})

// Listener for the add new item channel
ipcMain.on('add-new-item', (evnt, newItem) => {
    // Set the id of the new item
    let newId = 1;

      // Select the correct array with the targetId name
    let arrayForAdd = recipes;
    
    let storeKey = "recipes";
    if (targetAddItemId === 'addExpense'){
        arrayForAdd = expenses;
        storeKey = "expenses";
    }
    
    // Check the length of the array
    if (arrayForAdd.length > 0)
        newId = arrayForAdd[arrayForAdd.length - 1].id + 1;
    
    // Assign the id for the item
    newItem.id = newId;

    // Add the new item to the array
    arrayForAdd.push(newItem);

    // Push the complete new array to the BDD
    store.set(storeKey, arrayForAdd);

    // We have to use the main window ref, not the event sender that is the new window
    mainWindow.webContents.send('update-with-new-item', {
        newItem : [newItem],
        balanceSheet: generateBalanceSheet(recipes, expenses),
        targetId : targetAddItemId
    });
});

// Listener for the delete item channel
ipcMain.on('delete-item', (evnt, arg) => {

    // Select the correct array with the targetId name
    let arrayForDelete = recipes;

    let storeKey = "recipes";

    if (arg.typeItem === 'Expense'){
        arrayForDelete = expenses;
        storeKey = "expenses";
    }

     // Delete the item from the correct array
    arrayForDelete.splice(arg.id - 1, 1);
    // for (let i = 0; i < arrayForDelete.length; i++) {
    //     if (arrayForDelete[i].id == arg.id) {
    //         arrayForDelete.splice(i, 1);
    //         break;
    //     }
    // }

     // Push the complete new array to the BDD
    store.set(storeKey, arrayForDelete);

    // Generate the new balance sheet value
    arg.balanceSheet = generateBalanceSheet(recipes, expenses);

    // Send back a confirmation that the item is correctly deleted
    evnt.sender.send('update-delete-item', arg);
});

// Listener for the open update item window channel
ipcMain.on('open-update-item-window', (evnt, arg) => {

    // Create the update item window
    win = createWindow('views/updateItem/updateItem.html', 500, 450);

    // Only the first time the win is loaded we send data
    win.webContents.once('did-finish-load', () => {
        win.send('item-data', arg);
    });
});

// Listener for the update item channel
ipcMain.on('update-item', (evnt, arg) => {

    // Select the correct array with the targetId name
    let arrayForUpdate = recipes;

    let storeKey = "recipes";

    if (arg.typeItem === 'Expense') {
        arrayForUpdate = expenses;
        storeKey = "expenses";
    }

    // Retrieve and modify the item from the correct array
    arrayForUpdate[arg.item.id - 1].label = arg.item.label;
    arrayForUpdate[arg.item.id - 1].value = arg.item.value;
    // for (let i = 0; i < arrayForUpdate.length; i++) {
    //     if (arrayForUpdate[i].id === arg.item.id)
    //     {
    //         arrayForUpdate[i].label = arg.item.label;
    //         arrayForUpdate[i].value = arg.item.value;
    //         break;
    //     }
    // }

     // Push the complete new array to the BDD
    store.set(storeKey, arrayForUpdate);
    
    // Generate the new balance sheet value
    arg.balanceSheet = generateBalanceSheet(recipes, expenses);

    // Send a confirmation to the main window that the car is correctly updated
    mainWindow.webContents.send('updated-item', arg);
})

// menu electron modify
const templateMenu = [
    {
        label: 'action',
        submenu: [
            {
                label: "Nouvelle Depense",
                accelerator: "CommandOrControl+N",
                click()
                {
                    // Create the new item window
                    const win = createWindow('views/addItem/addItem.html', 500, 450);

                    // Assign target id for after
                    targetAddItemId = "addExpense";

                    win.on('closed', () => {
                        targetAddItemId = null;
                    });
                }
            },
            {
                label: "Nouvelle Recette",
                accelerator: "CommandOrControl+M",
                click()
                {
                    // Create the new item window
                    const win = createWindow('views/addItem/addItem.html', 500, 450);

                    // Assign target id for after
                    targetAddItemId = "addRecipe";

                    win.on('closed', () => {
                        targetAddItemId = null;
                    });
                }
            },
            {
                label: "Activer/desactiver Mode edition",
                accelerator: "CommandOrControl+E",
                click()
                {
                    mainWindow.webContents.send('toggle-edition-mode');
                }
            }
        ]
    },
    {
        label: "fenêtre",
        submenu: 
        [
            {role: 'reload'},
            {role: 'toggledevtools'},
            // separation of submenu == line white
            {role: 'separator'},
            {role: 'togglefullscreen'},
            {role: 'minimize'},
            // separation of submenu == line white
            {role: 'separator'},
            {role: 'close'}
        ]
    },
    {
        label: "Développement",
        submenu:
        [
            {
                label: "remplir la BDD",
                click() {
                    expenses = [
                        {
                            id: 1,
                            label: "Achat huile de moteur",
                            value: 80
                        },
                        {
                            id: 2,
                            label: "Achat joint de vidange",
                            value: 10
                        },
                        {
                            id: 3,
                            label: "Achat filtre huile",
                            value: 20
                        }
                    ];

                    recipes = [
                        {
                            id: 1,
                            label: "Vidange voiture",
                            value: 150
                        }
                    ];

                    store.set('expenses', expenses);
                    store.set('recipes', recipes);

                    mainWindow.send('store-data', {
                        expensesData : expenses,
                        recipesData : recipes,
                        balanceSheet: generateBalanceSheet(recipes, expenses)
                    });
                }
            },
            {
                label: "vider la BDD",
                click() {
                    // Clear the database
                    store.clear();
                }
            }
        ]
    }
];

if (process.platform == 'darwin') {
    templateMenu.unshift({
        label: "app.name",
        submenu: 
        [
            {role: 'quit'}
        ]
    });
}

const menu= Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);