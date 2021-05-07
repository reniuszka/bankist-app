'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
//IMPORTANT: ALL OF THESE DIFFERENT REFENCES DO ACTUALLY POINT TO THE SAME OBJECTS IN THE MEMORY HEAP

//creating a function to show all amounts for the user on the web, when we want to sort the movements then sort needs to be true
const displayMovements = function (movements, sort = false) {
  // to clean-empty what its inserted from html file
  containerMovements.innerHTML = '';
  //creating a copy thanks to slice(). if sort is true srt it, if not use movemnts order. toFixed(2) to display all numbers with 2 decimals
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov.toFixed(2)}</div>
  </div>`;
    // position where this const html is attached, afterbegin the parent element, second argument is the string containing the html that we want to insert

    // the last element of the array 1300 will be on the top of the list, before end 1300 would be the last one
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

///displaying total of movements - calling it with an entire account object(acc.movements)
const calcDisplayBalance = function (acc) {
  //acc below is accumulator, mov - one element of movements
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};
// calcDisplayBalance(account1.movements);
//dislaying total income, outcome, interest at level 1.2%
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outs = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outs).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}`;
};

// calcDisplaySummary(account1.movements) - its a global variable but we dont want to write it like this, each function should reveive the data that it should work with as: const createUsernames = function (accs) { ;
//creating a func with a new line for accounts with initials, steven thomas willliam => stw . Dont want to use map method here as we dont want to create a new array. we just want to modify the object ( elemnts that already exist in the accoutns array), so we want to loop over the array and then do sth. so here we want to change/mutate the orriginal accounts array: const accounts = [account1, account2, account3, account4]; ForEach does side effect, without returning anything
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
// check that new properties were created under username :)
// console.log(accounts);

const updateUI = function (acc) {
  //display movement, balance and summary of account
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

//event handler
//define it before as we are gonna use it with many operations ex. transfer money
//prevent from submitting and reloading the page so eed to add e as event parameter and  on event call a method from proventing default reloadint
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // when we click btn type submit  or press enter - it automatically reloads the page so need to add event.preventDafault not to make it happen and add e as parameter
  e.preventDefault();
  // login the user in we need t find the account from the accounts array with the user name that the user inputted. To read a value of of the input field use: value
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // to check if the pin exsist thanks to ? and if pin is correct, need to convert the value from the input as a number as it is always a string. Also we want to show all balances and personalized hello msg to the logged in user
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and msg
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clearing the input fields to be not visible after login. = works from right to left <--:
    inputLoginUsername.value = inputLoginPin.value = '';
    // to get rid of blinking and focus in the input
    inputLoginPin.blur();
    //display movement, balance and summary of account
    updateUI(currentAccount);
  }
});

//sending transfer - defining amount and finding a receiver
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);
  // clearing input
  inputTransferAmount.value = inputTransferTo.value = '';

  //amount needs to be bigger than zero and the user's balance and cannot send it to himself
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update UI -display movement, balance and summary of account
    updateUI(currentAccount);
  }
});

//to get loan, we need at least one elementthat is at least 10% in our deposit of the requested amount, so if i have 3000 i can request 30000
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  // console.log(amount);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= mov * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
  //clear the input field
  inputLoanAmount.value = '';
});

//to delete account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    (inputCloseUsername.value =
      currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);
    //hide opacity
    containerApp.style.opacity = 0;
    //clear inputs
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

//to sort and unsort movements, sorted is false at the beggining - our state
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  //to make sorted true, sorted is false so !sorted is true
  displayMovements(currentAccount.movements, !sorted);
  // to make it back to false
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
