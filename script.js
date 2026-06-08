// ============================================
// MENU HAMBURGER RESPONSIVO
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu ao clicar no hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  
  // Prevenir scroll quando menu está aberto
  if (navMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Fechar menu ao clicar em um link
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Fechar menu ao clicar fora dele
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-container')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ============================================
// NAVEGAÇÃO SUAVE E ATIVA
// ============================================

const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === currentSection) {
      link.classList.add('active');
    }
  });
});

// ============================================
// ANIMAÇÃO DE CONTAGEM DE NÚMEROS
// ============================================

const stats = document.querySelectorAll('.stat-number');
let animated = false;

function animateStats() {
  stats.forEach((stat) => {
    const target = parseInt(stat.textContent);
    const increment = target / 50;
    let current = 0;

    const counter = setInterval(() => {
      current += increment;

      if (current >= target) {
        stat.textContent = stat.textContent;
        clearInterval(counter);
      } else {
        if (stat.textContent.includes('+')) {
          stat.textContent = Math.ceil(current) + '+';
        } else if (stat.textContent.includes('%')) {
          stat.textContent = Math.ceil(current) + '%';
        } else {
          stat.textContent = Math.ceil(current) + '+';
        }
      }
    }, 30);
  });
}

// Animar números quando chegar à seção
window.addEventListener('scroll', () => {
  const aboutSection = document.querySelector('.about');
  const aboutTop = aboutSection.offsetTop;

  if (window.pageYOffset >= aboutTop - 500 && !animated) {
    animated = true;
    animateStats();
  }
});

// ============================================
// FUNÇÃO DE ESCAPE PARA PREVENIR XSS
// ============================================

function escapeHTML(value) {
  const textNode = document.createTextNode(value);
  const div = document.createElement('div');
  div.appendChild(textNode);
  return div.innerHTML;
}

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries()).reduce((acc, [key, value]) => {
      acc[key] = escapeHTML(value);
      return acc;
    }, {});

    // Aqui você pode adicionar a lógica de envio do formulário
    console.log('Dados do formulário:', data);

    // Feedback visual seguro
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = '✓ Mensagem Enviada!';
    submitBtn.style.background = '#34d399';

    contactForm.reset();

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
    }, 3000);
  });
}

// ============================================
// EFEITO DE PARALLAX SUAVE
// ============================================

const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  if (heroSection) {
    heroSection.style.backgroundPosition = `0px ${scrolled * 0.5}px`;
  }
});

// ============================================
// REVELAÇÃO DE ELEMENTOS AO SCROLL
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar cards de projeto
document.querySelectorAll('.project-card').forEach((card) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.6s ease-out';
  observer.observe(card);
});

// ============================================
// EFEITO DE DIGITAÇÃO NO CÓDIGO
// ============================================

const codeElement = document.querySelector('.code-card code');
if (codeElement) {
  const clone = codeElement.cloneNode(true);
  const textNodes = [];

  function collectTextNodes(node) {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        textNodes.push({ node: child, text: child.textContent });
        child.textContent = '';
      } else {
        collectTextNodes(child);
      }
    });
  }

  collectTextNodes(clone);
  codeElement.innerHTML = '';
  codeElement.appendChild(clone);

  let nodeIndex = 0;
  let charIndex = 0;
  let typingStarted = false;

  function typeCode() {
    if (nodeIndex >= textNodes.length) {
      return;
    }

    const current = textNodes[nodeIndex];
    current.node.textContent += current.text[charIndex];
    charIndex++;

    if (charIndex >= current.text.length) {
      nodeIndex++;
      charIndex = 0;
    }

    setTimeout(typeCode, 20);
  }

  function startTyping() {
    if (!typingStarted) {
      typingStarted = true;
      setTimeout(typeCode, 500);
    }
  }

  window.addEventListener('scroll', () => {
    if (window.pageYOffset < 100) {
      startTyping();
    }
  });

  setTimeout(startTyping, 1000);
}

// ============================================
// SMOOTH SCROLL PARA NAVEGAÇÃO
// ============================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const element = document.querySelector(href);
      const offsetTop = element.offsetTop - 70;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  });
});

// ============================================
// DARK MODE TOGGLE (Opcional)
// ============================================

// Detectar preferência de dark mode do sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
}

// ============================================
// ADICIONAR CLASSE ATIVA AO NAV LINK
// ============================================

const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: var(--primary);
  }

  .nav-link.active::after {
    width: 100%;
  }
`;
document.head.appendChild(style);

// ============================================
// ADICIONAR EFEITO PULSE AOS BOTÕES
// ============================================

const buttons = document.querySelectorAll('.btn-primary');

buttons.forEach((button) => {
  button.addEventListener('mouseenter', function () {
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255,255,255,0.5)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});



