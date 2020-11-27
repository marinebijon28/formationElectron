const { app, BrowserWindow } = require('electron');

let expenses = [
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
        id: 1,
        label: "Achat filtre huile",
        value: 20
    }
];

let recipes = [
    {
        id: 1,
        label: "Vidange voiture",
        value: 150
    }
];
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

    // Only the first time the win is loaded we send data
    win.webContents.once('did-finish-load', () => {
        console.log(generateBalanceSheet(recipes, expenses));
        win.send('store-data', {
            expensesData : expenses,
            recipesData : recipes,
            balanceSheet: generateBalanceSheet(recipes, expenses)
        });
    });

    // listener's of event closed window 
    win.on('closed', () => {
        win = null;
    })
}

// Create the window
app.whenReady().then(createWindow);