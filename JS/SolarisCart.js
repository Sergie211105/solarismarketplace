// SolarisCart.js - Final Update for Original UI and Correct Functionality

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const totalCostAmount = document.getElementById('totalCostAmount');
    const convertCostDropdown = document.getElementById('convertCostDropdown');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCartState = document.getElementById('emptyCartState');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.querySelector('.cart-count');
    const emptySidebarMessage = document.getElementById('emptySidebarMessage'); 

    const EXCHANGE_RATES = {
        'IDR': 1,
        'USD': 0.000064,
        'EUR': 0.000059
    };

    // --- Fungsi Notifikasi (Konsisten) ---
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        let bgColor = (type === 'error') ? '#e74c3c' : '#27ae60';
        let iconClass = (type === 'error') ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="${iconClass}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
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
    
    // --- Fungsi Checkout: Hapus Item yang Dicentang dari Local Storage ---
    function removeCheckedItems() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const checkedNames = [];
        
        document.querySelectorAll('.item-checkbox:checked').forEach(checkbox => {
            // Mengambil nama item dari attribute 'data-item-name' di checkbox
            const itemName = checkbox.getAttribute('data-item-name');
            if (itemName) {
                checkedNames.push(itemName);
            }
        });

        // Filter: hanya pertahankan item yang TIDAK ada di checkedNames
        const newCartItems = cartItems.filter(item => !checkedNames.includes(item.name));
        
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        updateCartCount();
    }


    function formatCurrency(amount, currency) {
        const numberAmount = parseFloat(amount);
        if (isNaN(numberAmount)) return '';

        if (currency === 'IDR') {
            return `Rp ${numberAmount.toLocaleString('id-ID')}`;
        } else if (currency === 'USD') {
            return `$${numberAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (currency === 'EUR') {
            return `€${numberAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return `Rp ${numberAmount.toLocaleString('id-ID')}`;
    }

    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) { 
            cartCount.textContent = totalItems;
        }
    }

    function updateCartItemQuantity(itemName, newQuantity) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemIndex = cartItems.findIndex(item => item.name === itemName);
        if (itemIndex > -1) {
            cartItems[itemIndex].quantity = newQuantity;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
        }
    }

    function deleteCartItem(itemName) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item.name !== itemName); 
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        showNotification(`${itemName} removed from cart`);
    }

    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (cartItems.length === 0) {
            if (emptyCartState) emptyCartState.style.display = 'flex'; 
            if (cartSummary) cartSummary.style.display = 'none';
            if (checkoutBtn) checkoutBtn.disabled = true;
            if (emptySidebarMessage) emptySidebarMessage.style.display = 'block'; 
        } else {
            if (emptyCartState) emptyCartState.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'block';
            if (checkoutBtn) checkoutBtn.disabled = false;
            if (emptySidebarMessage) emptySidebarMessage.style.display = 'none';
            
            cartItems.forEach((item) => {
                const cartItemCard = document.createElement('div');
                cartItemCard.classList.add('cart-item-card');
                cartItemCard.setAttribute('data-item-name', item.name); 
                
                const imageUrl = item.image || '../Images/placeholder.jpg'; 

                // --- MARKUP HTML PALING RINGKAS UNTUK UI LAMA ---
                cartItemCard.innerHTML = `
                    <div class="item-selection">
                        <input type="checkbox" class="item-checkbox" data-item-name="${item.name}" checked>
                    </div>
                    <img src="${imageUrl}" alt="${item.name}" class="cart-item-image" onerror="this.src='../Images/placeholder.jpg'">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <span class="cart-item-price" data-price="${item.price}" data-currency="IDR">${formatCurrency(item.price, 'IDR')}</span>
                        <div class="item-controls">
                            <div class="quantity-control">
                                <button class="quantity-btn decrease-quantity" title="Kurangi"><i class="fas fa-minus"></i></button>
                                <input type="text" value="${item.quantity}" class="item-quantity" readonly>
                                <button class="quantity-btn increase-quantity" title="Tambah"><i class="fas fa-plus"></i></button>
                            </div>
                            <button class="delete-item-btn" title="Hapus"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
                // --- AKHIR MARKUP RINGKAS ---
                cartItemsContainer.appendChild(cartItemCard);
            });
        }
        
        calculateTotal();
        updateCartCount();
    }

    function calculateTotal() {
        let currentTotalIDR = 0;
        const selectedCurrency = convertCostDropdown ? convertCostDropdown.value : 'IDR'; 
        const rate = EXCHANGE_RATES[selectedCurrency] || 1;

        document.querySelectorAll('.cart-item-card').forEach(card => {
            const checkbox = card.querySelector('.item-checkbox');
            const quantityInput = card.querySelector('.item-quantity');
            const priceSpan = card.querySelector('.cart-item-price');
            const originalPriceIDR = parseFloat(priceSpan.dataset.price);
            
            // Konversi dan tampilkan harga per item
            const convertedItemPrice = originalPriceIDR * rate;
            priceSpan.textContent = formatCurrency(convertedItemPrice, selectedCurrency);


            if (checkbox && checkbox.checked) {
                const quantity = parseInt(quantityInput.value);
                if (!isNaN(originalPriceIDR) && !isNaN(quantity) && originalPriceIDR > 0 && quantity > 0) { 
                    currentTotalIDR += originalPriceIDR * quantity;
                }
            }
        });

        const finalTotalAmount = currentTotalIDR * rate;
        if (totalCostAmount) {
            totalCostAmount.textContent = formatCurrency(finalTotalAmount, selectedCurrency);
        }
    }
    
    // Event Listeners 
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const cartItemCard = target.closest('.cart-item-card');
            if (!cartItemCard) return;

            const itemName = cartItemCard.getAttribute('data-item-name');

            if (target.classList.contains('increase-quantity') || target.closest('.increase-quantity')) {
                const quantityInput = cartItemCard.querySelector('.item-quantity');
                let quantity = parseInt(quantityInput.value);
                quantity++;
                quantityInput.value = quantity;
                updateCartItemQuantity(itemName, quantity);
                calculateTotal();
            }
            else if (target.classList.contains('decrease-quantity') || target.closest('.decrease-quantity')) {
                const quantityInput = cartItemCard.querySelector('.item-quantity');
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantity--;
                    quantityInput.value = quantity;
                    updateCartItemQuantity(itemName, quantity);
                    calculateTotal();
                }
            }
            else if (target.classList.contains('delete-item-btn') || target.closest('.delete-item-btn')) {
                if (confirm('Remove this item from cart?')) {
                    deleteCartItem(itemName);
                    displayCartItems(); 
                }
            }
        });

        cartItemsContainer.addEventListener('change', (event) => {
            if (event.target.classList.contains('item-checkbox')) {
                calculateTotal();
            }
        });
    }

    if (convertCostDropdown) {
        convertCostDropdown.addEventListener('change', calculateTotal);
    }

    // --- Logic Checkout (Sudah Benar) ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const selectedItems = document.querySelectorAll('.item-checkbox:checked');
            if (selectedItems.length === 0) {
                showNotification('Harap pilih item untuk di checkout.', 'error');
                return;
            }
            
            // 1. Hapus item yang dicentang dari keranjang
            removeCheckedItems();
            
            // 2. Render ulang cart UI
            displayCartItems();
            
            // 3. Tampilkan notifikasi sukses yang konsisten
            showNotification('Checkout berhasil! Item yang terpilih telah dibeli.'); 
        });
    }

    // Initialize
    displayCartItems();
});