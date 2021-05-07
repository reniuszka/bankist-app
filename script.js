'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Renata Diurczak',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-02-01T10:17:24.185Z',
    '2021-03-08T14:11:59.604Z',
    '2021-04-26T17:01:17.194Z',
    '2021-04-28T23:36:17.929Z',
    '2021-05-06T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Renata Diurczak',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-03-10T14:43:26.374Z',
    '2021-03-25T18:49:59.371Z',
    '2021-05-06T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

// date function

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    // is given in miliseconds so need to covert it by dividing it into (1000 * 60 * 60 * 24)
    // miliseconds*secinds*minutes*hours
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  // between right now and date that we received
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 14) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
//creating a function to show all amounts for the user on the web, when we want to sort the movements then sort needs to be true
const displayMovements = function (acc, sort = false) {
  // to clean-empty what its inserted from html file
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    // const now = new Date();
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();

    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;
    // position where this const html is attached, afterbegin the parent element, second argument is the string containing the html that we want to insert
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

///displaying total of movements - calling it with an entire account object(acc.movements)
const calcDisplayBalance = function (acc) {
  //acc below is accumulator, mov - one element of movements
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
// calcDisplayBalance(account1.movements);
//dislaying total income, outcome, interest at level 1.2%
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumOut.textContent = `${Math.abs(outs).toFixed(2)}€`;
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)}`;
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// user login : js, rd..
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
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  // want to present it as string on the web
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    // to see the rest of the time left from minutes
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
//EVENT HANDLERS

let currentAccount, timer;
// FAKE ALWAYS LOGGED IN

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
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

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      // month:'long' - ex August
      // month:'2-digit' - ex 08
      year: 'numeric',
      // weekday: 'long',
    };

    //to check someones language set on the comp:
    // const locale = navigator.language;
    // console.log(locale);

    //internalization -iso language code table - lingos.net
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // create current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //clearing the input fields to be not visible after login. = works from right to left <--:
    inputLoginUsername.value = inputLoginPin.value = '';
    // to get rid of blinking and focus in the input
    inputLoginPin.blur();

    // Timer - check if it runs in the other logged account
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //display movement, balance and summary of account
    updateUI(currentAccount);
  }
});

//SENDING TRANSFER - defining amount, time and finding a receiver
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

    //add tranfer data
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //update UI -display movement, balance and summary of account
    updateUI(currentAccount);

    // Reset timer when we make the loan and tranfer - dont want to be logged out in the middle
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// GETTING LOAN
//to get loan, we need at least one element that is at least 10% in our deposit of the requested amount, so if i have 3000 i can request 30000
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  // console.log(amount);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= mov * 0.1)) {
    // simulating the approval of our loan 2.5s
    setTimeout(function () {
      //add movement
      currentAccount.movements.push(amount);

      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
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
  displayMovements(currentAccount, !sorted);
  // to make it back to false
  sorted = !sorted;
});
