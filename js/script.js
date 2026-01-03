// Smooth scroll para seções
function scrollToPlans() {
    const plansSection = document.getElementById('planos');
    if (plansSection) {
        plansSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.md\\:hidden');
let mobileMenu = null;

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        if (!mobileMenu) {
            mobileMenu = createMobileMenu();
            document.body.appendChild(mobileMenu);
        }
        mobileMenu.classList.toggle('active');
    });
}

function createMobileMenu() {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.innerHTML = `
        <div class="flex flex-col space-y-4">
            <a href="#recursos" class="text-gray-700 hover:text-blue-900 transition py-2">Recursos</a>
            <a href="#planos" class="text-gray-700 hover:text-blue-900 transition py-2">Planos</a>
            <a href="#depoimentos" class="text-gray-700 hover:text-blue-900 transition py-2">Depoimentos</a>
            <a href="#contato" class="text-gray-700 hover:text-blue-900 transition py-2">Contato</a>
            <button onclick="scrollToPlans()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold w-full">
                Começar Agora
            </button>
        </div>
    `;
    return menu;
}

// Animate numbers on scroll (Stats Section)
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const animateNumbers = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                animateValue(stat);
            });
            observer.unobserve(entry.target);
        }
    });
};

function animateValue(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasLessThan = text.includes('<');
    
    let numberStr = text.replace(/[^0-9.]/g, '');
    const targetValue = parseFloat(numberStr);
    
    if (isNaN(targetValue)) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (text.includes('.')) {
            displayValue = current.toFixed(1);
        }
        
        let finalText = displayValue.toString();
        if (hasPlus) finalText += '+';
        if (hasPercent) finalText += '%';
        if (hasLessThan) finalText = '<' + finalText + 's';
        
        element.textContent = finalText;
    }, duration / steps);
}

// Initialize observers
document.addEventListener('DOMContentLoaded', () => {
    // Stats animation observer
    const statsSection = document.querySelector('.py-12.bg-white');
    if (statsSection) {
        const observer = new IntersectionObserver(animateNumbers, observerOptions);
        observer.observe(statsSection);
        
        // Add stat-number class to numbers
        const statElements = statsSection.querySelectorAll('.text-4xl.font-bold');
        statElements.forEach(el => el.classList.add('stat-number'));
    }
    
    // Fade in animations for cards
    const cards = document.querySelectorAll('.card-hover');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    cards.forEach(card => cardObserver.observe(card));
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (!btn.classList.contains('btn-ripple')) {
            btn.classList.add('btn-ripple');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
    
    lastScroll = currentScroll;
});

// Form validation (para futura integração)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// CTA Button tracking
const ctaButtons = document.querySelectorAll('button[onclick="scrollToPlans()"]');
ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('CTA Button clicked:', btn.textContent);
        // Aqui você pode adicionar tracking analytics
        // Ex: gtag('event', 'cta_click', { button_text: btn.textContent });
    });
});

// Prevent default on demo button (por enquanto)
const demoButtons = document.querySelectorAll('button:not([onclick])');
demoButtons.forEach(btn => {
    if (btn.textContent.includes('Demonstração')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Demo em breve! Por enquanto, experimente nosso teste grátis de 7 dias.');
        });
    }
});

// Easter egg - Konami Code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 5s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});


// FAQ Toggle Function
function toggleFAQ(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

// Console easter egg
console.log('%c NutroFit', 'font-size: 20px; color: #10b981; font-weight: bold;');
console.log('%c Desenvolvido por Anderson Luiz DEV', 'font-size: 12px; color: #e4e4e4ff;');
console.log('%c Gostou do meu trabalho? Entre em contato! (83) 99920-8007', 'font-size: 12px; color: #fafafaff;');