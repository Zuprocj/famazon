var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('cli-table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: "productsDB"
});

function displayAll(){
    connection.query('SELECT * FROM prodcuts', function(error, response) {
        if (error) throw error;
        var displayTable = new table({
            head: ['Item ID', 'Product Name', 'Department', 'Price', 'Stock'],
            colWidths: [10,30,18,10,14]
        });
        for (i=0; i < response.length; i++) {
            displayTable.push(
                [response[i].item_id, response.[i].prodcut_name, response[i].department_name,
                response[i].price, response[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());
        inquireUpdates();
    });
};
function inquireUpdates() {
    inquireUpdates.prompt([
        {
            name: 'action',
            type: 'list',
            message: 'Choose an option:',
            choices: ['Restock Inventory' , 'Add New Product', 'Remove an Existing Product']
    }]).then(function(answers) {
        switch (answers.action) {
            case 'Restock Inventory':
                restockRequest();
                break;
            case 'Add New Product':
                addRequest();
                break;
            case 'Remove an Existing Product':
                removeRequest();
                break;
        }
    });
};
function restockRequest() {
    inquirer.prompt([
        {
            name: 'ID',
            type: 'input',
            message: 'What is the item number of the item you wish to restock?'
        }, {
            name: 'Quantity',
            type: 'input',
            message: 'How many would you like to add?'
        },
    ]).then(function(answers) {
        var quantityAdded = answers.Quantity;
        var IDofProduct = answers.ID;
        restockDatabase(IDofProduct, quantityAdded);
    });
};
function restockDatabase (id, quantity) {
    connection.query ('SELECT * FROM prodcuts WHERE item_id = ' + id, function(error, response) {
        if (error) throw error;
        connection.query('UPDATE prodcuts SET stock_quantity = stock_quantity + ' quantity + ' WHERE item_id = ' + id);
        displayAll();
    });
};
function addRequest(){
    inquirer.prompt([
        {
            name: 'Name',
            type: 'input',
            message: 'What is the name of the item you want to restock?'
        }, {
            name: 'Category',
            type: 'input',
            message: 'What is the category for this prodcut?'
        }, {
            name: 'Price',
            type: 'input',
            message: 'How much would you like to sell the item for?'
        }, {
            name: 'Quantity',
            type: 'input',
            message: 'How many would you like to add?'
        },
    ]).then(function(answers){
        var name = answers.Name;
        var category = answers.Category;
        var price = answers.Price;
        var quantity = answers.Quantity;
        buildNewItem(name,category,price,quantity);
    });
};
function buildNewItem(name,category,price,quantity) {
    connection.query('INSERT INTO Products (product_name,department_name,price,stock_quantity) VALUES("' + name + '","' + category + '",' + price + ',' + quantity +  ')');
    displayAll();
};
function removeRequest(){
    inquirer.prompt([
        {
            name: 'ID',
            type: 'input',
            message: 'What is the item number of the item you wish to remove?'
        }
    ]).then(function(answer){
        var id = answer.ID;
        removeFromDatabase(id);
    });
};
function removeFromDatabase(id){
    connection.query('DELETE FROM prodcuts WHERE item_id = ' + id);
    displayAll();
};
displayAll();