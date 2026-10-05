const INVENTORY_KEY = "ventas_inventario";
const SALES_KEY = "ventas_historial";

let inventory = JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];
let sales = JSON.parse(localStorage.getItem(SALES_KEY)) || [];
let cart = [];

const $ = id => document.getElementById(id);
const money = n => Number(n).toFixed(2);

function saveData() {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}

function renderInventory() {
  const body = $("inventoryBody");
  body.innerHTML = "";

  inventory.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(p.barcode)}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>$${money(p.price)}</td>
      <td>${p.stock}</td>
      <td><button class="remove" onclick="deleteProduct(${i})">Eliminar</button></td>
    `;
    body.appendChild(row);
  });
}

function renderCart() {
  const body = $("cartBody");
  body.innerHTML = "";

  cart.forEach((item, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>$${money(item.price)}</td>
      <td>${item.quantity}</td>
      <td>$${money(item.price * item.quantity)}</td>
      <td><button class="remove" onclick="removeFromCart(${i})">Quitar</button></td>
    `;
    body.appendChild(row);
  });

  updateTotal();
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $("cartTotal").textContent = money(total);

  const cash = Number($("cashReceived").value) || 0;
  $("change").textContent = money(Math.max(0, cash - total));
}

function addProduct() {
  const barcode = $("barcode").value.trim();
  const name = $("productName").value.trim();
  const price = Number($("price").value);
  const stock = Number($("stock").value);

  if (!barcode || !name || price < 0 || stock < 0 || !Number.isFinite(price) || !Number.isInteger(stock)) {
    alert("Completa correctamente todos los campos.");
    return;
  }

  const existing = inventory.find(p => p.barcode === barcode);
  if (existing) {
    existing.name = name;
    existing.price = price;
    existing.stock += stock;
  } else {
    inventory.push({ barcode, name, price, stock });
  }

  saveData();
  renderInventory();

  $("barcode").value = "";
  $("productName").value = "";
  $("price").value = "";
  $("stock").value = "";
  $("barcode").focus();

  alert("Producto guardado correctamente.");
}

function addToCart() {
  const barcode = $("saleBarcode").value.trim();
  const quantity = Number($("saleQuantity").value) || 1;
  const product = inventory.find(p => p.barcode === barcode);

  if (!product) {
    alert("Producto no encontrado en el inventario.");
    $("saleBarcode").select();
    return;
  }

  if (quantity < 1 || quantity > product.stock) {
    alert(`Stock insuficiente. Disponible: ${product.stock}`);
    return;
  }

  const existing = cart.find(i => i.barcode === barcode);
  if (existing) {
    if (existing.quantity + quantity > product.stock) {
      alert("La cantidad supera el stock disponible.");
      return;
    }
    existing.quantity += quantity;
  } else {
    cart.push({
      barcode: product.barcode,
      name: product.name,
      price: product.price,
      quantity
    });
  }

  renderCart();
  $("saleBarcode").value = "";
  $("saleQuantity").value = 1;
  $("saleBarcode").focus();
}

function completeSale() {
  if (!cart.length) {
    alert("No hay productos en la venta.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cash = Number($("cashReceived").value);

  if (!Number.isFinite(cash) || cash < total) {
    alert("El dinero recibido no es suficiente.");
    return;
  }

  cart.forEach(item => {
    const product = inventory.find(p => p.barcode === item.barcode);
    product.stock -= item.quantity;
  });

  sales.push({
    date: new Date().toISOString(),
    total,
    items: cart.map(item => ({ ...item }))
  });

  const change = cash - total;
  saveData();
  cart = [];
  $("cashReceived").value = "";
  renderCart();
  renderInventory();
  updateReports();

  alert(`Venta registrada. Cambio a entregar: $${money(change)}`);
  $("saleBarcode").focus();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function deleteProduct(index) {
  if (confirm("¿Eliminar este producto del inventario?")) {
    inventory.splice(index, 1);
    saveData();
    renderInventory();
  }
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function updateReports() {
  const now = new Date();
  const today = startOfDay(now);
  const week = startOfWeek(now);
  const month = new Date(now.getFullYear(), now.getMonth(), 1);

  let todayTotal = 0, weekTotal = 0, monthTotal = 0, todayCount = 0;

  sales.forEach(sale => {
    const d = new Date(sale.date);
    if (d >= today) {
      todayTotal += sale.total;
      todayCount++;
    }
    if (d >= week) weekTotal += sale.total;
    if (d >= month) monthTotal += sale.total;
  });

  $("todayTotal").textContent = money(todayTotal);
  $("weekTotal").textContent = money(weekTotal);
  $("monthTotal").textContent = money(monthTotal);
  $("todayCount").textContent = todayCount;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[char]));
}

$("saveProduct").addEventListener("click", addProduct);
$("addToCart").addEventListener("click", addToCart);
$("completeSale").addEventListener("click", completeSale);
$("cashReceived").addEventListener("input", updateTotal);

$("saleBarcode").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addToCart();
  }
});

$("barcode").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    $("productName").focus();
  }
});

$("clearSales").addEventListener("click", () => {
  if (confirm("¿Seguro que deseas borrar todo el historial de ventas?")) {
    sales = [];
    saveData();
    updateReports();
  }
});

renderInventory();
renderCart();
updateReports();
