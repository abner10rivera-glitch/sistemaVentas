// URL del backend DTE.
// PC: http://localhost:3000/api/dte
// Android: cambia DTE_API_URL por la IP/URL donde esté ejecutándose el backend.
const DEFAULT_DTE_API = 'http://localhost:3000/api/dte';
const DTE_API = localStorage.getItem('DTE_API_URL') || DEFAULT_DTE_API;

async function prepararDteConsumidorFinal(venta) {
  const r = await fetch(`${DTE_API}/consumidor-final`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(venta)
  });
  return r.json();
}

window.prepararDteConsumidorFinal = prepararDteConsumidorFinal;
window.setDteApiUrl = function(url) {
  localStorage.setItem('DTE_API_URL', url.replace(/\/$/, ''));
  location.reload();
};
