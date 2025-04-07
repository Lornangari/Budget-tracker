// Selecting elements 
const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const list = document.getElementById('transaction-list');
const incomeEl = document.getElementById('total-income');
const expensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('total-balance');
const filterButtons = document.querySelectorAll('.filter-btn');

// Load saved transactions from cookies
let transactions = getTransactionsFromCookie();

// Add Transaction
form.addEventListener('submit', (e) => {
  e.preventDefault(); //stops form from refershing the page
  const desc = descInput.value.trim(); //get text input
  const amount = parseFloat(amountInput.value); // get the amount and converts it to a number

  if (!desc || isNaN(amount)) return; //stop if invalid

  const transaction = {
    id: Date.now(),
    desc,
    amount,
  };

  transactions.push(transaction); //add to the array
  saveTransactionsToCookie(transactions); //save updated lists
  renderTransactions(); 
  form.reset(); //clear input field
});

// Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  saveTransactionsToCookie(transactions);
  renderTransactions();
}

// Filter Buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    renderTransactions(filter);
  });
});

// Render Transactions
function renderTransactions(filter = 'all') {
  list.innerHTML = ''; //clears the list
  let income = 0;
  let expenses = 0;

  transactions
    .filter(tx => {
      if (filter === 'income') return tx.amount > 0;
      if (filter === 'expense') return tx.amount < 0;
      return true;
    })

    //create list item
    .forEach(tx => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center py-2';
      li.innerHTML = `
        <span class="${tx.amount > 0 ? 'text-green-600' : 'text-red-600'} font-medium">${tx.desc}</span>
        <div class="flex items-center space-x-2">
          <span class="font-semibold">${tx.amount > 0 ? '+' : ''}${tx.amount}</span>
          <button onclick="deleteTransaction(${tx.id})" class="text-red-400 hover:text-red-600">&times;</button>
        </div>
      `;

      list.appendChild(li);
     //calculates the total amount
      if (tx.amount > 0) income += tx.amount;
      else expenses += tx.amount;
    });

  incomeEl.textContent = income.toFixed(2);
  expensesEl.textContent = Math.abs(expenses).toFixed(2);
  balanceEl.textContent = (income + expenses).toFixed(2);
}

// Cookies: Save & Load
function saveTransactionsToCookie(data) {
  const encoded = encodeURIComponent(JSON.stringify(data));
  document.cookie = `transactions=${encoded};path=/;max-age=31536000`; 
}
//load from cookies
function getTransactionsFromCookie() {
  const match = document.cookie.match(/(?:^|;) ?transactions=([^;]*)(;|$)/);
  return match ? JSON.parse(decodeURIComponent(match[1])) : [];
}

// Initial render
renderTransactions();
