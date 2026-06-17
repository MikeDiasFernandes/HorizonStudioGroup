gsap.registerPlugin(ScrollTrigger);

// Force scroll to top left on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    document.querySelectorAll('.vertical-scroll-container').forEach(el => {
        el.scrollTop = 0;
    });
});

// Hero Video Reel Logic (Cycle every 7 seconds)
const heroVideos = document.querySelectorAll('.hero-video');
if (heroVideos.length > 1) {
    let currentVideoIndex = 0;
    setInterval(() => {
        heroVideos[currentVideoIndex].classList.remove('active');
        currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;
        heroVideos[currentVideoIndex].currentTime = 0;
        heroVideos[currentVideoIndex].classList.add('active');
    }, 7000);
}
// Lock scroll during intro
document.body.style.overflow = "hidden";

// Set initial cinematic state is now handled natively in CSS (to prevent FOUC load glitch)
// We also set it in GSAP to ensure the animation engine tracks it properly for interpolation
gsap.set(".hero", { 
  clipPath: "inset(49.5% 48% 49.5% 48% round 32px)",
  opacity: 0
});
gsap.set(".hero-video", { filter: "brightness(0.2)", scale: 1.1 });

// Loader counter GSAP
gsap.to({ value: 0 }, {
  value: 100,
  duration: 2.5,
  ease: "power3.inOut",
  onUpdate: function() {
    const counter = document.querySelector('.loader-counter');
    if (counter) counter.textContent = Math.round(this.targets()[0].value) + "%";
  }
});

const tl = gsap.timeline();

// Wait for CSS loader bar to finish (2.5s), then fade out loader smoothly
tl.to(".loader", {
  duration: 1.2,
  opacity: 0,
  delay: 2.5,
  ease: "power2.inOut",
  onComplete: () => {
    document.querySelector(".loader").style.display = "none";
  }
})
// Cinematic TV Turn On (Fluid Proxy Object to allow perfect overlaps without crashes)
const heroClip = { v: 49.5, h: 48 };

// Fade in the black screen first
tl.to(".hero", { duration: 0.5, opacity: 1, ease: "none" }, "-=1.0")
// Step 1: Expand into a horizontal cinematic line smoothly
.to(heroClip, {
  duration: 1.4,
  h: 4,
  ease: "power3.inOut",
  onUpdate: () => {
    const el = document.querySelector(".hero");
    if (el) {
      el.style.clipPath = `inset(${heroClip.v}% ${heroClip.h}% ${heroClip.v}% ${heroClip.h}% round 32px)`;
      el.style.webkitClipPath = `inset(${heroClip.v}% ${heroClip.h}% ${heroClip.v}% ${heroClip.h}% round 32px)`;
    }
  }
}, "-=1.0")
// Step 2: Smoothly open vertically (Overlapping beautifully)
.to(heroClip, {
  duration: 2.2,
  v: 6,
  ease: "power4.inOut",
  onUpdate: () => {
    const el = document.querySelector(".hero");
    if (el) {
      el.style.clipPath = `inset(${heroClip.v}% ${heroClip.h}% ${heroClip.v}% ${heroClip.h}% round 32px)`;
      el.style.webkitClipPath = `inset(${heroClip.v}% ${heroClip.h}% ${heroClip.v}% ${heroClip.h}% round 32px)`;
    }
  }
}, "-=0.8")
// Bloom video to cinematic dark and pull camera back
.to(".hero-video", {
  duration: 2.5,
  scale: 1,
  filter: "brightness(0.55)",
  ease: "power2.out"
}, "-=1.8")
.add(() => {
  const animateElem = document.getElementById("animate");
  if (animateElem) animateElem.classList.add("run-animation");
}, "-=0.5")
.add(() => {
  // Fade in the top nav menu when the logo animation is done
  gsap.to(".hero-nav", { opacity: 1, duration: 1.5, ease: "power2.out" });
  
  // Unlock scroll
  document.body.style.overflow = "";
  document.body.style.overflowX = "hidden";
}, "+=2");

// 1. Animate about section (triggered by horizontal scroll of its container)
gsap.from(".about-content > *", {
  scrollTrigger: {
    trigger: ".vertical-scroll-container",
    horizontal: true,
    start: "left 70%",
    toggleActions: "play none none reverse"
  },
  duration: 1.2,
  opacity: 0,
  y: 30,
  stagger: 0.2,
  ease: "power3.out"
});

// 2. Animate services section title
gsap.fromTo(".services-header-title", 
  { x: "100vw", opacity: 0 }, 
  {
    x: 0,
    opacity: 1,
    scrollTrigger: {
      trigger: ".services-section",
      scroller: ".vertical-scroll-container",
      start: "top 90%",
      end: "top 20%",
      scrub: 1.5
    }
  }
);

// 3. Animations for main scrollable articles
gsap.utils.toArray(".blog-header").forEach((header) => {
  let videoContent = header.querySelector(".blog-article video");
  let textContent = header.querySelector(".blog-article h2");
  let bigTitle = header.querySelector(".blog-big__title");

  // Animate video scaling up
  if (videoContent) {
    gsap.from(videoContent, {
      scrollTrigger: {
        trigger: header,
        horizontal: true,
        start: "left 70%",
        toggleActions: "play none none reverse"
      },
      duration: 1.2,
      scale: 0.85,
      opacity: 0,
      ease: "expo.out"
    });
  }

  // Animate h2 title
  if (textContent) {
    gsap.from(textContent, {
      scrollTrigger: {
        trigger: header,
        horizontal: true,
        start: "left 70%",
        toggleActions: "play none none reverse"
      },
      duration: 1,
      y: 40,
      opacity: 0,
      ease: "power3.out",
      delay: 0.2
    });
  }
  
  // Animate the big left-side title
  if (bigTitle) {
      gsap.from(bigTitle, {
      scrollTrigger: {
        trigger: header,
        horizontal: true,
        start: "left 70%",
        toggleActions: "play none none reverse"
      },
      duration: 1,
      x: -60,
      opacity: 0,
      ease: "power3.out",
      delay: 0.1
    });
  }
});

// 3. Fade in right side list items
gsap.utils.toArray(".blog-right-container").forEach((container) => {
  gsap.from(container, {
    scrollTrigger: {
      trigger: container,
      horizontal: true,
      start: "left 95%",
      toggleActions: "play none none reverse"
    },
    duration: 0.8,
    x: 40,
    opacity: 0,
    ease: "power2.out"
  });
});

// 4. Subtle rotation for the bottom circle on scroll
gsap.to(".circle", {
  scrollTrigger: {
    trigger: ".circle",
    horizontal: true,
    start: "left right",
    end: "right left",
    scrub: 1
  },
  rotation: 180,
  ease: "none"
});

// Translations
const translations = {
  "pt-br": {
    "sobre": "Sobre", "servicos": "Serviços", "email": "Email", "orcamento": "Solicite Orçamento",
    "inicio": `Inicio<svg fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up-right" viewBox="0 0 24 24"><path d="M7 17L17 7M7 7h10v10" /></svg>`,
    "studio": "Studio", "contato": "Contato", "fale_conosco": "Fale Conosco",
    "about_label": "Quem Somos",
    "about_title": "Excelência audiovisual e criatividade sem limites.",
    "about_text": "Somos uma produtora focada em excelência técnica e narrativa visual. Valorizamos a estética audiovisual, a criatividade autêntica e a meticulosidade em tudo o que engloba nossos projetos, entregando resultados dignos de grandes estúdios.",
    "servicos_1": "Filmes Publicitários", "servicos_2": "Cobertura de Eventos", "servicos_3": "Vídeos Institucionais", "servicos_4": "Gaming e Tech",
    "servicos_1_desc": "Para marcas e campanhas de alto impacto visual.", "servicos_2_desc": "Registros dinâmicos para shows, festivais e eventos privados.", "servicos_3_desc": "Narrativas visuais para posicionamento de empresas.", "servicos_4_desc": "Conteúdo para gamers e Streamers.",
    "servicos_title": "Entregamos no formato que você precisa",
    "studio_title": "Estúdio independente com estrutura completa",
    "studio_desc": "Preparados para gravações e edições de alto nível, com desenvolvimento de propriedade visual, branding, design e marketing, entregando valor para sua marca.",
    "footer_cta": "Vamos criar algo incrível juntos.", "footer_btn": "Iniciar Projeto", "footer_copy": "© 2026 Todos os direitos reservados.", "footer_about": "Somos um estúdio full-service atuante desde 2016. Desenvolvemos narrativas visuais e propriedades estéticas de alto impacto para marcas que desejam se destacar no mercado global.",
    "desc_horizon": `<br> <br>Studio focado em propriedade visual, branding, design e marketing, entregando soluções digitais para empresas.<br> <br> <br>.`,
    "h2_tecnico": "Conteúdos de<span> trabalhos</span> Técnicos", "case_1": "Case 1", "p_tecnico": "Foco em apresentação de trabalhos profissionais, trazendo em foco os processos e domínio técnico .", "ver_projeto": "Ver projeto",
    "h2_food": "Ramo <span>Alimentício</span>", "case": "Case", "p_food": "Tapes e edições para apresentações alimentícias.",
    "h2_musicais": "Produções <span>Musicais</span>", "case_study": "Case Study", "p_musicais": "Captura e edição audiovisual de produções de grande porte.",
    "h2_artisticos": "Captura de <span>trabalhos</span> artisticos", "p_artisticos": "Equipe especializada em capturas e edições de trabalhos artísticos.",
    "h2_streamers": "Edições <span>para</span> Streamers", "p_streamers": "Captura de gameplays e edições para gamers e streamers",
    "h2_vitrine": "Edições <span>para</span> vitrine online", "p_vitrine": "Captura e edição de video e fotos para exposição de marcas.",
    "h2_midias": "Mídias <span>Socias</span>", "p_midias": "Direcionamento e produção de conteúdo para mídias socias.",
    "h2_influencers": "Conteúdo para <span>Influencers</span>", "p_influencers": "Projetado para administradores de sistemas, oferece visibilidade total de produção, fluxos de trabalho e métricas.",
    "mq_1": "Experiências Digitais Inovadoras", "mq_2": "Alavancagem de negócio", "mq_3": "Construindo o futuro",
    "right_title": "Serviços & Soluções", "ver_mais": "Ver mais",
    "r_title_1": "Captura de Audio / Vídeo", "r_sub_1": "Captura de material em campo.",
    "r_title_2": "Edição Audiovisual", "r_sub_2": "Ferramentas de alto nível para resultados de qualidade.",
    "r_title_3": "Luxury E-Commerce", "r_sub_3": "Estrutura premium para marcas de alto padrão.",
    "r_title_4": "AI Analytics Platform", "r_sub_4": "Integração de inteligência para tomadas de decisão.",
    "r_title_5": "Crypto Web3 Wallet", "r_sub_5": "Segurança e design minimalista em blockchain.",
    "r_title_6": "Logistics Control Panel", "r_sub_6": "Software de controle logístico ponta-a-ponta.",
    "circle_title": "Comece Seu Projeto", "circle_sub": "Vamos construir algo excepcional juntos. Entre em contato com a equipe."
  },
  "en": {
    "sobre": "About", "servicos": "Services", "email": "Email", "orcamento": "Request a Quote",
    "inicio": `Home<svg fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up-right" viewBox="0 0 24 24"><path d="M7 17L17 7M7 7h10v10" /></svg>`,
    "studio": "Studio", "contato": "Contact", "fale_conosco": "Contact Us",
    "about_label": "About Us",
    "about_title": "Audiovisual excellence and limitless creativity.",
    "about_text": "We are a production company focused on technical excellence and visual storytelling. We value audiovisual aesthetics, authentic creativity, and meticulousness in everything our projects encompass, delivering results worthy of major studios.",
    "servicos_1": "Commercial Films", "servicos_2": "Event Coverage", "servicos_3": "Corporate Videos", "servicos_4": "Gaming & Tech",
    "servicos_1_desc": "For brands and high visual impact campaigns.", "servicos_2_desc": "Dynamic records for concerts, festivals and private events.", "servicos_3_desc": "Visual narratives for company positioning.", "servicos_4_desc": "Content for gamers and streamers.",
    "servicos_title": "We deliver in the format you need",
    "studio_title": "Independent studio with complete structure",
    "studio_desc": "Prepared for high-level recordings and editing, with the development of visual property, branding, design and marketing, delivering value to your brand.",
    "footer_cta": "Let's create something amazing together.", "footer_btn": "Start Project", "footer_copy": "© 2026 All rights reserved.", "footer_about": "We are a full-service studio operating since 2016. We develop visual narratives and high-impact aesthetic properties for brands that wish to stand out in the global market.",
    "desc_horizon": `<br> <br>Studio focused on visual property, branding, design and marketing, delivering digital solutions for companies.<br> <br> <br>.`,
    "h2_tecnico": "Technical <span>work</span> content", "case_1": "Case 1", "p_tecnico": "Focus on presenting professional work, highlighting processes and technical mastery.", "ver_projeto": "See Project",
    "h2_food": "Food <span>Industry</span>", "case": "Case", "p_food": "Tapes and edits for food presentations.",
    "h2_musicais": "Musical <span>Productions</span>", "case_study": "Case Study", "p_musicais": "Audiovisual capture and editing of large-scale productions.",
    "h2_artisticos": "Capture of <span>artistic</span> works", "p_artisticos": "Team specialized in capturing and editing artistic works.",
    "h2_streamers": "Edits <span>for</span> Streamers", "p_streamers": "Gameplay capture and editing for gamers and streamers",
    "h2_vitrine": "Edits <span>for</span> online stores", "p_vitrine": "Video and photo capture and editing for brand exposure.",
    "h2_midias": "Social <span>Media</span>", "p_midias": "Content direction and production for social media.",
    "h2_influencers": "Content for <span>Influencers</span>", "p_influencers": "Designed for system administrators, offering complete visibility over workflows and metrics.",
    "mq_1": "Innovative Digital Experiences", "mq_2": "Business Leverage", "mq_3": "Building the future",
    "right_title": "Services & Solutions", "ver_mais": "See more",
    "r_title_1": "Audio / Video Capture", "r_sub_1": "Field material capture.",
    "r_title_2": "Audiovisual Editing", "r_sub_2": "High-level tools for quality results.",
    "r_title_3": "Luxury E-Commerce", "r_sub_3": "Premium structure for high-end fashion brands.",
    "r_title_4": "AI Analytics Platform", "r_sub_4": "Intelligence integration for decision making.",
    "r_title_5": "Crypto Web3 Wallet", "r_sub_5": "Security and minimalist design in blockchain.",
    "r_title_6": "Logistics Control Panel", "r_sub_6": "End-to-end supply chain management software.",
    "circle_title": "Start A Project", "circle_sub": "Let's build something exceptional together. Get in touch with our team."
  },
  "es": {
    "sobre": "Acerca", "servicos": "Servicios", "email": "Correo", "orcamento": "Pedir Presupuesto",
    "inicio": `Inicio<svg fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up-right" viewBox="0 0 24 24"><path d="M7 17L17 7M7 7h10v10" /></svg>`,
    "studio": "Estudio", "contato": "Contacto", "fale_conosco": "Contáctanos",
    "about_label": "Quiénes Somos",
    "about_title": "Excelencia audiovisual y creatividad sin límites.",
    "about_text": "Somos una productora enfocada en la excelencia técnica y la narrativa visual. Valoramos la estética audiovisual, la creatividad auténtica y la meticulosidad en todo lo que abarcan nuestros proyectos, entregando resultados dignos de grandes estudios.",
    "servicos_1": "Películas Publicitarias", "servicos_2": "Cobertura de Eventos", "servicos_3": "Videos Institucionales", "servicos_4": "Gaming y Tech",
    "servicos_1_desc": "Para marcas y campañas de alto impacto visual.", "servicos_2_desc": "Registros dinámicos para conciertos, festivales y eventos privados.", "servicos_3_desc": "Narrativas visuales para el posicionamiento de empresas.", "servicos_4_desc": "Contenido para gamers y streamers.",
    "servicos_title": "Entregamos en el formato que necesitas",
    "studio_title": "Estudio independiente con estructura completa",
    "studio_desc": "Preparados para grabaciones y ediciones de alto nivel, con desarrollo de propiedad visual, branding, diseño y marketing, entregando valor a su marca.",
    "footer_cta": "Vamos a crear algo increíble juntos.", "footer_btn": "Iniciar Proyecto", "footer_copy": "© 2026 Todos los derechos reservados.", "footer_about": "Somos un estudio de servicio completo activo desde 2016. Desarrollamos narrativas visuales y propiedades estéticas de alto impacto para marcas que desean destacarse en el mercado global.",
    "desc_horizon": `<br> <br>Estudio enfocado en propiedad visual, branding, diseño y marketing, entregando soluciones digitales para empresas.<br> <br> <br>.`,
    "h2_tecnico": "Contenidos <span>de trabajos</span> Técnicos", "case_1": "Caso 1", "p_tecnico": "Enfoque en la presentación de trabajos profesionales, destacando los procesos y el dominio técnico.", "ver_projeto": "Ver Proyecto",
    "h2_food": "Sector <span>Alimentario</span>", "case": "Caso", "p_food": "Cintas y ediciones para presentaciones alimentarias.",
    "h2_musicais": "Producciones <span>Musicales</span>", "case_study": "Estudio de Caso", "p_musicais": "Captura y edición audiovisual de producciones a gran escala.",
    "h2_artisticos": "Captura de <span>trabajos</span> artísticos", "p_artisticos": "Equipo especializado en capturas y ediciones de trabajos artísticos.",
    "h2_streamers": "Ediciones <span>para</span> Streamers", "p_streamers": "Captura de gameplays y ediciones para gamers y streamers",
    "h2_vitrine": "Ediciones <span>para</span> escaparates online", "p_vitrine": "Captura y edición de video y fotos para exposición de marcas.",
    "h2_midias": "Redes <span>Sociales</span>", "p_midias": "Dirección y producción de contenido para redes sociales.",
    "h2_influencers": "Contenido para <span>Influencers</span>", "p_influencers": "Diseñado para administradores, ofreciendo visibilidad completa sobre flujos de trabajo y métricas.",
    "mq_1": "Experiencias Digitales Innovadoras", "mq_2": "Apalancamiento de Negocios", "mq_3": "Construyendo el futuro",
    "right_title": "Servicios y Soluciones", "ver_mais": "Ver más",
    "r_title_1": "Captura de Audio / Video", "r_sub_1": "Captura de material de campo.",
    "r_title_2": "Edición Audiovisual", "r_sub_2": "Herramientas de alto nivel para resultados de calidad.",
    "r_title_3": "E-Commerce de Lujo", "r_sub_3": "Estructura premium para marcas de alta gama.",
    "r_title_4": "Plataforma AI Analytics", "r_sub_4": "Integración de inteligencia para la toma de decisiones.",
    "r_title_5": "Billetera Crypto Web3", "r_sub_5": "Seguridad y diseño minimalista en blockchain.",
    "r_title_6": "Panel de Control Logístico", "r_sub_6": "Software de gestión de la cadena de suministro de extremo a extremo.",
    "circle_title": "Empieza un Proyecto", "circle_sub": "Construyamos algo excepcional juntos. Póngase en contacto con el equipo."
  }
};

function updateBtnText(text) {
  const container = document.querySelector('.nav-btn-text');
  container.innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i] === ' ' ? '&nbsp;' : text[i];
    const span = document.createElement('span');
    span.innerHTML = char;
    container.appendChild(span);
  }
}

// Language selector click logic
const langSelector = document.querySelector('.lang-selector');
if (langSelector) {
  langSelector.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-dropdown')) {
      langSelector.classList.toggle('open');
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-selector')) {
      langSelector.classList.remove('open');
    }
  });
}

document.querySelectorAll('.lang-option').forEach(option => {
  option.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Close dropdown
    if (langSelector) langSelector.classList.remove('open');

    // Update active class
    document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
    
    // Update main icon
    const flagSrc = this.querySelector('img').src;
    const flagAlt = this.querySelector('img').alt;
    const currentFlag = document.querySelector('.lang-current img');
    currentFlag.src = flagSrc;
    currentFlag.alt = flagAlt;

    // Translate content
    const lang = this.dataset.lang;
    const dict = translations[lang];

    if(dict) {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          if(key === 'orcamento') {
             updateBtnText(dict[key]);
          } else {
             el.innerHTML = dict[key];
          }
        }
      });
    }
  });
});

// Custom Fluid Scroll Snapping
let animationFrameId = null;
let verticalAnimationFrameId = null;
let scrollTimeout;
let lastHorizontalScrollTime = 0;
let lastVerticalScrollTime = 0;
let globalActiveVerticalContainer = null;

// Performance: Video Lazy Playing (CPU/Memory Optimization)
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.play().catch(e => console.log('Autoplay prevented:', e));
    } else {
      entry.target.pause();
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-video').forEach(video => {
  videoObserver.observe(video);
});

window.addEventListener('wheel', (e) => {
  if (window.innerWidth <= 900) return; // Disable custom horizontal scroll on mobile

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (verticalAnimationFrameId) {
    cancelAnimationFrame(verticalAnimationFrameId);
    verticalAnimationFrameId = null;
  }

  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    // 1. Check if the viewport is currently parked at ANY vertical container
    let activeVertical = null;
    document.querySelectorAll('.vertical-scroll-container').forEach(container => {
      const rect = container.getBoundingClientRect();
      if (Math.abs(rect.left) < 10) {
        activeVertical = container;
      }
    });

    if (activeVertical) {
      // We are parked on a vertical container.
      // Horizontal Inertia Shield: Wait 500ms after horizontal scrolling before allowing vertical dive
      if (Date.now() - lastHorizontalScrollTime > 500) {
        const isAtBottom = Math.ceil(activeVertical.scrollHeight - activeVertical.scrollTop) <= activeVertical.clientHeight + 1;
        const isAtTop = activeVertical.scrollTop <= 0;
        
        let canScrollY = false;
        let hitBoundary = false;

        if (e.deltaY > 0) { // Scrolling down
          if (!isAtBottom) canScrollY = true;
          else hitBoundary = true;
        } else if (e.deltaY < 0) { // Scrolling up
          if (!isAtTop) canScrollY = true;
          else hitBoundary = true;
        }

        if (canScrollY) {
          lastVerticalScrollTime = Date.now();
          
          // If the mouse is hovering over a fixed element (like the header) outside the container,
          // the native scroll won't work on the container. We must manually scroll it.
          if (!activeVertical.contains(e.target)) {
            e.preventDefault();
            activeVertical.scrollTop += e.deltaY;
          }
          return; // Allow native or manual vertical scroll
        } else if (hitBoundary) {
          // Vertical Breakout Shield
          if (Date.now() - lastVerticalScrollTime < 600) {
            e.preventDefault(); 
            return; 
          }
        }
      } else {
        // Still within horizontal inertia cooldown
        e.preventDefault();
        return;
      }
    }

    // Horizontal scroll execution (Only happens if NOT parked on a vertical column, or if broke out of boundary)
    e.preventDefault();
    lastHorizontalScrollTime = Date.now();
    window.scrollBy({ left: e.deltaY, behavior: 'auto' });
  }
}, { passive: false });

window.addEventListener('scroll', () => {
  if (animationFrameId || verticalAnimationFrameId) return; // Ignore if currently animating
  clearTimeout(scrollTimeout);
  
  scrollTimeout = setTimeout(() => {
    const snapTargets = Array.from(document.querySelectorAll('.hero, .vertical-scroll-container, .blog-header, .blog-right-container'));
    let closest = null;
    let minDistance = Infinity;
    
    snapTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      const distance = Math.abs(rect.left);
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = target;
      }
    });
    
    if (closest && minDistance > 10) {
      const targetX = window.scrollX + closest.getBoundingClientRect().left;
      smoothSnapTo(targetX, 1000); // 1000ms duration for slow fluid snap
    }
  }, 250); // wait 250ms after user stops scrolling
});

function smoothSnapTo(targetX, duration) {
  return new Promise(resolve => {
    const startX = window.scrollX;
    const change = targetX - startX;
    
    if (Math.abs(change) < 5) {
      resolve();
      return;
    }

    const startTime = performance.now();
    
    function easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
    
    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      window.scrollTo({ left: startX + change * easeInOutQuart(progress), top: 0, behavior: 'auto' });
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateScroll);
      } else {
        animationFrameId = null;
        resolve();
      }
    }
    
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(animateScroll);
  });
}

function smoothVerticalSnapTo(element, targetY, duration) {
  return new Promise(resolve => {
    const startY = element.scrollTop;
    const change = targetY - startY;
    
    if (Math.abs(change) < 5) {
      resolve();
      return;
    }

    const startTime = performance.now();
    let localAnimId;
    
    function easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      element.scrollTop = startY + change * easeInOutQuart(progress);
      
      if (progress < 1) {
        verticalAnimationFrameId = requestAnimationFrame(animateScroll);
      } else {
        verticalAnimationFrameId = null;
        resolve();
      }
    }

    if (verticalAnimationFrameId) cancelAnimationFrame(verticalAnimationFrameId);
    verticalAnimationFrameId = requestAnimationFrame(animateScroll);
  });
}

// Navigation anchor scrolling mapping
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', async function (e) {
    const targetId = this.getAttribute('href');
    e.preventDefault();
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (verticalAnimationFrameId) {
      cancelAnimationFrame(verticalAnimationFrameId);
      verticalAnimationFrameId = null;
    }

    if (targetId === '#') {
      const verticalParent = document.querySelector('.vertical-scroll-container');
      if (verticalParent) {
        await smoothVerticalSnapTo(verticalParent, 0, 1200);
      }
      smoothSnapTo(0, 1500); 
      return;
    }

    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Check if the target is inside our new vertical column
      const verticalParent = targetElement.closest('.vertical-scroll-container');
      
      if (verticalParent) {
        // 1. Move horizontally to the column first
        const targetX = window.scrollX + verticalParent.getBoundingClientRect().left;
        await smoothSnapTo(targetX, 1500); 
        
        // 2. Then move vertically inside the column to the specific section
        const targetY = targetElement.getBoundingClientRect().top - verticalParent.getBoundingClientRect().top + verticalParent.scrollTop;
        smoothVerticalSnapTo(verticalParent, targetY, 1500);
      } else {
        // Standard horizontal scroll for other pages
        const targetX = window.scrollX + targetElement.getBoundingClientRect().left;
        smoothSnapTo(targetX, 1500); 
      }
    }
  });
});

// Studio Video Carousel
const studioVideos = [
  "assets/0A877CF8-6E3E-4CD5-8418-879BB2A0BBED.MP4",
  "assets/DC671082-404B-4904-8E07-63B5B2DD0542.MP4",
  "assets/IMG_0037.MP4",
  "assets/IMG_0038.MP4",
  "assets/IMG_0039.MP4",
  "assets/IMG_0106.MP4",
  "assets/IMG_0107.MP4",
  "assets/IMG_0109.MP4"
];

let currentVideoIndex = 0;
const videoElement1 = document.querySelector('.studio-video-1');
const videoElement2 = document.querySelector('.studio-video-2');
let isVideo1Active = true;

if (videoElement1 && videoElement2) {
  videoElement1.src = studioVideos[0];
  videoElement1.play();
  
  setInterval(() => {
    currentVideoIndex = (currentVideoIndex + 1) % studioVideos.length;
    const nextSrc = studioVideos[currentVideoIndex];
    
    if (isVideo1Active) {
      videoElement2.src = nextSrc;
      videoElement2.play();
      videoElement2.classList.add('active');
      videoElement1.classList.remove('active');
    } else {
      videoElement1.src = nextSrc;
      videoElement1.play();
      videoElement1.classList.add('active');
      videoElement2.classList.remove('active');
    }
    
    isVideo1Active = !isVideo1Active;
  }, 2000); // Crossfade every 2 seconds
}
