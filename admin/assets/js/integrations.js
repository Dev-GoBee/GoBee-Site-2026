window.renderIntegrationsView = function (container) {
    const integrations = [
        {
            id: 'smtp',
            name: 'Servidor SMTP',
            desc: 'Envio de e-mails transacionais próprios.',
            icon: 'mail',
            status: 'inativo'
        },
        {
            id: 'ga4',
            name: 'Google Analytics 4',
            desc: 'Rastreamento de conversões e tráfego.',
            icon: 'globe',
            status: 'ativo'
        },
        {
            id: 'webhook',
            name: 'Webhook (Make/Zapier)',
            desc: 'Conecte com Make, Zapier ou n8n.',
            icon: 'link',
            status: 'ativo'
        }
    ];

    const html = `
        <!-- Header -->
        <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Integrações</h2>
            <p class="text-gray-500 text-sm">Conecte sua loja a ferramentas externas.</p>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${integrations.map(item => `
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-4">
                        <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-700">
                             <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                        </div>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
                            ${item.status}
                        </span>
                    </div>
                    
                    <h3 class="font-bold text-gray-900 mb-1">${item.name}</h3>
                    <p class="text-sm text-gray-500 mb-6 h-10">${item.desc}</p>
                    
                    <button onclick="configIntegration('${item.id}')" class="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="settings" class="w-4 h-4"></i> Configurar
                    </button>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;
}

window.configIntegration = function (id) {
    alert(`Configuração de ${id} em breve!`);
}
