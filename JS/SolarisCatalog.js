// Cart functionality matching homepage (TETAP SAMA)
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
        background: var(--success-color);
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
    `;
    
    // Styling tambahan untuk konten notifikasi
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


document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();

    // Catalog Filtering functionality
    const filterToggleButton = document.getElementById('filterToggleButton');
    const filterSidebar = document.getElementById('filterSidebar');
    const productGrid = document.getElementById('productGrid');
    const allProductCards = document.querySelectorAll('.product-card');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const countryRadioButtons = document.querySelectorAll('input[name="country"]');
    const filterTitle = document.getElementById('filterTitle');
    const searchInput = document.querySelector('.search-bar input');

    // === START: LOGIKA LOAD MORE (Tampilan Awal 3 Produk) ===
    const initialVisibleCount = 3;
    const productsToLoad = 6; 
    let currentlyVisible = 0;
    let loadMoreButton = null;

    function createLoadMoreButton() {
        if (allProductCards.length > initialVisibleCount && !loadMoreButton) {
            loadMoreButton = document.createElement('button');
            loadMoreButton.id = 'loadMoreBtn';
            loadMoreButton.className = 'load-more-btn';
            loadMoreButton.textContent = 'Load More Products...';
            
            // Sisipkan tombol tepat setelah productGrid
            productGrid.parentNode.insertBefore(loadMoreButton, productGrid.nextSibling);

            loadMoreButton.addEventListener('click', loadMoreProducts);
        }
    }

    function loadMoreProducts() {
        const remainingProducts = Array.from(allProductCards).filter(card => 
            !card.classList.contains('hidden') && card.style.display === 'none'
        );

        let loadedCount = 0;
        
        for (let i = 0; i < productsToLoad && i < remainingProducts.length; i++) {
            remainingProducts[i].style.display = 'block';
            loadedCount++;
            currentlyVisible++;
        }

        // Sembunyikan tombol jika semua produk yang telah difilter sudah dimuat
        const totalVisibleCards = Array.from(allProductCards).filter(card => 
            !card.classList.contains('hidden')
        ).length;

        if (currentlyVisible >= totalVisibleCards) {
            if(loadMoreButton) loadMoreButton.style.display = 'none';
        }
    }
    
    function initialDisplay() {
        // Sembunyikan semua produk dulu, kecuali yang pertama
        allProductCards.forEach((card, index) => {
            card.style.display = 'none'; // Secara default sembunyikan semua
        });

        // Tampilkan 3 produk awal
        for (let i = 0; i < initialVisibleCount && i < allProductCards.length; i++) {
            allProductCards[i].style.display = 'block';
            currentlyVisible++;
        }
        
        createLoadMoreButton();
        if (currentlyVisible >= allProductCards.length && loadMoreButton) {
             loadMoreButton.style.display = 'none';
        }
    }

    // Panggil fungsi display awal
    initialDisplay();
    // === END: LOGIKA LOAD MORE ===


    // Filter toggle functionality
    filterToggleButton.addEventListener('click', function() {
        filterSidebar.classList.toggle('active');
        filterToggleButton.classList.toggle('active');
    });

    function applyFilters() {
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const selectedCountry = Array.from(countryRadioButtons)
            .find(radio => radio.checked)?.value;

        const searchTerm = searchInput.value.toLowerCase().trim();

        // Update filter title
        let filterText = 'All Products';
        const filterParts = [];
        
        if (selectedCategories.length > 0) {
            filterParts.push(selectedCategories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(', '));
        }
        if (selectedCountry && selectedCountry !== 'all') {
            filterParts.push(selectedCountry.toUpperCase());
        }
        if (searchTerm) {
            filterParts.push(`"${searchTerm}"`);
        }
        
        if (filterParts.length > 0) {
            filterText = filterParts.join(' • ');
        }
        filterTitle.textContent = filterText;
        
        let filteredCount = 0;

        // Apply filters to products
        allProductCards.forEach(card => {
            const productCategory = card.dataset.category;
            const productCountry = card.dataset.country;
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productPriceSpan = card.querySelector('.product-price');
            // Mengambil harga asli dari data attribute, atau dari textContent jika belum ada
            const originalPrice = parseFloat(productPriceSpan.dataset.originalPrice || 
                productPriceSpan.textContent.replace('Rp ', '').replace(/\./g, ''));

            if (!productPriceSpan.dataset.originalPrice) {
                // Simpan harga asli (rupiah)
                productPriceSpan.dataset.originalPrice = originalPrice; 
            }

            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
            const countryMatch = !selectedCountry || selectedCountry === 'all' || productCountry === selectedCountry;
            const searchMatch = !searchTerm || productName.includes(searchTerm);

            let isMatch = categoryMatch && countryMatch && searchMatch;

            if (isMatch) {
                card.classList.remove('hidden');
                filteredCount++;
                
                // Terapkan konversi mata uang
                if (selectedCountry === 'us' && productCountry === 'us') {
                    const priceInUsd = (originalPrice / 15000).toFixed(2); // Asumsi kurs
                    productPriceSpan.textContent = `$${priceInUsd}`;
                    productPriceSpan.style.color = '#27ae60'; // Green for USD
                } else {
                    productPriceSpan.textContent = `Rp ${originalPrice.toLocaleString('id-ID')}`;
                    productPriceSpan.style.color = 'var(--accent-color)'; // Red for IDR
                }

                // Terapkan logika tampilan awal/Load More setelah filter:
                // Tampilkan hanya 3 produk pertama yang cocok dengan filter. Sisanya disembunyikan
                // agar Load More bisa menampilkannya.
                if (filteredCount <= initialVisibleCount) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }

            } else {
                card.classList.add('hidden');
                card.style.display = 'none'; // Pastikan yang tidak match disembunyikan
            }
        });
        
        // Atur ulang counter dan tombol Load More
        currentlyVisible = filteredCount > initialVisibleCount ? initialVisibleCount : filteredCount;
        
        if (loadMoreButton) {
             if (filteredCount > initialVisibleCount) {
                 loadMoreButton.style.display = 'block';
             } else {
                 loadMoreButton.style.display = 'none';
             }
         }
    }

    // Event listeners for filters
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    countryRadioButtons.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });

    searchInput.addEventListener('input', applyFilters);

    // Quick add to cart functionality (like homepage)
    document.querySelectorAll('.quick-add-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            // Mengambil harga asli (Rupiah) yang disimpan
            const productPriceSpan = productCard.querySelector('.product-price');
            const originalPrice = parseFloat(productPriceSpan.dataset.originalPrice);

            const productImage = productCard.querySelector('img').src;
            
            const itemToAdd = {
                name: productName,
                price: originalPrice, // Selalu gunakan harga Rupiah asli saat menyimpan ke keranjang
                image: productImage,
                quantity: 1
            };
            
            saveCartItem(itemToAdd);
        });
    });

    // Product card click for details (future implementation)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.quick-add-btn')) {
                console.log('Product details would show for:', card.querySelector('.product-name').textContent);
            }
        });
    });

    // Initial filter application dijalankan setelah initialDisplay
    applyFilters(); 
});