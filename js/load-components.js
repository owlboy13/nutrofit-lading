// Função para carregar componentes HTML
async function loadComponent(componentName, targetId) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) throw new Error(`Erro ao carregar ${componentName}`);
        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;
    } catch (error) {
        console.error(`Erro ao carregar componente ${componentName}:`, error);
    }
}

// Carregar todos os componentes na ordem
async function loadAllComponents() {
    const components = [
        { name: 'navbar', target: 'navbar' },
        { name: 'hero', target: 'hero' },
        { name: 'stats', target: 'stats' },
        { name: 'features', target: 'features' },
        { name: 'how', target: 'how' },
        { name: 'pricing', target: 'pricing' },
        { name: 'feedbacks', target: 'feedbacks' },
        { name: 'faq', target: 'faq' },
        { name: 'cta', target: 'cta' },
        { name: 'footer', target: 'footer' }
    ];

    // Carrega todos os componentes em paralelo
    await Promise.all(
        components.map(comp => loadComponent(comp.name, comp.target))
    );

    // Dispara evento quando tudo estiver carregado
    document.dispatchEvent(new Event('componentsLoaded'));
}

// Executa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
    loadAllComponents();
}