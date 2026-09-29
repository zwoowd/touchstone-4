// north star bakery js
// products page = pre-order list, contact page = form checks


// menu items + prices
const menuItems = [
  { name: "Scottish Plain Loaf", price: 2.40 },
  { name: "Sourdough", price: 4.50 },
  { name: "Wholemeal Loaf", price: 2.80 },
  { name: "Morning Rolls (bag of 6)", price: 1.80 },
  { name: "Signature Loaf (Fri and Sat only)", price: 4.20 },
  { name: "Cruffin", price: 3.20 },
  { name: "Butter Croissant", price: 1.80 },
  { name: "Scone", price: 1.50 },
  { name: "Shortbread (pack of 4)", price: 3.00 },
  { name: "Dozen Cookie Mix (firesale)", price: 14.00 }
];

// what the customer has added so far
let orderList = [];


// get saved list from localStorage
function loadOrder() {
  const savedList = localStorage.getItem("northStarOrder");
  if (savedList) {
    orderList = JSON.parse(savedList);
  }
}

// save list to localStorage
function saveOrder() {
  localStorage.setItem("northStarOrder", JSON.stringify(orderList));
}

function formatPrice(amount) {
  return "£" + amount.toFixed(2);
}


// PRODUCTS PAGE

// add button for each menu item
function showMenu() {
  const menuList = document.getElementById("menu-list");

  for (let i = 0; i < menuItems.length; i++) {
    const row = document.createElement("li");

    const itemText = document.createElement("span");
    itemText.textContent = menuItems[i].name + " - " + formatPrice(menuItems[i].price);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add";
    addButton.addEventListener("click", function () {
      addToOrder(i);
    });

    row.appendChild(itemText);
    row.appendChild(addButton);
    menuList.appendChild(row);
  }
}

// if it's already in the list just add 1
function addToOrder(menuIndex) {
  const menuItem = menuItems[menuIndex];

  for (let i = 0; i < orderList.length; i++) {
    if (orderList[i].name === menuItem.name) {
      orderList[i].quantity = orderList[i].quantity + 1;
      saveOrder();
      showOrder();
      return;
    }
  }

  orderList.push({ name: menuItem.name, price: menuItem.price, quantity: 1 });
  saveOrder();
  showOrder();
}

// take away 1, remove it if 0
function removeFromOrder(orderIndex) {
  orderList[orderIndex].quantity = orderList[orderIndex].quantity - 1;

  if (orderList[orderIndex].quantity === 0) {
    orderList.splice(orderIndex, 1);
  }

  saveOrder();
  showOrder();
}

function clearOrder() {
  orderList = [];
  saveOrder();
  showOrder();
}

function getOrderTotal() {
  let total = 0;
  for (let i = 0; i < orderList.length; i++) {
    total = total + orderList[i].price * orderList[i].quantity;
  }
  return total;
}

// update list + total on the page
function showOrder() {
  const listElement = document.getElementById("order-list");
  listElement.innerHTML = "";

  if (orderList.length === 0) {
    listElement.innerHTML = "<li>Your list is empty. Click \"Add\" on an item above.</li>";
  }

  for (let i = 0; i < orderList.length; i++) {
    const row = document.createElement("li");

    const itemText = document.createElement("span");
    itemText.textContent = orderList[i].quantity + " x " + orderList[i].name + " - " + formatPrice(orderList[i].price * orderList[i].quantity);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove one";
    removeButton.className = "button-secondary";
    removeButton.addEventListener("click", function () {
      removeFromOrder(i);
    });

    row.appendChild(itemText);
    row.appendChild(removeButton);
    listElement.appendChild(row);
  }

  document.getElementById("order-total").textContent = "Total: " + formatPrice(getOrderTotal());
}


// CONTACT PAGE

// put saved list in the item details box
function fillItemDetails() {
  if (orderList.length === 0) {
    return;
  }

  let text = "";
  for (let i = 0; i < orderList.length; i++) {
    text = text + orderList[i].quantity + " x " + orderList[i].name + "\n";
  }
  text = text + "Estimated total: " + formatPrice(getOrderTotal());

  document.getElementById("item-details").value = text;
  document.getElementById("request-type").value = "pre-order";
  document.getElementById("list-note").textContent = "We added the list you made on the Products page. You can still edit it.";
}

function showError(fieldId, message) {
  document.getElementById(fieldId + "-error").textContent = message;
  document.getElementById(fieldId).classList.add("input-error");
}

function clearError(fieldId) {
  document.getElementById(fieldId + "-error").textContent = "";
  document.getElementById(fieldId).classList.remove("input-error");
}

// returns "" if the date is ok
function checkPickupDate(dateText) {
  if (dateText === "") {
    return "Please choose a pickup date.";
  }

  // en-CA gives yyyy-mm-dd, same as the date input
  const todayText = new Date().toLocaleDateString("en-CA");

  if (dateText <= todayText) {
    return "Please choose a date after today.";
  }

  // 3 = wednesday (closed)
  const pickedDate = new Date(dateText);
  if (pickedDate.getUTCDay() === 3) {
    return "We're closed on Wednesdays. Please pick a different day.";
  }

  return "";
}

function validateForm(event) {
  // stop the form from sending
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const requestType = document.getElementById("request-type").value;
  const pickupDate = document.getElementById("pickup-date").value;
  const itemDetails = document.getElementById("item-details").value.trim();

  let formIsValid = true;
  document.getElementById("form-message").textContent = "";

  if (name.length < 2) {
    showError("name", "Please enter your name (at least 2 letters).");
    formIsValid = false;
  }

  if (email === "") {
    showError("email", "Please enter your email address.");
    formIsValid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    showError("email", "That email doesn't look right. It should look like name@example.com.");
    formIsValid = false;
  }

  if (requestType === "") {
    showError("request-type", "Please choose what kind of request this is.");
    formIsValid = false;
  }

  const dateError = checkPickupDate(pickupDate);
  if (dateError !== "") {
    showError("pickup-date", dateError);
    formIsValid = false;
  }

  if (itemDetails.length < 10) {
    showError("item-details", "Please tell us a bit more about what you'd like (at least 10 characters).");
    formIsValid = false;
  }

  if (formIsValid) {
    document.getElementById("form-message").textContent = "Thanks, " + name + "! We got your request and will email you at " + email + " to confirm.";
    document.getElementById("order-form").reset();
    document.getElementById("list-note").textContent = "";

    // clear the saved list after sending
    orderList = [];
    saveOrder();
  }
}

function setUpContactPage() {
  fillItemDetails();
  document.getElementById("order-form").addEventListener("submit", validateForm);

  // hide error when they start typing again
  const fieldIds = ["name", "email", "request-type", "pickup-date", "item-details"];
  for (let i = 0; i < fieldIds.length; i++) {
    document.getElementById(fieldIds[i]).addEventListener("input", function () {
      clearError(fieldIds[i]);
    });
  }
}


loadOrder();

// only run what the page needs
if (document.getElementById("order-builder")) {
  showMenu();
  showOrder();
  document.getElementById("clear-list").addEventListener("click", clearOrder);
}

if (document.getElementById("order-form")) {
  setUpContactPage();
}
