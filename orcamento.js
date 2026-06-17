// orcamento.js

// Phone Mask Logic
const countryCode = document.getElementById('countryCode');
const telefone = document.getElementById('telefone');

const masks = {
  br: (v) => {
    v = v.replace(/\D/g,"");
    v = v.replace(/^(\d{2})(\d)/g,"($1) $2");
    v = v.replace(/(\d)(\d{4})$/,"$1-$2");
    return v;
  },
  us: (v) => {
    v = v.replace(/\D/g,"");
    v = v.replace(/^(\d{3})(\d)/g,"($1) $2");
    v = v.replace(/(\d{3})(\d{4})$/,"$1-$2");
    return v;
  },
  es: (v) => {
    v = v.replace(/\D/g,"");
    v = v.replace(/^(\d{3})(\d{2})(\d{2})(\d{2})$/,"$1 $2 $3 $4");
    return v;
  }
};

const placeholders = {
  br: "(11) 99999-9999",
  us: "(555) 555-5555",
  es: "600 00 00 00"
};

countryCode.addEventListener('change', (e) => {
  const code = e.target.value;
  telefone.placeholder = placeholders[code];
  telefone.value = masks[code](telefone.value);
});

telefone.addEventListener('input', (e) => {
  const code = countryCode.value;
  e.target.value = masks[code](e.target.value);
});

// Translation Data
const orcTranslations = {
  "pt-br": {
    "orc_title": "Estamos felizes pela sua confiança em nossos trabalhos.",
    "orc_subtitle": "Por favor, preencha o formulário ao lado para darmos seguimento.",
    "orc_nome": "Nome",
    "orc_email": "Email corporativo",
    "orc_telefone": "Telefone",
    "orc_porte": "Porte da empresa",
    "orc_p1": "1-50 funcionários",
    "orc_p2": "50-200 funcionários",
    "orc_p3": "200-1000 funcionários",
    "orc_p4": "1000-5000 funcionários",
    "orc_p5": "5000+ funcionários",
    "orc_verba": "Verba disponível para projeto",
    "orc_briefing": "Qual o briefing do projeto? Descreva os detalhes.",
    "orc_enviar": "Enviar Formulário"
  },
  "en": {
    "orc_title": "We are happy for your trust in our work.",
    "orc_subtitle": "Please fill out the form beside to proceed.",
    "orc_nome": "Name",
    "orc_email": "Corporate Email",
    "orc_telefone": "Phone",
    "orc_porte": "Company Size",
    "orc_p1": "1-50 employees",
    "orc_p2": "50-200 employees",
    "orc_p3": "200-1000 employees",
    "orc_p4": "1000-5000 employees",
    "orc_p5": "5000+ employees",
    "orc_verba": "Available budget for the project",
    "orc_briefing": "What is the project briefing? Describe the details.",
    "orc_enviar": "Submit Form"
  },
  "es": {
    "orc_title": "Estamos felices por su confianza en nuestro trabajo.",
    "orc_subtitle": "Por favor, complete el formulario al lado para continuar.",
    "orc_nome": "Nombre",
    "orc_email": "Correo corporativo",
    "orc_telefone": "Teléfono",
    "orc_porte": "Tamaño de la empresa",
    "orc_p1": "1-50 empleados",
    "orc_p2": "50-200 empleados",
    "orc_p3": "200-1000 empleados",
    "orc_p4": "1000-5000 empleados",
    "orc_p5": "5000+ empleados",
    "orc_verba": "Presupuesto disponible para el proyecto",
    "orc_briefing": "¿Cuál es el briefing del proyecto? Describa los detalles.",
    "orc_enviar": "Enviar Formulario"
  }
};

// Initialize Language from localStorage if set
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('horizon_lang') || 'pt-br';
    const dict = orcTranslations[savedLang];
    
    if (dict) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerHTML = dict[key];
            }
        });
        
        // Setup initial phone code based on lang
        if(savedLang === 'en') countryCode.value = 'us';
        else if(savedLang === 'es') countryCode.value = 'es';
        else countryCode.value = 'br';
        
        telefone.placeholder = placeholders[countryCode.value];
    }
});

document.getElementById('orcamentoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.submit-btn');
    
    // Captura o texto original do botão e muda para estado de carregamento
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Enviando...';
    btn.style.opacity = '0.5';
    btn.disabled = true;

    // Remove os () e espaços do DDI para formatar melhor
    const countryCode = document.getElementById('countryCode');
    const selectedDDI = countryCode.options[countryCode.selectedIndex].text.split(' ')[1];
    const telefone = document.getElementById('telefone').value;

    const formData = new FormData(form);
    // Substituir os campos separados por um telefone unificado
    formData.delete('Codigo_Pais');
    formData.delete('Telefone');
    formData.append('Telefone_Completo', `${selectedDDI} ${telefone}`);
    
    // Configurações ocultas pro FormSubmit
    formData.append('_subject', 'Novo Orçamento - Horizon Studios');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

    try {
        const response = await fetch("https://formsubmit.co/ajax/horizonstudiosgroup@gmail.com", {
            method: "POST",
            headers: { 
                'Accept': 'application/json'
            },
            body: formData
        });

        if (response.ok) {
            alert('Formulário enviado com sucesso! Nossa equipe entrará em contato em breve.');
            window.location.href = 'index.html';
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        alert('Ocorreu um erro ao enviar. Por favor, verifique sua conexão com a internet e tente novamente.');
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.disabled = false;
    }
});
