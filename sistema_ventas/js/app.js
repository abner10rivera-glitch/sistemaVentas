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
        items: cart.map(item => ({...item }))
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

    let todayTotal = 0,
        weekTotal = 0,
        monthTotal = 0,
        todayCount = 0;

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
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
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

function imprimirCompra() {

    if (carrito.length === 0) {
        alert("No hay productos en la compra.");
        return;
    }

    let subtotal = 0;

    let productosHTML = "";

    carrito.forEach(producto => {

        let totalProducto = producto.precio * producto.cantidad;
        subtotal += totalProducto;

        productosHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>$${totalProducto.toFixed(2)}</td>
            </tr>
        `;
    });

    let iva = subtotal * 0.13;
    let total = subtotal + iva;

    let ventana = window.open("", "_blank", "width=800,height=700");

    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Comprobante de compra</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    color: #000;
                }

                .factura {
                    max-width: 750px;
                    margin: auto;
                }

                .encabezado {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .encabezado h1 {
                    margin-bottom: 5px;
                }

                .datos {
                    margin-bottom: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                }

                th {
                    background: #eee;
                }

                .totales {
                    width: 300px;
                    margin-left: auto;
                    margin-top: 20px;
                }

                .totales div {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px;
                }

                .total {
                    font-size: 20px;
                    font-weight: bold;
                    border-top: 2px solid #000;
                }

                .gracias {
                    text-align: center;
                    margin-top: 40px;
                }

                @media print {
                    body {
                        margin: 10px;
                    }
                }

            </style>
        </head>

        <body>

            <div class="factura">

                <div class="encabezado">
                    <h1>MI SISTEMA DE VENTAS</h1>
                    <p>Comprobante de compra</p>
                    <p>${new Date().toLocaleString()}</p>
                </div>

                <div class="datos">
                    <strong>Cliente:</strong> Consumidor final
                    <br>
                    <strong>Fecha:</strong> ${new Date().toLocaleDateString()}
                </div>

                <table>

                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${productosHTML}
                    </tbody>

                </table>

                <div class="totales">

                    <div>
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>

                    <div>
                        <span>IVA (13%):</span>
                        <span>$${iva.toFixed(2)}</span>
                    </div>

                    <div class="total">
                        <span>TOTAL:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>

                </div>

                <div class="gracias">
                    <p>¡Gracias por su compra!</p>
                    <p>Conserve este comprobante.</p>
                </div>

            </div>

            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>

        </body>
        </html>
    `);

    ventana.document.close();
}