// SolarisHome.js

// Slideshow functionality
let slideIndex = 0;
let slideshowTimeout;

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Move to next slide
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    // Show current slide and mark active dot
    if (slides.length > 0) slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0) dots[slideIndex - 1].className += " active";
    
    // Set timer for next slide
    slideshowTimeout = setTimeout(showSlides, 5000);
}

// Manual navigation with dots
function currentSlide(n) {
    clearTimeout(slideshowTimeout);
    slideIndex = n - 1;
    showSlides();
}

// --- Cart Functionality (Standardized) ---
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function saveCartItem(item) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += item.quantity;
    } else {
        cartItems.push(item);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showNotification(`${item.name} added to cart!`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
    `;
    
    const content = notification.querySelector('.notification-content');
    if(content) {
        content.style.display = 'flex';
        content.style.alignItems = 'center';
    }
    
    const icon = notification.querySelector('.fas');
    if(icon) {
        icon.style.marginRight = '10px';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {
    // Start slideshow if slides exist
    if (document.getElementsByClassName("mySlides").length > 0) {
        showSlides();
    }
    
    // Add quick add to cart functionality
    document.querySelectorAll('.quick-add-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPriceText = productCard.querySelector('.product-price').textContent;
            // Membersihkan teks harga (asumsi format Rp 893.000)
            const productPrice = parseFloat(productPriceText.replace('Rp ', '').replace(/\./g, '').replace(',', '.')); 
            const productImage = productCard.querySelector('img').src;
            
            const itemToAdd = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            saveCartItem(itemToAdd);
        });
    });
    
    // Add event listener for product cards (for detailed view in future)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            console.log('Product card clicked');
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    
    // **UPDATE: FIX #2 - Implementasi fungsi filter untuk item di homepage**
    function applySearchFilter() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // Target semua kartu produk di seluruh halaman, khususnya di bagian 'special item just for you'
        const productCards = document.querySelectorAll('.product-grid .product-card'); 

        productCards.forEach(card => {
            const productNameElement = card.querySelector('.product-name');
            if (productNameElement) {
                const productName = productNameElement.textContent.toLowerCase();
                
                // Jika search term kosong, tampilkan semua. Jika nama produk mengandung search term, tampilkan.
                if (searchTerm === '' || productName.includes(searchTerm)) {
                    card.style.display = 'block'; // Tampilkan item
                } else {
                    card.style.display = 'none'; // Sembunyikan item
                }
            }
        });
        
        console.log('Searching for:', searchTerm);
    }
    
    if (searchInput) {
        // Event listener diubah ke 'input' agar lebih responsif
        searchInput.addEventListener('input', applySearchFilter); 
        
        // Click pada search suggestions
        document.querySelectorAll('.search-suggestions span').forEach(span => {
            span.addEventListener('click', () => {
                searchInput.value = span.textContent;
                applySearchFilter();
            });
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            showNotification('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }
    
    updateCartCount();
});