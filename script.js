// init Isotope
var $grid = $('.collection-list').isotope({
    // options
  });
  // filter items on button click
  $('.filter-button-group').on( 'click', 'button', function() {
    var filterValue = $(this).attr('data-filter');
    resetFilterBtns();
    $(this).addClass('active-filter-btn');
    $grid.isotope({ filter: filterValue });
  });

var filterBtns=$('.filter-button-group').find('button');
function resetFilterBtns(){
    filterBtns.each(function(){
        $(this).removeClass('active-filter-btn');
    
    });
}



  const ratings = {
  'product1': [5, 4, 3, 5],  
  'product2': [4, 4],
  'product3': [5, 4],
  'product4': [4, 4],
  'product5': [5, 4],
  'product6': [5, 4],
  'product7': [5, 4],
  'product8': [5, 4],
};

function renderAverageStars() {
    const ratingElements = document.querySelectorAll('.rating');

    ratingElements.forEach(ratingEl => {
      const productId = ratingEl.dataset.id;
      const productRatings = ratings[productId] || [];

      const avg = productRatings.length
        ? productRatings.reduce((a, b) => a + b, 0) / productRatings.length
        : 0;
      const rounded = Math.round(avg);

      ratingEl.innerHTML = '';

      // Render stars and attach click listeners
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = `fa-star fa ${i <= rounded ? 'text-warning fas' : 'text-secondary far'}`;
        star.style.cursor = 'pointer';
        star.dataset.value = i;

        // Click to rate
        star.addEventListener('click', () => {
          if (!ratings[productId]) ratings[productId] = [];
          ratings[productId].push(i);
          renderAverageStars(); // re-render after rating
        });

        ratingEl.appendChild(star);
      }
    });
  }

  renderAverageStars();


  document.addEventListener('DOMContentLoaded', () => {
    let heartCount = 0;
    const heartDisplay = document.getElementById('heart-count');
    const headerHeart = document.getElementById('header-heart-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarItems = document.getElementById('sidebarItems');
    const closeSidebarBtn = document.getElementById('closeSidebar');
  
    // Array to store favorites with unique id = name + img
    let favorites = [];
  
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-fav');
      if (!btn || btn === headerHeart) return;
  
      const icon = btn.querySelector('i');
      const productCard = btn.closest('.collection-item');
      const productTitle = productCard.querySelector('p').textContent.trim();
      const productPrice = productCard.querySelector('span').textContent.trim();
      const productImg = productCard.querySelector('img').src;
  
      const favId = productTitle + "|" + productImg;
  
      const index = favorites.findIndex(f => f.id === favId);
  
      if (index === -1) {
        // Add to favorites
        favorites.push({ id: favId, name: productTitle, price: productPrice, img: productImg });
        btn.classList.add('added');
        icon.classList.replace('far', 'fas');
        heartCount++;
      } else {
        // Remove from favorites
        favorites.splice(index, 1);
        btn.classList.remove('added');
        icon.classList.replace('fas', 'far');
        heartCount--;
      }
  
      heartDisplay.textContent = heartCount;
      updateSidebar();
    });
  
    headerHeart.addEventListener('click', () => {
      if (sidebar.style.display === 'block') {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  
    function openSidebar() {
      sidebar.style.display = 'block';
      headerHeart.classList.add('open');
      updateSidebar();
    }
  
    function closeSidebar() {
      sidebar.style.display = 'none';
      headerHeart.classList.remove('open');
    }
  
    function updateSidebar() {
      sidebarItems.innerHTML = '';
  
      favorites.forEach(product => {
        const productHTML = `
          <div class="product d-flex align-items-center justify-content-between px-2 py-2 border-bottom">
            <img src="${product.img}" alt="${product.name}" style="width: 50px; height: auto;">
            <div class="product-info ms-2 me-auto">
              <p class="mb-1">${product.name}</p>
              <span class="text-muted">${product.price}</span>
            </div>
            <button class="remove-fav btn btn-sm btn-outline-danger" data-id="${product.id}">&times;</button>
          </div>
        `;
        sidebarItems.innerHTML += productHTML;
      });
  
      if (favorites.length > 0) {
        const firstProduct = sidebarItems.querySelector('.product:first-child');
        firstProduct.style.marginTop = '20px';
      }
    }
  
    // ❌ removal from sidebar
    sidebarItems.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-fav')) {
        const id = e.target.getAttribute('data-id');
        const index = favorites.findIndex(f => f.id === id);
        if (index !== -1) {
          const removed = favorites[index];
          favorites.splice(index, 1);
          heartCount--;
          heartDisplay.textContent = heartCount;
  
          // Reset heart icon in main product
          const productCards = document.querySelectorAll('.collection-item');
          productCards.forEach(card => {
            const name = card.querySelector('p')?.textContent.trim();
            const img = card.querySelector('img')?.src;
            if (name === removed.name && img === removed.img) {
              const favBtn = card.querySelector('.add-to-fav');
              if (favBtn) {
                favBtn.classList.remove('added');
                favBtn.querySelector('i').classList.replace('fas', 'far');
              }
            }
          });
  
          updateSidebar();
        }
      }
    });
  
    closeSidebarBtn.addEventListener('click', () => {
      closeSidebar();
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    let totalCount = 0;
    let cartItems = []; 
    const cartDisplay = document.getElementById('cart-count');
    const cartBtn     = document.getElementById('header-cart-btn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMsg = document.getElementById('emptyCartMsg');
    const buyNowSection= document.getElementById('buyNowSection');
    const cartTotalAmt = document.getElementById('cartTotalAmount');
    const closeCartBtn = document.getElementById('closeCartSidebar');
  
    // click "Add to Cart"
    document.body.addEventListener('click', e => {
      const btn = e.target.closest('.add-to-cart');
      if (!btn) return;
      if (btn.tagName==='A') e.preventDefault();
  
      const card = btn.closest('.collection-item, .col-12.collection-item');
      if (!card) return;
  
      const name = card.querySelector('p')?.textContent.trim();
      const price = card.querySelector('span')?.textContent.trim();
      const img = card.querySelector('img')?.src;
      if (!name||!price||!img) return;
  
      const id = name + '|' + img;
      let entry = cartItems.find(x=>x.id===id);
      if (entry) {
        entry.qty++;
      } else {
        cartItems.push({ id, name, price, img, qty: 1 });
      }
      totalCount++;
      refreshCartUI();
    });
  
    // click remove-× in sidebar
    cartItemsContainer.addEventListener('click', e => {
      if (!e.target.classList.contains('remove-cart')) return;
      const id = e.target.getAttribute('data-id');
      const entry = cartItems.find(x=>x.id===id);
      if (!entry) return;
      entry.qty--;
      totalCount--;
      if (entry.qty <= 0) {
        cartItems = cartItems.filter(x=>x.id!==id);
      }
      refreshCartUI();
    });
  
    // toggle sidebar
    cartBtn.addEventListener('click', () => {
      const show = cartSidebar.style.display !== 'block';
      cartSidebar.style.display = show ? 'block' : 'none';
      if (show) refreshCartUI();
    });
    closeCartBtn.addEventListener('click', () => {
      cartSidebar.style.display = 'none';
    });
  
    function refreshCartUI(){
      // update badge
      cartDisplay.textContent = totalCount;
      // rebuild list
      cartItemsContainer.innerHTML = '';
      let total = 0;
      cartItems.forEach(item => {
        total += parseFloat(item.price.replace('€','')) * item.qty;
        const div = document.createElement('div');
        div.className = 'product d-flex align-items-center justify-content-between px-2 py-2 border-bottom';
        div.innerHTML = `
          <img src="${item.img}" style="width:50px;height:auto" alt="${item.name}">
          <div class="product-info ms-2 me-auto">
            <p class="mb-1">${item.name}</p>
            <span class="text-muted">${item.price} ×${item.qty}</span>
          </div>
          <button class="remove-cart btn btn-sm btn-outline-danger" data-id="${item.id}">&times;</button>
        `;
        cartItemsContainer.appendChild(div);
      });
      // total & buy-now visibility
      if (cartItems.length) {
        buyNowSection.style.display = '';
        emptyCartMsg.style.display = 'none';
        cartTotalAmt.textContent = total.toFixed(2) + '€';
      } else {
        buyNowSection.style.display = 'none';
        emptyCartMsg.style.display = '';
      }
    }
  });





  
    
    
  
  
  

    document.addEventListener('DOMContentLoaded', () => {
      const searchBtn   = document.getElementById('search-btn');
      const searchInput = document.getElementById('search-input');
    
      if (!searchBtn || !searchInput) return;
    
      // Toggle input visibility on button click
      searchBtn.addEventListener('click', () => {
        if (searchInput.classList.contains('d-none')) {
          searchInput.classList.remove('d-none');
          searchInput.focus();
        } else {
          searchInput.classList.add('d-none');
        }
      });
    
      // Intercept Ctrl+F to open your custom search box
      document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'f') {
          e.preventDefault();
          searchInput.classList.remove('d-none');
          searchInput.focus();
        }
      });
    
      // Core filter/highlight logic
      searchInput.addEventListener('input', () => {
        const term     = searchInput.value.trim().toLowerCase();
        const elements = document.querySelectorAll('body *:not(script):not(style)');
    
        if (!term) {
          elements.forEach(el => {
            if (el.children.length === 0 && el.textContent.trim()) {
              el.style.backgroundColor = '';
            }
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
    
        elements.forEach(el => {
          if (el.children.length === 0 && el.textContent.trim()) {
            const text = el.textContent.trim().toLowerCase();
            if (text.includes(term)) {
              el.style.backgroundColor = '#ffff99';
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              el.style.backgroundColor = '';
            }
          }
        });
      });
    
      // Hide input when clicking outside
      document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !searchBtn.contains(e.target)) {
          searchInput.classList.add('d-none');
        }
      });
    });

    
  
  
    
    




  
  
  
  

    document.querySelectorAll('.navbar-nav .nav-link').forEach(function(navItem) {
        navItem.addEventListener('click', function() {
            var navbarCollapse = document.querySelector('#navMenu');
            var navbarToggle = document.querySelector('.navbar-toggler');
            if (navbarCollapse.classList.contains('show')) {
                navbarToggle.click(); 
            }
        });
    });
