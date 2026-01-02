// contact-form.js - Validação e envio do formulário de contato

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }

    // Validação em tempo real
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('input', validateMessage);

    // Submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar todos os campos
        if (!validateName() || !validateEmail() || !validateMessage()) {
            showStatus('Por favor, corrija os erros no formulário.', 'error');
            return;
        }

        // Desabilitar botão e mostrar loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
            </span>
        `;

        // Coletar dados do formulário
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        try {
            // OPÇÃO 1: Usar Formspree (Recomendado - Gratuito até 50 envios/mês)
            // Cadastre-se em https://formspree.io/ e substitua YOUR_FORM_ID
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showStatus(
                    '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.',
                    'success'
                );
                form.reset();
            } else {
                throw new Error('Erro ao enviar formulário');
            }

            // OPÇÃO 2: Enviar para seu backend (quando estiver pronto)
            /*
            const response = await fetch('https://api.nutrofit.com.br/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            */

            // OPÇÃO 3: Usar EmailJS (também gratuito)
            // Ver instruções abaixo

        } catch (error) {
            console.error('Erro:', error);
            showStatus(
                '❌ Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato via email.',
                'error'
            );
        } finally {
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar Mensagem';
        }
    });

    // Funções de validação
    function validateName() {
        const name = nameInput.value.trim();
        
        if (name.length < 3) {
            setError(nameInput, 'Nome deve ter pelo menos 3 caracteres');
            return false;
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
            setError(nameInput, 'Nome deve conter apenas letras');
            return false;
        }
        
        setSuccess(nameInput);
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            setError(emailInput, 'Email inválido');
            return false;
        }
        
        setSuccess(emailInput);
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        const charCount = message.length;
        
        if (charCount < 20) {
            setError(messageInput, `Mensagem muito curta (${charCount}/20 caracteres)`);
            return false;
        }
        
        if (charCount > 1000) {
            setError(messageInput, 'Mensagem muito longa (máximo 1000 caracteres)');
            return false;
        }
        
        setSuccess(messageInput);
        return true;
    }

    // Helpers de UI
    function setError(input, message) {
        const parent = input.parentElement;
        input.classList.add('border-red-500');
        input.classList.remove('border-green-500');
        
        // Remove mensagem de erro antiga
        const oldError = parent.querySelector('.error-message');
        if (oldError) oldError.remove();
        
        // Adiciona nova mensagem de erro
        const errorDiv = document.createElement('p');
        errorDiv.className = 'error-message text-red-600 text-sm mt-1';
        errorDiv.textContent = message;
        parent.appendChild(errorDiv);
    }

    function setSuccess(input) {
        input.classList.remove('border-red-500');
        input.classList.add('border-green-500');
        
        const parent = input.parentElement;
        const oldError = parent.querySelector('.error-message');
        if (oldError) oldError.remove();
    }

    function showStatus(message, type) {
        formStatus.classList.remove('hidden');
        
        if (type === 'success') {
            formStatus.className = 'bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg';
        } else {
            formStatus.className = 'bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg';
        }
        
        formStatus.textContent = message;
        
        // Scroll para a mensagem
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Esconder após 5 segundos (se for sucesso)
        if (type === 'success') {
            setTimeout(() => {
                formStatus.classList.add('hidden');
            }, 5000);
        }
    }
});

/* ===============================================
   INSTRUÇÕES PARA CONFIGURAR O ENVIO DE EMAIL
   ===============================================

   OPÇÃO 1: FORMSPREE (Mais Fácil - Recomendado)
   ----------------------------------------------
   1. Cadastre-se em: https://formspree.io/
   2. Crie um novo form
   3. Copie o endpoint (https://formspree.io/f/xyzabc123)
   4. Substitua 'YOUR_FORM_ID' na linha 56
   5. Pronto! Os emails chegarão no seu email cadastrado

   OPÇÃO 2: SEU PRÓPRIO BACKEND (Django)
   --------------------------------------
   Quando criar a API Django, use:
   
   fetch('https://api.nutrofit.com.br/api/contact/', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'X-CSRFToken': getCookie('csrftoken')
       },
       body: JSON.stringify(formData)
   });

   =============================================== */