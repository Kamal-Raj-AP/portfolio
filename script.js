const firebaseConfig = {
  apiKey: "AIzaSyAatitCw3eEH1WB7P3omJ47HcHwyotcd5M",
  authDomain: "portfolio-b903f.firebaseapp.com",
  projectId: "portfolio-b903f",
  storageBucket: "portfolio-b903f.firebasestorage.app",
  messagingSenderId: "818555513457",
  appId: "1:818555513457:web:430fe1d46709e4a0dec9d0",
  measurementId: "G-E1NQDB8YEH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// --- Dark Mode Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');

// Check local storage for theme preference, default to dark-mode (since it's on body tag by default in HTML)
let isDarkMode = localStorage.getItem('theme') !== 'light';

function updateThemeIcon() {
    if (isDarkMode) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Initial set based on preference
if (!isDarkMode) {
    document.body.classList.remove('dark-mode');
}
updateThemeIcon();

themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
});


// --- Mobile Navigation ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});


// --- Sticky Header & Active Link Switching ---
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    // Sticky Header
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Active Link Switching
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Add a slight offset to the sectionTop for better trigger timing
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});


// --- Scroll Reveal Animations ---
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100; // when to trigger the animation
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

// Trigger once on load
window.addEventListener('load', reveal);
// Trigger on scroll
window.addEventListener('scroll', reveal);


// --- Contact Form Submission Prevent Default ---
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Visual feedback during submission
        btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        
        try {
            await db.collection("contacts").add({
                name: name,
                email: email,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Simple visual feedback
            btn.innerHTML = 'Sent Successfully! <i class="fa-solid fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            this.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        } catch (error) {
            console.error("Error adding document: ", error);
            btn.innerHTML = 'Error! Try Again <i class="fa-solid fa-xmark"></i>';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        }
    });
}
