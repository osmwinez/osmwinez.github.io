// Mobile menu toggle
const mobileBtn = document.getElementById('mobileBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileBtn?.addEventListener('click', ()=>{
  mobileMenu.classList.toggle('hidden');
});

// Simple slideshow data
const slides = [
  {
    img: './src/photo-1511919884226-fd3cad34687c.avif',
    title: 'Perbaikan Body & Cat',
    subtitle: 'Restorasi cepat, hasil halus dan tahan lama'
  },
  {
    img: './src/WhatsApp Image 2023-10-10 at 12.23.45 PM.jpg',
    title: 'Ganti Oli & Filter',
    subtitle: 'Oli berkualitas, service cepat'
  }
];

let current = 0;
const slideImg = document.getElementById('slideImg');
const slideTitle = document.getElementById('slideTitle');
const slideSubtitle = document.getElementById('slideSubtitle');
const indicators = document.querySelectorAll('[data-index]');

function showSlide(i){
  current = (i + slides.length) % slides.length;
  slideImg.style.opacity = 0;
  setTimeout(()=>{
    slideImg.src = slides[current].img;
    slideTitle.textContent = slides[current].title;
    slideSubtitle.textContent = slides[current].subtitle;
    slideImg.style.opacity = 1;
    indicators.forEach(btn=>btn.classList.remove('bg-amber-500'));
    indicators[current].classList.add('bg-amber-500');
  },300);
}

document.getElementById('prevBtn')?.addEventListener('click', ()=> showSlide(current-1));
document.getElementById('nextBtn')?.addEventListener('click', ()=> showSlide(current+1));
indicators.forEach(btn=> btn.addEventListener('click', ()=> showSlide(Number(btn.dataset.index))));

// autoplay
setInterval(()=> showSlide(current+1), 4500);

// Cart functionality
const CART_KEY = 'bengkel_cart_v1';

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

function addToCart(item){
  const cart = loadCart();
  const existing = cart.find(i=>i.id === item.id);
  
  if(existing){
    existing.qty += item.qty || 1;
  } else {
    cart.push({...item, qty: item.qty || 1});
  }
  
  saveCart(cart);
  alert(`${item.name} ditambahkan ke keranjang!`);
  // Optional: redirect to cart
  // window.location.href = './cart.html';
}

// Attach handlers to "Pesan Sekarang" buttons
document.addEventListener('DOMContentLoaded', ()=>{
  // Quick services section buttons
  const serviceButtons = document.querySelectorAll('#services .inline-flex');
  
  // Pricing section "Pesan Sekarang" buttons
  const pricingButtons = document.querySelectorAll('#parts .inline-flex');
  
  // Map buttons to items
  const serviceItems = [
    {id:'svc-tuneup', name:'Tune-Up & Diagnostik', desc:'Engine check, ECU scan, perbaikan ringan', price:150000},
    {id:'svc-body', name:'Body & Cat', desc:'Perbaikan body, penggantian panel, cat', price:800000},
    {id:'svc-oli', name:'Ganti Oli & Filter', desc:'Oli berkualitas, service cepat', price:120000}
  ];
  
  const pricingItems = [
    {id:'pkg-tuneup', name:'Tune-Up Standard', desc:'Diagnostik ECU + Ganti busi (jika perlu)', price:350000},
    {id:'pkg-oli', name:'Ganti Oli & Filter', desc:'Oli mineral/semi + Filter oli resmi', price:120000},
    {id:'pkg-body', name:'Perbaikan Body', desc:'Estimasi setelah cek + Garansi kerja 30 hari', price:800000}
  ];
  
  serviceButtons.forEach((btn, idx)=>{
    if(idx < serviceItems.length){
      btn.addEventListener('click', ()=>{
        addToCart(serviceItems[idx]);
      });
    }
  });
  
  pricingButtons.forEach((btn, idx)=>{
    if(idx < pricingItems.length){
      btn.addEventListener('click', ()=>{
        addToCart(pricingItems[idx]);
      });
    }
  });
});

// simple booking submit -> whatsapp link (demo)
document.getElementById('booking')?.addEventListener('submit', function(e){
  e.preventDefault();
  const form = e.target;
  const service = form.querySelector('select').value || 'Service';
  const name = form.querySelectorAll('input')[0].value || 'Nama';
  const phone = form.querySelectorAll('input')[1].value || '';
  const date = form.querySelector('input[type=date]').value || '';
  const message = encodeURIComponent(`Booking ${service} - ${name} - ${phone} - ${date}`);
  // Replace number below with workshop WA number
  window.open(`https://wa.me/6287809628296?text=${message}`, '_blank');
});
