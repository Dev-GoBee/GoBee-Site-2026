// State Management
const appState = {
    currentView: 'leads',
    currentUser: {
        name: 'Giulian Pizzio',
        role: 'Super Admin',
        email: 'giulian.pizzio@gobee.com.br'
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initMockData(); // Initialize localStorage with dummy data if empty
    renderView('leads'); // Default view
});

// View Routing
function renderView(viewName) {
    console.log('Rendering view:', viewName);
    appState.currentView = viewName;
    updateSidebarActiveState(viewName);

    const mainView = document.getElementById('main-view');
    const pageTitle = document.getElementById('page-title');

    if (!mainView) {
        console.error('Critical Error: #main-view not found');
        return;
    }

    // Show loading state
    mainView.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400"><div class="animate-spin mb-4 text-gobee-rose"><i data-lucide="loader-2" class="w-8 h-8 mx-auto"></i></div></div>';

    try {
        if (window.lucide) lucide.createIcons();
    } catch (e) { console.warn('Lucide icons failed to load initially', e); }

    setTimeout(() => {
        try {
            switch (viewName) {
                case 'leads':
                    if (pageTitle) pageTitle.textContent = 'CRM de Vendas';
                    if (window.renderLeadsView) window.renderLeadsView(mainView);
                    else throw new Error('renderLeadsView not found');
                    break;
                case 'inquiries':
                    if (pageTitle) pageTitle.textContent = 'Central de Dúvidas';
                    if (window.renderInquiriesView) window.renderInquiriesView(mainView);
                    else throw new Error('renderInquiriesView not found');
                    break;
                case 'integrations':
                    if (pageTitle) pageTitle.textContent = 'Integrações';
                    if (window.renderIntegrationsView) window.renderIntegrationsView(mainView);
                    else throw new Error('renderIntegrationsView not found');
                    break;
                case 'settings':
                    if (pageTitle) pageTitle.textContent = 'Configurações Gerais';
                    if (window.renderSettingsView) window.renderSettingsView(mainView);
                    else throw new Error('renderSettingsView not found');
                    break;
                case 'team':
                    if (pageTitle) pageTitle.textContent = 'Gerenciamento de Equipe';
                    if (window.renderTeamView) window.renderTeamView(mainView);
                    else throw new Error('renderTeamView not found');
                    break;
                default:
                    mainView.innerHTML = '<p class="text-center text-red-500 mt-10">Página não encontrada.</p>';
            }
            if (window.lucide) lucide.createIcons();
        } catch (err) {
            console.error('Error rendering view:', err);
            mainView.innerHTML = `<div class="text-center text-red-500 mt-10">
                <p class="font-bold">Erro ao carregar módulo</p>
                <p class="text-sm">${err.message}</p>
            </div>`;
        }
    }, 100);
}

function updateSidebarActiveState(viewName) {
    const nav = document.getElementById('top-nav');
    if (!nav) return;

    nav.querySelectorAll('a').forEach(link => {
        link.classList.remove('text-white', 'bg-white/10');
        link.classList.add('text-gray-300');
    });

    const activeLink = document.getElementById(`nav-${viewName}`);
    if (activeLink) {
        activeLink.classList.add('text-white', 'bg-white/10');
        activeLink.classList.remove('text-gray-300');
    }
}

// Mock Data Initialization
function initMockData() {
    if (!localStorage.getItem('gobee_leads')) {
        const dummyLeads = [
            {
                id: 1,
                name: 'Giulian Pizzio',
                email: 'giulian.pizzio@gobee.com.br',
                phone: '(51) 9930-67032',
                origin: 'Diagnóstico',
                status: 'Novos Leads',
                date: '10/02/2026 14:30',
                diagnostic: {
                    segment: 'Moda',
                    billing: 'R$ 10k - R$ 100k/mês',
                    pain: 'Trazer tráfego qualificado (Ads)'
                },
                timeline: [
                    { type: 'system', text: 'Lead cadastrado via Formulário Diagnóstico', date: '10/02/2026 14:30' },
                    { type: 'email', text: 'Email de Boas-vindas enviado', date: '10/02/2026 14:35' },
                    { type: 'action', text: 'Visualizou página de Serviços', date: '10/02/2026 14:40' }
                ]
            },
            {
                id: 2,
                name: 'Carlos Souza',
                email: 'carlos@tech.com',
                phone: '(21) 98888-2222',
                origin: 'Contato',
                status: 'Em Contato',
                date: '09/02/2026 10:15',
                diagnostic: {
                    segment: 'Eletrônicos',
                    billing: 'R$ 100k - R$ 500k/mês',
                    pain: 'Baixa conversão no checkout'
                },
                timeline: [
                    { type: 'system', text: 'Lead cadastrado via Contato', date: '09/02/2026 10:15' },
                    { type: 'whatsapp', text: 'Contato inicial via WhatsApp', date: '09/02/2026 11:00' }
                ]
            },
            {
                id: 3,
                name: 'Marina Costa',
                email: 'marina@beauty.com',
                phone: '(41) 97777-3333',
                origin: 'Diagnóstico',
                status: 'Proposta Enviada',
                date: '08/02/2026 16:45',
                diagnostic: {
                    segment: 'Beleza',
                    billing: 'Até R$ 10k/mês',
                    pain: 'Layout da loja desatualizado'
                },
                timeline: [
                    { type: 'system', text: 'Lead cadastrado via Diagnóstico', date: '08/02/2026 16:45' },
                    { type: 'email', text: 'Proposta Comercial #402 enviado', date: '09/02/2026 09:30' }
                ]
            }
        ];
        localStorage.setItem('gobee_leads', JSON.stringify(dummyLeads));
    }

    if (!localStorage.getItem('gobee_inquiries')) {
        const dummyInquiries = [
            { id: 1, name: 'Roberto Lima', email: 'beto@mail.com', message: 'Vocês fazem migração de Tray para Shopify?', status: 'pendente', date: '10/02/2026 09:00' }
        ];
        localStorage.setItem('gobee_inquiries', JSON.stringify(dummyInquiries));
    }

    if (!localStorage.getItem('gobee_users')) {
        const dummyUsers = [
            { id: 1, name: 'Giulian Pizzio', email: 'giulian.pizzio@gobee.com.br', role: 'Super Admin', permissions: ['all'] },
            { id: 2, name: 'Membro Equipe', email: 'equipe@gobee.com.br', role: 'Editor', permissions: ['leads', 'inquiries'] }
        ];
        localStorage.setItem('gobee_users', JSON.stringify(dummyUsers));
    }
}
