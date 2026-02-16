window.renderSettingsView = function (container) {
    // Load Data
    const automations = JSON.parse(localStorage.getItem('gobee_automations')) || {};
    const stages = JSON.parse(localStorage.getItem('gobee_funnel_stages')) || [];
    const messages = JSON.parse(localStorage.getItem('gobee_messages')) || [];

    // Default Tab
    if (!window.currentSettingsTab) window.currentSettingsTab = 'automations';

    const html = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Configurações Gerais</h2>
                <p class="text-gray-500 text-sm">Personalize automações e templates.</p>
            </div>
            <button onclick="saveAllSettings()" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-gray-900/20">
                <i data-lucide="save" class="w-4 h-4"></i> Salvar Tudo
            </button>
        </div>

        <div class="flex gap-6 items-start">
            <!-- Sidebar Settings -->
            <div class="w-64 space-y-1 bg-white p-2 rounded-xl border border-gray-200 shadow-sm shrink-0">
                <button onclick="switchSettingsTab('automations')" id="tab-automations" class="w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-colors ${window.currentSettingsTab === 'automations' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}">
                    <i data-lucide="webhook" class="w-4 h-4"></i> Automações
                </button>
                <button onclick="switchSettingsTab('messages')" id="tab-messages" class="w-full text-left px-4 py-3 text-sm font-bold flex items-center gap-3 transition-colors ${window.currentSettingsTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}">
                    <i data-lucide="message-square" class="w-4 h-4"></i> Mensagens
                </button>
            </div>

            <!-- Content Area -->
            <div class="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[500px]">
                
                <!-- AUTOMATIONS TAB -->
                <div id="content-automations" class="${window.currentSettingsTab === 'automations' ? '' : 'hidden'} animate-fade-in">
                    <div class="mb-6">
                         <h3 class="font-bold text-gray-900 text-lg">Automações do Funil</h3>
                         <p class="text-sm text-gray-500">Defina qual mensagem enviar quando um lead entrar em cada etapa.</p>
                    </div>

                    <div class="space-y-6">
                        ${stages.length > 0 ? stages.map((stage, index) => renderAutomationRow(stage, index, automations, messages)).join('') : '<p class="text-gray-400">Nenhuma etapa de funil encontrada.</p>'}
                    </div>
                </div>

                <!-- MESSAGES TAB -->
                <div id="content-messages" class="${window.currentSettingsTab === 'messages' ? '' : 'hidden'} animate-fade-in">
                     <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="font-bold text-gray-900 text-lg">Modelos de Mensagem</h3>
                            <p class="text-sm text-gray-500">Crie templates para Email e WhatsApp.</p>
                        </div>
                        <button onclick="addNewMessage()" class="text-blue-600 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i> Novo Modelo
                        </button>
                    </div>

                    <div class="space-y-4" id="messages-list">
                        ${messages.length > 0 ? messages.map((msg, index) => renderMessageRow(msg, index)).join('') : '<div class="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">Nenhum modelo criado ainda.</div>'}
                    </div>
                </div>

            </div>
        </div>
    `;

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

// === RENDER HELPERS ===

function renderAutomationRow(stage, index, automations, messages) {
    const stageColor = stage.color || 'bg-gray-500';
    const currentMsgId = automations[stage.name]?.messageId || '';
    const currentStartAuto = automations[stage.name]?.autoSend || false;

    // Filter messages by channel? For now show all, maybe distinguish in select

    return `
        <div class="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-3 h-3 rounded-full ${stageColor}"></div>
                <h4 class="font-bold text-gray-900 border-b border-gray-200/50 pb-1">${stage.name}</h4>
            </div>

            <div class="flex items-end gap-4">
                <div class="flex-1">
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Modelo de Mensagem a Vincular</label>
                    <div class="relative">
                        <i data-lucide="link" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
                        <select id="auto-msg-select-${index}" class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm data-stage-name="${stage.name}">
                            <option value="">-- Selecione um Modelo --</option>
                            ${messages.map(m => `<option value="${m.id}" ${currentMsgId === m.id ? 'selected' : ''}>[${m.channel === 'email' ? 'Email' : 'WhatsApp'}] ${m.title}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="flex-1 pb-1">
                     <p class="text-xs text-gray-400 mb-2">Este vínculo tornará o botão de ação no card (Leads) configurado para abrir este modelo.</p>
                     <div class="flex items-center gap-2">
                        <input type="checkbox" id="auto-send-${index}" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" ${currentStartAuto ? 'checked' : ''}>
                        <label for="auto-send-${index}" class="text-sm text-gray-600">Disparar ou sugerir automaticamente ao mover cartaz?</label>
                     </div>
                </div>
            </div>
        </div>
    `;
}

function renderMessageRow(msg, index) {
    return `
        <div class="message-item bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full ${msg.channel === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center">
                        <i data-lucide="${msg.channel === 'email' ? 'mail' : 'message-circle'}" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <input type="text" value="${msg.title}" class="font-bold text-gray-900 text-sm border-none bg-transparent focus:ring-0 p-0 w-full placeholder-gray-400" placeholder="Título do Modelo (ex: Boas Vindas)" onchange="updateMessage(${index}, 'title', this.value)">
                        <span class="text-xs text-gray-400 uppercase font-semibold tracking-wider">${msg.channel.toUpperCase()}</span>
                    </div>
                </div>
                <button onclick="deleteMessage(${index})" class="text-gray-300 hover:text-red-500 p-2"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
            
            <textarea class="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-600 focus:bg-white focus:border-blue-200 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all" 
                rows="3" 
                placeholder="Escreva o conteúdo da mensagem..."
                onchange="updateMessage(${index}, 'content', this.value)">${msg.content}</textarea>
            
            <div class="mt-2 flex justify-end">
                 <!-- Channel Switcher -->
                 <div class="flex bg-gray-100 rounded p-1">
                      <button onclick="updateMessage(${index}, 'channel', 'email')" class="px-2 py-1 text-xs font-bold rounded ${msg.channel === 'email' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}">Email</button>
                      <button onclick="updateMessage(${index}, 'channel', 'whatsapp')" class="px-2 py-1 text-xs font-bold rounded ${msg.channel === 'whatsapp' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}">WhatsApp</button>
                 </div>
            </div>
        </div>
    `;
}

// === LOGIC ===

window.switchSettingsTab = function (tabName) {
    window.currentSettingsTab = tabName;
    const container = document.getElementById('main-view'); // re-render to apply state simply
    window.renderSettingsView(container);
}

window.addNewMessage = function () {
    let messages = JSON.parse(localStorage.getItem('gobee_messages')) || [];
    messages.push({
        id: 'msg_' + Date.now(),
        title: 'Novo Modelo',
        content: '',
        channel: 'whatsapp'
    });
    localStorage.setItem('gobee_messages', JSON.stringify(messages));
    window.renderSettingsView(document.getElementById('main-view'));
}

window.deleteMessage = function (index) {
    if (confirm('Excluir este modelo?')) {
        let messages = JSON.parse(localStorage.getItem('gobee_messages')) || [];
        messages.splice(index, 1);
        localStorage.setItem('gobee_messages', JSON.stringify(messages));
        window.renderSettingsView(document.getElementById('main-view'));
    }
}

window.updateMessage = function (index, field, value) {
    let messages = JSON.parse(localStorage.getItem('gobee_messages')) || [];
    if (messages[index]) {
        messages[index][field] = value;
        localStorage.setItem('gobee_messages', JSON.stringify(messages));
        // If changing channel, might want to re-render to update icon color immediately
        if (field === 'channel') window.renderSettingsView(document.getElementById('main-view'));
    }
}

window.saveAllSettings = function () {
    // Save Automations
    const stages = JSON.parse(localStorage.getItem('gobee_funnel_stages')) || [];
    let automations = {};

    stages.forEach((stage, index) => {
        const select = document.getElementById(`auto-msg-select-${index}`);
        const check = document.getElementById(`auto-send-${index}`);

        if (select) {
            automations[stage.name] = {
                messageId: select.value,
                autoSend: check ? check.checked : false
            };
        }
    });

    localStorage.setItem('gobee_automations', JSON.stringify(automations));

    // Messages are saved on change, but good to confirm

    alert('Configurações salvas e sincronizadas!');
}
