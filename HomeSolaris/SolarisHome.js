// SolarisSlideshow.js

let slideIndex = 0; // Mulai dari slide pertama (index 0)
let slideshowTimeout; // Untuk menyimpan referensi timeout agar bisa di-clear

function showSlides() {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    // Sembunyikan semua slide
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Hapus kelas 'active' dari semua dot
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // Pindah ke slide berikutnya
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1; // Kembali ke slide pertama jika sudah di akhir
    }

    // Tampilkan slide saat ini dan tandai dot yang aktif
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";

    // Set timer untuk slide berikutnya (setiap 4 detik)
    slideshowTimeout = setTimeout(showSlides, 4000); // Ganti angka ini untuk kecepatan slide (misalnya 3000 = 3 detik)
}

// Fungsi untuk navigasi manual melalui dot
function currentSlide(n) {
    clearTimeout(slideshowTimeout); // Hentikan slideshow otomatis saat navigasi manual
    slideIndex = n - 1; // Sesuaikan dengan indeks array (n adalah 1-based)
    showSlides(); // Tampilkan slide yang dipilih
}

// Jalankan slideshow saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    showSlides();
});