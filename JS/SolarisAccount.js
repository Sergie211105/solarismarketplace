document.addEventListener('DOMContentLoaded', () => {
    
    const navItems = document.querySelectorAll('.account-nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const profileForm = document.getElementById('profile-form');
    const userNameDisplay = document.querySelector('.user-name-display');

    //Notif
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
    
    // --- Fungsi Cart Item (Diambil dan Disesuaikan) ---
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
        
        showNotification(`${item.name} berhasil ditambahkan ke keranjang!`);
    }

    function switchSection(targetId) {
        navItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        const activeNavItem = document.querySelector(`.account-nav-item[href="#${targetId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href === '#') {
                if (userNameDisplay) {
                    userNameDisplay.innerHTML = 'Halo, <strong>Nama User</strong>'; 
                }
                showNotification('Anda berhasil keluar.');
            } else {
                const targetId = href.substring(1);
                switchSection(targetId);
            }
        });
    });

    switchSection('profile-settings');

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const requiredInputs = profileForm.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        let firstInvalidInput = null;

        requiredInputs.forEach(input => {
            if (input.value.trim() === '') {
                isValid = false;
                input.style.border = '2px solid var(--accent-color)';
                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
            } else {
                input.style.border = '';
                input.style.borderColor = 'var(--gray-light)'; 
            }
        });

        if (isValid) {
            const newName = document.getElementById('name').value;
            
            if (userNameDisplay) {
                userNameDisplay.innerHTML = `Halo, <strong>${newName}</strong>`;
            }

            console.log('Profile Data Updated:', {
                name: newName,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
                province: document.getElementById('province').value,
                bio: document.getElementById('bio').value
            });
            document.addEventListener('DOMContentLoaded', () => {
    
    const navItems = document.querySelectorAll('.account-nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const profileForm = document.getElementById('profile-form');
    const userNameDisplay = document.querySelector('.user-name-display');

    //Notif
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
    
    // --- Fungsi Cart Item (Diambil dan Disesuaikan) ---
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
        
        showNotification(`${item.name} berhasil ditambahkan ke keranjang!`);
    }

    function switchSection(targetId) {
        navItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        const activeNavItem = document.querySelector(`.account-nav-item[href="#${targetId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href === '#') {
                if (userNameDisplay) {
                    userNameDisplay.innerHTML = 'Halo, <strong>Nama User</strong>'; 
                }
                showNotification('Anda berhasil keluar.');
            } else {
                const targetId = href.substring(1);
                switchSection(targetId);
            }
        });
    });

    switchSection('profile-settings');

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const requiredInputs = profileForm.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        let firstInvalidInput = null;

        requiredInputs.forEach(input => {
            if (input.value.trim() === '') {
                isValid = false;
                // Terapkan style error (border merah)
                input.style.border = '2px solid var(--accent-color)';
                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
            } else {
                // Hapus style error dan kembalikan ke style default yang aman
                input.style.border = '1px solid var(--gray-light)'; 
                input.style.borderColor = 'var(--gray-light)'; 
            }
        });

        if (isValid) {
            const newName = document.getElementById('name').value;
            
            if (userNameDisplay) {
                userNameDisplay.innerHTML = `Halo, <strong>${newName}</strong>`;
            }

            console.log('Profile Data Updated:', {
                name: newName,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
                province: document.getElementById('province').value,
                bio: document.getElementById('bio').value
            });
            
            showNotification('Perubahan profil berhasil disimpan!');
            
            // profileForm.reset() dihapus agar data yang baru disimpan tetap ada di form
            
        } else {
            // Alert dan fokus hanya dijalankan jika isValid=false
            alert('⚠️ Mohon lengkapi semua field yang wajib diisi.');
            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }
        }
    });
    
    // --- Logika Tambah ke Keranjang untuk Recent/Wishlist Diperbarui ---
    document.querySelectorAll('.product-grid').forEach(grid => {
        grid.addEventListener('click', (e) => {
            // Menggunakan closest untuk mencari tombol quick-add-btn
            const button = e.target.closest('.quick-add-btn');

            if (button) {
                e.preventDefault();
                e.stopPropagation();

                // Cari product-card terdekat dari tombol
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
            }
        });
    });

    updateCartCount();
});
            showNotification('Perubahan profil berhasil disimpan!');
            
            profileForm.reset();
            
            requiredInputs.forEach(input => {
                input.style.border = '';
                input.style.borderColor = 'var(--gray-light)'; 
            });
            
        } else {
            alert('⚠️ Mohon lengkapi semua field yang wajib diisi.');
            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }
        }
    });
    
    // --- Logika Tambah ke Keranjang untuk Recent/Wishlist Diperbarui ---
    document.querySelectorAll('.product-grid').forEach(grid => {
        grid.addEventListener('click', (e) => {
            // Menggunakan closest untuk mencari tombol quick-add-btn
            const button = e.target.closest('.quick-add-btn');

            if (button) {
                e.preventDefault();
                e.stopPropagation();

                // Cari product-card terdekat dari tombol
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
            }
        });
    });

    updateCartCount();
});