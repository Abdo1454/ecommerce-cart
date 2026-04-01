let data1 = [];
let productsData = [];

// حفظ الكارت في LocalStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(data1));
}

// تحميل الكارت من LocalStorage
function loadCart() {
  let saved = localStorage.getItem("cart");
  if (saved) {
    data1 = JSON.parse(saved);
    Cart();
  }
}

// إضافة منتج للكارت
function addToCart(item) {
  let existing = data1.find(p => p.name === item.name);

  if (existing) {
    existing.quantity++;
  } else {
    let newItem = { ...item, quantity: 1 };
    data1.push(newItem);
  }

  saveCart();
  Cart();
}
let showStartBtn = false;
// إزالة أو تقليل كمية منتج
function decreaseFromCart(item) {
  let existing = data1.find(p => p.name === item.name);
  if (!existing) return;

  existing.quantity--;
  if (existing.quantity === 0) {
    data1 = data1.filter(p => p.name !== item.name);
  }

  saveCart();
  Cart();
}
function removeFromCartByName(name) {
  data1 = data1.filter(p => p.name !== name);
  saveCart();
  Cart();
}
function confirmOrder() {
  if (data1.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let modal = document.getElementById("orderModal");
  let itemsContainer = document.getElementById("orderItems");
  let totalContainer = document.getElementById("orderTotal");

  let total = 0;

  let html = data1.map(item => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div>
        ${item.name} (${item.quantity}) - ${itemTotal}$
      </div>
    `;
  }).join("");

  itemsContainer.innerHTML = html;
  totalContainer.innerText = "Total: " + total + "$";

  modal.classList.remove("hidden");

  showStartBtn = true; // يظهر زرار Start فقط
}
function getImage(item) {
  let width = window.innerWidth;

  if (width <= 600) return item.image.mobile;
  // else if (width <= 700) return item.image.tablet;
  else return item.image.desktop;
}
// function confirmOrder() {
//   if (data1.length === 0) return;

//   alert("Order confirmed!");

//   showStartBtn = true; // 👈 يظهر زرار Start
//   data1 = [];
//   saveCart();
//   Cart();
// }
function startNewOrder() {
  showStartBtn = false; // 👈 يخفي الزرار تاني
  data1 = [];
  saveCart();
  Cart();
  let modal = document.getElementById("orderModal");
 modal.classList.add("hidden"); // يختفي

}
// عرض المنتجات
function product() {
  fetch("../data.json")
    .then(response => response.json())
    .then(data => {
      productsData = data; // حفظ الداتا لسهولة الوصول
      let container = document.getElementById("product");

      container.innerHTML = data.map((item, index) => `
        <div class="card">
          <img src="${item.image.desktop}" alt="${item.name}" />
          <div class="button">
            <button onclick="decreaseFromCart(productsData[${index}])">-</button>
            <button class="add-btn" onclick="addToCart(productsData[${index}])">
              <i class="fa-solid fa-cart-shopping"></i> Add to cart
            </button>
            <button onclick="addToCart(productsData[${index}])">+</button>
          </div>
          <h3>${item.category}</h3>
          <h3>${item.name}</h3>
          <h3>${item.price}$</h3>
        </div>
      `).join("");
    })
    .catch(error => console.error("Error fetching data:", error));
}

// عرض الكارت
function Cart() {
  let container1 = document.getElementById("yourCart");
  let total = 0;
    if (data1.length === 0) {
    let html = `
      <div class="empty-cart">
        <img src="../assets/images/illustration-empty-cart.svg"/>
      </div>
    `;

    // 👇 يظهر زرار Start بعد التأكيد
    if (showStartBtn) {
      html += `<button onclick="startNewOrder()" class="new-order">Start New Order</button>`;
    }

    container1.innerHTML = html;
    return;
  }
  let html1 = data1.map(item => {
    total += item.price * item.quantity;
    return `
      <div class="small-cart">
        <h3>${item.name}</h3>
        <div class="small-cart-content">
       ${item.quantity}&times;  ${item.price}         ${item.price * item.quantity}$     
        <button onclick="removeFromCartByName('${item.name}')" class="remove">&times;</button>
        </div>
      </div>
    `;
  }).join("");

  html1 += `<h2>Total: ${total}$</h2>
  <button onclick="confirmOrder()" class="confirm">Confirm Order</button>
  
  `;
  container1.innerHTML = html1;
}

// بدء المشروع
loadCart();
product();