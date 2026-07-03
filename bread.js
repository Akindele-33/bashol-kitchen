/* =========================================
   1. SWIPER INIT
========================================= */
new Swiper('.hero-swiper', { 
  loop: true,
  autoplay: { 
    delay: 7000, 
    disableOnInteraction: false 
  },
  pagination: { 
    el: '.swiper-pagination', 
    clickable: true 
  }
});

/* =========================================
   2. OPEN ORDER MODAL
========================================= */
document.querySelectorAll('.heroOrderBtn, #openOrder, #aboutOrder').forEach(btn => {
  btn.onclick = () => {
    document.getElementById('orderModal').style.display = 'block';
  };
});

/* =========================================
   3. CART SYSTEM
========================================= */
let cart = [];
const cartCount = document.getElementById('cart-count');

// Add to cart
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    
    const card = btn.closest('.product-card');
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    const existing = cart.find(i => i.name === name);
    
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    updateCart();
    btn.textContent = 'Added ✓';
    setTimeout(() => btn.textContent = 'Order', 1200);

  });
});

// Open cart
document.getElementById('cartIcon').onclick = () => {
  renderCart();
  document.getElementById('cartModal').style.display = 'block';
};

// Close cart
document.querySelector('.close-cart').onclick = () => {
  document.getElementById('cartModal').style.display = 'none';
};

// Render cart items
function renderCart() {
  const wrap = document.getElementById('cartItems');
  wrap.innerHTML = '';

  if (cart.length === 0) {
    wrap.innerHTML = '<p>Your cart is empty</p>';
  } else {
    cart.forEach((item, i) => {
      wrap.innerHTML += `
        <div class="cart-item">
          <div>
            <b>${item.name}</b> x${item.qty}
            <br>₦${item.price * item.qty}
          </div>
          <button onclick="removeItem(${i})">Cancel</button>
        </div>
      `;
    });
  }
  
  updateCart();
}

// Remove item
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// Update totals
function updateCart() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  
  cartCount.textContent = totalQty;
  document.getElementById('cartTotal').textContent = `Total: ₦${totalPrice}`;
}

/* =========================================
   4. SEARCH + MOBILE MENU
========================================= */
document.getElementById('menuToggle').onclick = () => {
  document.getElementById('navLinks').classList.toggle('show');
};

document.getElementById('searchIcon').onclick = () => {
  document.getElementById('searchBox').classList.toggle('show');
};

document.getElementById('searchBox').addEventListener('input', e => {
  const val = e.target.value.toLowerCase();
  
  document.querySelectorAll('.product-card').forEach(card => {
    card.classList.toggle(
      'hidden', 
      !card.dataset.name.toLowerCase().includes(val)
    );
  });
});

/* =========================================
   5. CATEGORY FILTER
========================================= */
document.querySelectorAll('.cat-card').forEach(card => {
  card.onclick = () => {
    const cat = card.dataset.cat;
    
    document.querySelectorAll('.product-card').forEach(p => {
      p.classList.toggle('hidden', p.dataset.cat !== cat);
    });
    
    document.getElementById('menu').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };
});

/* =========================================
   6. ORDER MODAL
========================================= */
const menu = {
  delicacies: [
    { n: 'Fried Rice + Chicken', p: 3500 },
    { n: 'Jollof Rice + Beef', p: 4000 }
  ],
  pastries: [
    { n: 'Meatpie', p: 800 }
  ],
  bread: [
    { n: 'Sourdough Bread', p: 4500 }
  ]
};

function loadTab(tab) {
  const sel = document.getElementById('itemSelect');
  sel.innerHTML = menu[tab]
    .map(i => `<option value="${i.p}">${i.n} - ₦${i.p}</option>`)
    .join('');
  calcTotal();
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = e => {
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    e.target.classList.add('active');
    loadTab(e.target.dataset.tab);
  };
});

function calcTotal() {
  const price = Number(document.getElementById('itemSelect').value) || 0;
  const qty = Number(document.getElementById('qty').value);
  document.getElementById('totalBill').textContent = `Total: ₦${price * qty}`;
}

document.getElementById('qty').oninput = calcTotal;
document.getElementById('itemSelect').onchange = calcTotal;

loadTab('delicacies');

document.querySelector('.close').onclick = () => {
  document.getElementById('orderModal').style.display = 'none';
};

/* =========================================
   7. TRACK ORDER
========================================= */
document.getElementById('trackBtn').onclick = () => {
  const loc = document.getElementById('userLocation').value.trim();
  const etaText = document.getElementById('etaText');

  if (loc === '') {
    etaText.textContent = 'Please enter your location first';
    return;
  }

  let mins = loc.toLowerCase().includes('ikorodu') ? 15 : 30;
  let count = mins * 60;

  const timer = setInterval(() => {
    const m = Math.floor(count / 60);
    const s = count % 60;
    etaText.textContent = `Food arriving in ${m}:${s < 10 ? '0' : ''}${s}`;
    
    if (count-- <= 0) {
      clearInterval(timer);
      etaText.textContent = 'Your food has arrived!';
    }
  }, 1000);
};

/* =========================================
   8. REVIEWS - STARS
========================================= */
const stars = document.querySelectorAll('.star-rating i');
const starInput = document.getElementById('revStar');

stars.forEach(star => {
  star.addEventListener('click', () => {
    const val = star.dataset.value;
    starInput.value = val;
    
    stars.forEach(s => {
      s.classList.toggle('active', s.dataset.value <= val);
      s.classList.toggle('fa-solid', s.dataset.value <= val);
      s.classList.toggle('fa-regular', s.dataset.value > val);
    });
  });
});

document.getElementById('reviewForm').onsubmit = e => {
  e.preventDefault();
  
  const name = document.getElementById('revName').value;
  const star = starInput.value;
  const text = document.getElementById('revText').value;

  if (star == 0) {
    alert('Please select a star rating');
    return;
  }

  document.getElementById('reviewList').innerHTML += `
    <div class="review-card">
      <b>${name}</b> ${'★'.repeat(star)}
      <p>${text}</p>
    </div>
  `;

  e.target.reset();
  
  stars.forEach(s => {
    s.classList.remove('active', 'fa-solid');
    s.classList.add('fa-regular');
  });
  
  starInput.value = 0;
};

/* =========================================
   9. SCROLL REVEAL
========================================= */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { 
  threshold: 0.1 
});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));