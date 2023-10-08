// Check for notification support and request permission
if ('Notification' in window) {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission denied.');
            }
        });
    }
}

// Get references to HTML elements
const billForm = document.getElementById('bill-form');
const billNameInput = document.getElementById('bill-name');
const dueDateInput = document.getElementById('due-date');
const amountInput = document.getElementById('amount');
const billList = document.getElementById('bill-list');

// Function to create a new bill element with a remove button
function createBillElement(billName, dueDate, amount, currencySymbol) {
    const li = document.createElement('li');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-button';

    removeButton.addEventListener('click', () => {
        removeBill(li, billName, dueDate, amount, currencySymbol);
    });

    li.innerHTML = `
        <strong>${billName}</strong> - Due on: ${dueDate.toDateString()} - Amount: ${currencySymbol}${amount}
    `;

    li.appendChild(removeButton);

    return li;
}

// Function to create a notification
function createNotification(billName, dueDate) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (
            dueDate.getFullYear() === today.getFullYear() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getDate() === today.getDate()
        ) {
            const options = {
                body: `The due date for ${billName} is today!`,
                icon: 'icon.png', // Replace with the URL of your notification icon
            };
            const notification = new Notification('Bill Reminder', options);
        }
    }
}

// Function to add a bill
function addBill(e) {
    e.preventDefault();

    const billName = billNameInput.value;
    const dueDate = new Date(dueDateInput.value);
    const amount = amountInput.value;
    const currencySymbol = '₨'; // PKR currency symbol

    if (billName === '' || isNaN(dueDate) || amount === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Create a new bill element
    const billElement = createBillElement(billName, dueDate, amount, currencySymbol);

    // Append the bill element to the bill list
    billList.appendChild(billElement);

    // Check if the due date is today and send a notification
    createNotification(billName, dueDate);

    // Clear input fields
    billNameInput.value = '';
    dueDateInput.value = '';
    amountInput.value = '';

    // Store the added bill in local storage
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    bills.push({ billName, dueDate, amount, currencySymbol });
    localStorage.setItem('bills', JSON.stringify(bills));
}

// Function to remove a bill
function removeBill(li, billName, dueDate, amount, currencySymbol) {
    // Remove the bill element from the bill list
    billList.removeChild(li);

    // Remove the bill from local storage
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    const billToRemove = { billName, dueDate, amount, currencySymbol };
    const updatedBills = bills.filter(
        (bill) => JSON.stringify(bill) !== JSON.stringify(billToRemove)
    );
    localStorage.setItem('bills', JSON.stringify(updatedBills));
}

// Function to load bills from local storage
function loadBills() {
    const bills = JSON.parse(localStorage.getItem('bills')) || [];

    bills.forEach((bill) => {
        const billElement = createBillElement(
            bill.billName,
            new Date(bill.dueDate),
            bill.amount,
            bill.currencySymbol
        );
        billList.appendChild(billElement);
    });
}

// Load existing bills when the page loads
loadBills();

// Add bill submit event listener
billForm.addEventListener('submit', addBill);
