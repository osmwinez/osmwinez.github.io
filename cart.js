// Cart implementation using localStorage
const CART_KEY = 'bengkel_cart_v1';

function formatIDR(n){
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function calcTotals(cart){
  const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  // simple shipping rule: free if subtotal >= 500000
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 20000;
  return {subtotal, shipping, total: subtotal + shipping};
}

function renderCart(){
  const cart = loadCart();
  const list = document.getElementById('cartList');
  list.innerHTML = '';
  if(cart.length === 0){
    list.innerHTML = '<div class="empty">Keranjang kosong. Tambah layanan atau spareparts.</div>';
  }

  cart.forEach(item=>{
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.image||'./src/WhatsApp Image 2025-11-10 at 22.04.25_3c2561c5.jpg'}" alt="${item.name}" />
      <div class="item-body">
        <div class="item-title">${item.name}</div>
        <div class="item-meta">${item.desc || ''}</div>
        <div class="qty">
          <button class="dec">−</button>
          <input type="number" class="qty-input" min="1" value="${item.qty}" />
          <button class="inc">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div class="price">${formatIDR(item.price * item.qty)}</div>
        <div style="margin-top:8px"><button class="btn remove">Hapus</button></div>
      </div>
    `;

    // events
    el.querySelector('.inc').addEventListener('click', ()=>{
      updateQty(item.id, item.qty + 1);
    });
    el.querySelector('.dec').addEventListener('click', ()=>{
      updateQty(item.id, Math.max(1, item.qty - 1));
    });
    el.querySelector('.qty-input').addEventListener('change', (e)=>{
      const v = Number(e.target.value) || 1;
      updateQty(item.id, Math.max(1, v));
    });
    el.querySelector('.remove').addEventListener('click', ()=>{
      removeItem(item.id);
    });

    list.appendChild(el);
  });

  // totals
  const {subtotal, shipping, total} = calcTotals(cart);
  document.getElementById('subtotal').textContent = formatIDR(subtotal);
  document.getElementById('shipping').textContent = formatIDR(shipping);
  document.getElementById('total').textContent = formatIDR(total);
}

function updateQty(id, qty){
  const cart = loadCart();
  const idx = cart.findIndex(i=>i.id === id);
  if(idx === -1) return;
  cart[idx].qty = qty;
  saveCart(cart);
  renderCart();
}

function removeItem(id){
  let cart = loadCart();
  cart = cart.filter(i=>i.id !== id);
  saveCart(cart);
  renderCart();
}

function clearCart(){
  localStorage.removeItem(CART_KEY);
  renderCart();
}

function addSampleItems(){
  const cart = loadCart();
  const samples = [
    {id:'svc-tuneup', name:'Tune-Up & Diagnostik', desc:'Service mesin lengkap', price:350000, qty:1, image:''},
    {id:'svc-oli', name:'Ganti Oli & Filter', desc:'Oli premium + filter', price:120000, qty:1, image:''}
  ];
  // merge by id
  samples.forEach(s=>{
    const existing = cart.find(i=>i.id===s.id);
    if(existing) existing.qty += s.qty;
    else cart.push(s);
  });
  saveCart(cart);
  renderCart();
}

// checkout -> open WhatsApp with order summary
document.getElementById('checkoutForm')?.addEventListener('submit', function(e){
  e.preventDefault();
  const cart = loadCart();
  if(cart.length === 0){ alert('Keranjang kosong'); return; }
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const note = document.getElementById('note').value.trim();
  if(!name || !phone){ alert('Isi nama dan nomor HP terlebih dahulu'); return; }

  const {subtotal, shipping, total} = calcTotals(cart);
  let msg = `Pesanan dari ${name}%0A`;
  msg += `Nomor: ${phone}%0A%0A`;
  msg += `Rincian:%0A`;
  cart.forEach(i=>{
    msg += `- ${i.name} x${i.qty} = ${formatIDR(i.price * i.qty)}%0A`;
  });
  msg += `%0ASub: ${formatIDR(subtotal)}%0AOngkir: ${formatIDR(shipping)}%0ATotal: ${formatIDR(total)}%0A`;
  if(note) msg += `%0ACatatan: ${encodeURIComponent(note)}%0A`;

  // open WhatsApp (international format, assume user enters starting with country code like 62...)
  const phoneOnly = phone.replace(/[^0-9]/g,'');
  const waNumber = phoneOnly.startsWith('0') ? '62' + phoneOnly.slice(1) : phoneOnly; // user's number is their number; for shop replace with workshop number if needed
  // For demo, open with shop number; replace below number with workshop WA if desired
  const shopNumber = '6281234567890';
  const url = `https://wa.me/${shopNumber}?text=${msg}`;
  window.open(url, '_blank');
});

document.getElementById('clearBtn')?.addEventListener('click', ()=>{
  if(confirm('Kosongkan keranjang?')) clearCart();
});
document.getElementById('sampleBtn')?.addEventListener('click', addSampleItems);

// initialize
renderCart();
