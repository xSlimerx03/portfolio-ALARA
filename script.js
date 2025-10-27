document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------
  // MEJORA 1: Barra de Progreso de Scroll
  // ------------------------------------
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgressBar.style.width = docHeight > 0 ? scrollPercent + '%' : '0%';
  };
  
  window.addEventListener('scroll', updateScrollProgress);

  // ------------------------------------
  // MEJORA 2: Cursor Personalizado
  // ------------------------------------
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice()) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        cursorOutline.style.left = e.clientX + 'px';
        cursorOutline.style.top = e.clientY + 'px';
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .interactive-hover, .service-card, .project-item, .testimonial-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseout', () => document.body.classList.remove('cursor-hover'));
    });
  } else {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
  }


  // ------------------------------------
  // MEJORA 3: Menú de Hamburguesa (NUEVO)
  // ------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('#nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link'); 

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
    
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
      });
    });
    
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    }
  }


  // ------------------------------------
  // MEJORA 4: Intersection Observer (¡CORREGIDO!)
  // ------------------------------------
  
  // ¡AQUÍ ESTABA EL ERROR #1!
  // Faltaba la clase ".scroll-fade"
  const observedElements = document.querySelectorAll('.scroll-reveal, .counter, .scroll-fade');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      
      // ¡AQUÍ ESTABA EL ERROR #2!
      // Corregido de "isTIntersecting" a "isIntersecting"
      if (entry.isIntersecting) { 
        
        // Caso 1: Elemento con 'scroll-reveal'
        if (entry.target.classList.contains('scroll-reveal')) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
        
        // ¡Y AQUÍ FALTABA ESTA LÓGICA!
        // Caso 2: Elemento con 'scroll-fade' (para el Hero)
        if (entry.target.classList.contains('scroll-fade')) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
        
        // Caso 3: Elemento con 'counter'
        if (entry.target.classList.contains('counter')) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.15 });

  observedElements.forEach(el => observer.observe(el));

  // Función del contador
  const runCounter = (el) => {
    const target = +el.getAttribute('data-value');
    const speed = 80;
    
    const update = () => {
      const val = +el.innerText;
      const inc = Math.ceil(target / speed);
      
      if (val < target) {
        el.innerText = Math.min(val + inc, target);
        setTimeout(update, 25);
      } else {
        el.innerText = target;
      }
    };
    update();
  };
  
  // ------------------------------------
  // MEJORA 5: Envío de Formulario con AJAX (Fetch)
  // ------------------------------------
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    const submitButton = contactForm.querySelector('.btn-primary');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      submitButton.classList.add('loading');
      
      const formData = new FormData(contactForm);
      
      try {
        const response = await fetch('process.php', {
          method: 'POST',
          body: formData
        });

        if (response.ok && response.url.includes('status=success')) {
          contactForm.classList.add('sent');
          contactForm.querySelectorAll('input, textarea').forEach(el => el.disabled = true);
        } else {
          throw new Error('Respuesta de servidor no fue exitosa. Revisa process.php');
        }
        
      } catch (error) {
        console.error('Error en el envío:', error);
        alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.');
      } finally {
        if (!contactForm.classList.contains('sent')) {
           submitButton.classList.remove('loading');
        }
      }
    });
  }

}); // Fin de DOMContentLoaded