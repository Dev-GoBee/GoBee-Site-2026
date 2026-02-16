// State for Stages (default if empty)
const defaultStages = [
    { id: 'stage_1', name: 'Novos Leads', color: 'bg-blue-500' },
    { id: 'stage_2', name: 'Em Contato', color: 'bg-yellow-500' },
    { id: 'stage_3', name: 'Proposta Enviada', color: 'bg-purple-500' },
    { id: 'stage_4', name: 'Venda Realizada', color: 'bg-green-500' },
    { id: 'stage_5', name: 'Perdido', color: 'bg-red-500' }
];

window.renderLeadsView = function (container) {
    console.log('Rendering Leads View');
    const leads = JSON.parse(localStorage.getItem('gobee_leads')) || [];

    // Ensure Stages Exist
    if (!localStorage.getItem('gobee_funnel_stages')) {
        localStorage.setItem('gobee_funnel_stages', JSON.stringify(defaultStages));
    }
    const stages = JSON.parse(localStorage.getItem('gobee_funnel_stages'));

    // Default to list if not set, but respect current selection
    if (!window.currentLeadsView) window.currentLeadsView = 'kanban'; // Changed default to kanban as per heavy usage

    const html = `
        <!-- Leads Toolbar -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">CRM de Vendas</h2>
                <p class="text-gray-500 text-sm">Gerencie o fluxo de seus leads.</p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="openFunnelEditor()" class="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm">
                    <i data-lucide="settings-2" class="w-4 h-4"></i> Editar Funil
                </button>
                <div class="h-8 w-px bg-gray-200 mx-1"></div>
                <div class="relative">
                    <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
                    <input type="text" placeholder="Buscar..." id="search-leads" 
                        class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gobee-rose/20 focus:border-gobee-rose w-48 lg:w-64">
                </div>
                <div class="bg-white border border-gray-200 rounded-lg p-1 flex items-center">
                    <button onclick="switchLeadsView('list')" id="btn-view-list" class="p-2 rounded hover:bg-gray-100 text-gray-500 active-view">
                        <i data-lucide="list" class="w-4 h-4"></i>
                    </button>
                    <button onclick="switchLeadsView('kanban')" id="btn-view-kanban" class="p-2 rounded hover:bg-gray-100 text-gray-500">
                        <i data-lucide="kanban-square" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>

        <div id="leads-content">
            <!-- List View -->
            <div id="view-list" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in ${window.currentLeadsView === 'kanban' ? 'hidden' : ''}">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-gray-600">
                        <thead class="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-4">Nome / Data</th>
                                <th class="px-6 py-4">Contato</th>
                                <th class="px-6 py-4">Origem</th>
                                <th class="px-6 py-4">Status</th>
                                <th class="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100" id="leads-table-body">
                            ${renderLeadsRows(leads)}
                        </tbody>
                    </table>
                </div>
                ${leads.length === 0 ? '<div class="p-8 text-center text-gray-400">Nenhum lead encontrado.</div>' : ''}
            </div>

            <!-- Kanban View -->
            <div id="view-kanban" class="overflow-x-auto pb-4 ${window.currentLeadsView === 'kanban' ? '' : 'hidden'}">
                <div class="flex gap-6 min-w-max" id="kanban-board">
                    ${renderKanbanColumns(leads, stages)}
                </div>
            </div>
        </div>

        <!-- FUNNEL EDITOR MODAL -->
        <div id="funnel-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center transition-opacity duration-300 opacity-0">
            <div class="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300" id="funnel-modal-content">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 class="font-bold text-gray-900 text-lg">Editar Etapas do Funil</h3>
                    <button onclick="closeFunnelEditor()" class="text-gray-400 hover:text-gray-600"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="p-6 max-h-[60vh] overflow-y-auto space-y-3" id="funnel-stages-list">
                    <!-- Stages injected here -->
                </div>
                <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button onclick="addNewStage()" class="text-blue-600 font-medium text-sm flex items-center gap-2 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i> Adicionar Etapa
                    </button>
                    <button onclick="saveFunnelChanges()" class="bg-gobee-rose text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>

        <!-- LEAD MODAL (Same as before) -->
        <div id="lead-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex justify-end transition-opacity duration-300 opacity-0" onclick="closeLeadModal()">
            <div class="bg-white w-full max-w-4xl h-full shadow-2xl overflow-hidden flex transform translate-x-full transition-transform duration-300" 
                 id="lead-modal-content" onclick="event.stopPropagation()">
                <!-- ... Modal Content (Kept largely same, minimal updates if needed) ... -->
                 <div class="w-1/3 bg-gray-50 border-r border-gray-200 p-6 flex flex-col h-full overflow-y-auto">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Detalhes do Lead</h3>
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600" id="modal-initials"></div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-lg leading-tight" id="modal-name"></h4>
                            <p class="text-xs text-gray-500" id="modal-date"></p>
                        </div>
                    </div>
                    <!-- Contact Info -->
                    <div class="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
                        <div class="flex justify-between items-center mb-3">
                             <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Contato</span>
                             <button onclick="toggleEditContact()" id="btn-edit-contact" class="text-blue-600 text-xs font-medium hover:underline flex items-center gap-1">
                                <i data-lucide="pencil" class="w-3 h-3"></i> Editar
                             </button>
                        </div>
                        <div class="space-y-3" id="contact-view-mode">
                             <div class="flex items-center gap-2 text-sm text-gray-600">
                                <i data-lucide="mail" class="w-4 h-4 text-gray-400"></i>
                                <span id="modal-email"></span>
                             </div>
                             <div class="flex items-center gap-2 text-sm text-gray-600">
                                <i data-lucide="message-circle" class="w-4 h-4 text-green-500"></i>
                                <span id="modal-phone"></span>
                             </div>
                        </div>
                        <div class="space-y-3 hidden" id="contact-edit-mode">
                             <input type="email" id="edit-email" class="w-full text-sm border border-gray-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Email">
                             <input type="text" id="edit-phone" class="w-full text-sm border border-gray-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Telefone">
                             <button onclick="saveContact()" class="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded hover:bg-blue-700">Salvar Alterações</button>
                        </div>
                    </div>
                    <!-- Diagnostic -->
                     <div class="bg-white p-4 rounded-xl border border-gray-200 flex-1 shadow-sm">
                        <div class="flex items-center gap-2 mb-4">
                             <i data-lucide="layout-dashboard" class="w-4 h-4 text-gray-400"></i>
                             <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Dados do Diagnóstico</span>
                        </div>
                        <div class="space-y-5">
                            <div>
                                <p class="text-xs text-gray-500 font-medium mb-1">SEGMENTO</p>
                                <p class="text-sm font-semibold text-gray-900" id="modal-segment"></p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 font-medium mb-1">FATURAMENTO ATUAL</p>
                                <p class="text-sm font-semibold text-gray-900" id="modal-billing"></p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 font-medium mb-2">MAIOR DESAFIO (DOR)</p>
                                <div class="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100 font-medium" id="modal-pain"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Timeline -->
                <div class="flex-1 bg-white flex flex-col h-full">
                    <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                         <h3 class="font-bold text-gray-900 flex items-center gap-2"><i data-lucide="clock" class="w-5 h-5 text-gray-400"></i> Linha do Tempo</h3>
                         <button onclick="closeLeadModal()" class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200"><i data-lucide="x" class="w-6 h-6"></i></button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                        <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent" id="modal-timeline"></div>
                    </div>
                    <!-- Details Footer -->
                     <div class="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                        <button class="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">Excluir Lead</button>
                        <a href="#" id="modal-btn-email" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4"></i> Email</a>
                        <a href="#" target="_blank" id="modal-btn-whatsapp" class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20"><i data-lucide="message-circle" class="w-4 h-4"></i> WhatsApp</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Initialize UI State
    updateLeadsViewButtons();

    // Event Listeners
    document.getElementById('search-leads').addEventListener('input', (e) => filterLeads(e.target.value));

    // Refresh Icons
    if (window.lucide) lucide.createIcons();

    // Init Kanban DND synchronously
    setTimeout(initKanbanDragAndDrop, 100);
}

// === FUNNEL EDITOR LOGIC ===
window.openFunnelEditor = function () {
    const list = document.getElementById('funnel-stages-list');
    const stages = JSON.parse(localStorage.getItem('gobee_funnel_stages')) || defaultStages;

    list.innerHTML = stages.map((stage, index) => `
        <div class="flex items-center gap-2 stage-item group" data-index="${index}">
            <div class="cursor-move text-gray-400 hover:text-gray-600"><i data-lucide="grip-vertical" class="w-4 h-4"></i></div>
            <input type="text" value="${stage.name}" class="stage-name-input flex-1 border border-gray-200 rounded p-2 text-sm focus:ring-1 focus:ring-gobee-rose outline-none" placeholder="Nome da Etapa">
            <button onclick="removeStage(${index})" class="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors" title="Remover Etapa">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `).join('');

    // Show Modal
    const modal = document.getElementById('funnel-modal');
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    document.getElementById('funnel-modal-content').classList.remove('scale-95');
    lucide.createIcons();
}

window.closeFunnelEditor = function () {
    const modal = document.getElementById('funnel-modal');
    document.getElementById('funnel-modal-content').classList.add('scale-95');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

window.addNewStage = function () {
    const list = document.getElementById('funnel-stages-list');
    const div = document.createElement('div');
    div.className = 'flex items-center gap-2 stage-item group animate-fade-in';
    div.innerHTML = `
        <div class="cursor-move text-gray-400 hover:text-gray-600"><i data-lucide="grip-vertical" class="w-4 h-4"></i></div>
        <input type="text" value="" class="stage-name-input flex-1 border border-gray-200 rounded p-2 text-sm focus:ring-1 focus:ring-gobee-rose outline-none" placeholder="Nova Etapa">
        <button onclick="this.parentElement.remove()" class="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
    `;
    list.appendChild(div);
    lucide.createIcons();
}

window.removeStage = function (index) {
    // In a real app we would enable removing specific indices, but re-rendering the list is safer for now
    // or just remove the element from DOM
    const items = document.querySelectorAll('.stage-item');
    if (items[index]) items[index].remove();
}

window.saveFunnelChanges = function () {
    const inputs = document.querySelectorAll('.stage-name-input');
    const oldStages = JSON.parse(localStorage.getItem('gobee_funnel_stages')) || defaultStages;
    let leads = JSON.parse(localStorage.getItem('gobee_leads')) || [];

    const newStages = [];
    inputs.forEach((input, index) => {
        if (input.value.trim() !== "") {
            // Keep color if exists, or pick from palette? For now simple logic
            const oldStage = oldStages[index];
            newStages.push({
                id: oldStage ? oldStage.id : `stage_${Date.now()}_${index}`,
                name: input.value.trim(),
                color: oldStage ? oldStage.color : 'bg-gray-500' // could cycle colors
            });

            // Rename logic: if name changed, update leads?
            // A bit complex if we rely on name as ID. 
            // Better strategy: If we are modifying the 'name' of index N, update all leads that had name of index N in oldStages
            if (oldStage && oldStage.name !== input.value.trim()) {
                leads.forEach(l => {
                    if (l.status === oldStage.name) l.status = input.value.trim();
                });
            }
        }
    });

    if (newStages.length === 0) {
        alert("O funil deve ter pelo menos uma etapa.");
        return;
    }

    localStorage.setItem('gobee_funnel_stages', JSON.stringify(newStages));
    localStorage.setItem('gobee_leads', JSON.stringify(leads));

    closeFunnelEditor();

    // Refresh View
    const mainView = document.getElementById('main-view');
    if (mainView) window.renderLeadsView(mainView);
}

// === VIEW RENDERING ===

function renderKanbanColumns(leads, stages) {
    return stages.map(stage => {
        const stageLeads = leads.filter(l => l.status === stage.name);
        // Fallback color if not set
        const stageColor = stage.color || 'bg-gray-500';

        return `
            <div class="kanban-col w-80 flex flex-col h-full rounded-xl bg-gray-50 border border-gray-200 transition-colors duration-200" data-status="${stage.name}">
                <!-- Header -->
                <div class="p-4 flex items-center justify-between border-b border-gray-200/50 pointer-events-none">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full ${stageColor}"></div>
                        <h3 class="font-semibold text-gray-700 text-sm uppercase tracking-wide truncate max-w-[150px]" title="${stage.name}">${stage.name}</h3>
                    </div>
                    <span class="bg-white px-2 py-0.5 rounded text-xs font-medium text-gray-500 border border-gray-100">${stageLeads.length}</span>
                </div>
                
                <!-- Cards Container -->
                <div class="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                    ${stageLeads.length ? stageLeads.map(lead => renderKanbanCard(lead)).join('') :
                '<div class="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 pointer-events-none">Arraste cards para cá</div>'}
                </div>
            </div>
        `;
    }).join('');
}

function renderKanbanCard(lead) {
    // COMPACT DESIGN: Date small. Actions top right. 
    return `
        <div class="kanban-card bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab group relative" 
             data-id="${lead.id}"
             onclick="openLeadModal(${lead.id})">
            
            <div class="flex justify-between items-start mb-1 pointer-events-none">
                <h4 class="font-bold text-gray-900 text-sm leading-tight pr-14">${lead.name}</h4>
                
                <!-- Actions (Absolute Top Right) -->
                <div class="absolute top-2 right-2 flex gap-1 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 pl-1 rounded-bl">
                     <a href="mailto:${lead.email}" onclick="event.stopPropagation()" class="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded" title="Email"><i data-lucide="mail" class="w-3.5 h-3.5"></i></a>
                     <a href="https://wa.me/55${lead.phone.replace(/\D/g, '')}" target="_blank" onclick="event.stopPropagation()" class="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded" title="WhatsApp"><i data-lucide="message-circle" class="w-3.5 h-3.5"></i></a>
                     <button onclick="event.stopPropagation(); deleteLead(${lead.id})" class="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded" title="Excluir"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>
            </div>
            
             <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-2 pointer-events-none">
                ${lead.origin}
            </span>
            
            <div class="flex justify-between items-end mt-1 border-t border-gray-50 pt-2">
                 <!-- Discreet Date -->
                 <span class="text-[10px] text-gray-400 font-medium pointer-events-none">${lead.date.split(' ')[0]}</span>
                 
                 <!-- Tiny icons for quick checks? -->
                 <div class="flex gap-1.5">
                    <!-- maybe small status icons could go here if requested, for now actions are top right -->
                 </div>
            </div>
        </div>
    `;
}

// Kept updateLeadStatus, initKanbanDragAndDrop, and other logic same as previous step but ensuring renderKanbanColumns uses passed stages
// Re-pasting the critical DND logic for completeness to avoid missing it in overwrite

function initKanbanDragAndDrop() {
    console.log('Initializing Kanban DnD');

    // Setup Columns
    const cols = document.querySelectorAll('.kanban-col');
    cols.forEach(col => {
        col.ondragover = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            col.classList.add('bg-blue-50', 'ring-2', 'ring-blue-200');
        };

        col.ondragleave = (e) => {
            col.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-200');
        };

        col.ondrop = (e) => {
            e.preventDefault();
            col.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-200');

            const rawId = e.dataTransfer.getData('text/plain');
            const newStatus = col.getAttribute('data-status');
            const leadId = parseInt(rawId);

            if (leadId && newStatus) {
                updateLeadStatus(leadId, newStatus);
            }
        };
    });

    // Setup Cards
    const cards = document.querySelectorAll('.kanban-card');
    cards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', card.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => card.classList.add('opacity-50'), 0);
        };

        card.ondragend = (e) => {
            card.classList.remove('opacity-50');
            cols.forEach(c => c.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-200'));
        };
    });
}

window.updateLeadStatus = function (leadId, newStatus) {
    let leads = JSON.parse(localStorage.getItem('gobee_leads')) || [];
    const leadIndex = leads.findIndex(l => l.id === leadId);

    if (leadIndex !== -1 && leads[leadIndex].status !== newStatus) {
        const oldStatus = leads[leadIndex].status;
        leads[leadIndex].status = newStatus;

        if (!leads[leadIndex].timeline) leads[leadIndex].timeline = [];
        leads[leadIndex].timeline.unshift({
            type: 'system',
            text: `Status alterado de "${oldStatus}" para "${newStatus}"`,
            date: new Date().toLocaleString('pt-BR')
        });

        localStorage.setItem('gobee_leads', JSON.stringify(leads));

        const mainView = document.getElementById('main-view');
        if (mainView) window.renderLeadsView(mainView);
    }
}

// (Other Helpers remain: openLeadModal, closeLeadModal, toggleEditContact, saveContact, switchLeadsView, etc.)
// ... Including them in full in the overwrite to prevent breaking.

// === RE-INCLUDED HELPERS ===
let currentOpenLeadId = null;

// window.openLeadModal = ... (Same logic, re-using previous working code)
window.openLeadModal = function (leadId) {
    currentOpenLeadId = leadId;
    const leads = JSON.parse(localStorage.getItem('gobee_leads')) || [];
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Reset Edit Mode
    const viewMode = document.getElementById('contact-view-mode');
    const editMode = document.getElementById('contact-edit-mode');
    if (viewMode) viewMode.classList.remove('hidden');
    if (editMode) editMode.classList.add('hidden');
    const btnEdit = document.getElementById('btn-edit-contact');
    if (btnEdit) {
        btnEdit.innerHTML = '<i data-lucide="pencil" class="w-3 h-3"></i> Editar';
        btnEdit.onclick = toggleEditContact;
    }

    // Populate Data (using safe helpers)
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHref = (id, val) => { const el = document.getElementById(id); if (el) el.href = val; };

    setText('modal-name', lead.name);
    setText('modal-email', lead.email);
    setText('modal-phone', lead.phone);
    setText('modal-date', `Cadastrado em ${lead.date}`);
    setText('modal-initials', lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());

    const inpEmail = document.getElementById('edit-email');
    const inpPhone = document.getElementById('edit-phone');
    if (inpEmail) inpEmail.value = lead.email;
    if (inpPhone) inpPhone.value = lead.phone;

    const diag = lead.diagnostic || { segment: 'Não informado', billing: '-', pain: 'Não informado' };
    setText('modal-segment', diag.segment);
    setText('modal-billing', diag.billing);
    setText('modal-pain', diag.pain);

    setHref('modal-btn-email', `mailto:${lead.email}`);
    setHref('modal-btn-whatsapp', `https://wa.me/55${lead.phone.replace(/\D/g, '')}`);

    const timeline = lead.timeline || [];
    const timelineContainer = document.getElementById('modal-timeline');
    if (timelineContainer) {
        timelineContainer.innerHTML = timeline.map(item => `
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    ${getTimelineIcon(item.type)}
                </div>
                <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div class="flex items-center justify-between space-x-2 mb-1">
                        <div class="font-bold text-gray-900 text-sm">${getTimelineTitle(item.type)}</div>
                        <time class="font-caveat font-medium text-xs text-indigo-500">${item.date.split(' ')[1]}</time>
                    </div>
                    <div class="text-gray-500 text-xs">${item.text}</div>
                </div>
            </div>
        `).join('');
    }

    const modal = document.getElementById('lead-modal');
    const content = document.getElementById('lead-modal-content');
    if (modal && content) {
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        content.classList.remove('translate-x-full');
        lucide.createIcons();
    }
}

window.toggleEditContact = function () {
    const viewMode = document.getElementById('contact-view-mode');
    const editMode = document.getElementById('contact-edit-mode');
    const btn = document.getElementById('btn-edit-contact');
    if (viewMode.classList.contains('hidden')) {
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');
        btn.innerHTML = '<i data-lucide="pencil" class="w-3 h-3"></i> Editar';
    } else {
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
        btn.innerHTML = '<i data-lucide="x" class="w-3 h-3"></i> Cancelar';
    }
    lucide.createIcons();
}

window.saveContact = function () {
    if (!currentOpenLeadId) return;
    const newEmail = document.getElementById('edit-email').value;
    const newPhone = document.getElementById('edit-phone').value;
    let leads = JSON.parse(localStorage.getItem('gobee_leads')) || [];
    const leadIndex = leads.findIndex(l => l.id === currentOpenLeadId);
    if (leadIndex !== -1) {
        leads[leadIndex].email = newEmail;
        leads[leadIndex].phone = newPhone;
        localStorage.setItem('gobee_leads', JSON.stringify(leads));
        alert('Contato atualizado com sucesso!');
        openLeadModal(currentOpenLeadId);
        const mainView = document.getElementById('main-view');
        if (mainView) window.renderLeadsView(mainView);
    }
}

window.closeLeadModal = function () {
    const modal = document.getElementById('lead-modal');
    const content = document.getElementById('lead-modal-content');
    if (content) content.classList.add('translate-x-full');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => { modal.classList.add('hidden'); currentOpenLeadId = null; }, 300);
    }
}

function updateLeadsViewButtons() {
    const btnList = document.getElementById('btn-view-list');
    const btnKanban = document.getElementById('btn-view-kanban');
    if (!btnList || !btnKanban) return;
    if (window.currentLeadsView === 'list') {
        btnList.classList.add('bg-gray-100', 'text-gray-900'); btnList.classList.remove('text-gray-500');
        btnKanban.classList.remove('bg-gray-100', 'text-gray-900'); btnKanban.classList.add('text-gray-500');
        document.getElementById('view-list').classList.remove('hidden');
        document.getElementById('view-kanban').classList.add('hidden');
    } else {
        btnKanban.classList.add('bg-gray-100', 'text-gray-900'); btnKanban.classList.remove('text-gray-500');
        btnList.classList.remove('bg-gray-100', 'text-gray-900'); btnList.classList.add('text-gray-500');
        document.getElementById('view-list').classList.add('hidden');
        document.getElementById('view-kanban').classList.remove('hidden');
    }
}

window.switchLeadsView = function (view) {
    window.currentLeadsView = view;
    updateLeadsViewButtons();
    if (view === 'kanban') setTimeout(initKanbanDragAndDrop, 50);
}

window.deleteLead = function (id) {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
        let leads = JSON.parse(localStorage.getItem('gobee_leads')) || [];
        leads = leads.filter(l => l.id !== id);
        localStorage.setItem('gobee_leads', JSON.stringify(leads));
        const mainView = document.getElementById('main-view');
        if (mainView) window.renderLeadsView(mainView);
    }
}

function filterLeads(query) {
    const leads = JSON.parse(localStorage.getItem('gobee_leads')) || [];
    const filtered = leads.filter(l => l.name.toLowerCase().includes(query.toLowerCase()) || l.email.toLowerCase().includes(query.toLowerCase()));

    // We also need stages for renderKanbanColumns
    const stages = JSON.parse(localStorage.getItem('gobee_funnel_stages')) || defaultStages;

    if (window.currentLeadsView === 'list') {
        document.getElementById('leads-table-body').innerHTML = renderLeadsRows(filtered);
    } else {
        document.getElementById('kanban-board').innerHTML = renderKanbanColumns(filtered, stages);
    }
    lucide.createIcons();
    initKanbanDragAndDrop();
}

function getTimelineIcon(type) { if (type === 'email') return '<i data-lucide="mail" class="w-4 h-4 text-blue-500"></i>'; if (type === 'whatsapp') return '<i data-lucide="message-circle" class="w-4 h-4 text-green-500"></i>'; if (type === 'action') return '<i data-lucide="mouse-pointer-2" class="w-4 h-4 text-purple-500"></i>'; return '<i data-lucide="clipboard-list" class="w-4 h-4 text-gray-500"></i>'; }
function getTimelineTitle(type) { if (type === 'email') return 'Email Enviado'; if (type === 'whatsapp') return 'Interação WhatsApp'; if (type === 'action') return 'Ação no Site'; return 'Sistema'; }

function renderLeadsRows(leads) {
    return leads.map(lead => `
    <tr class="hover:bg-gray-50 transition-colors group cursor-pointer" onclick="openLeadModal(${lead.id})">
        <td class="px-6 py-4"><div class="font-medium text-gray-900">${lead.name}</div><div class="text-xs text-gray-400">${lead.date}</div></td>
        <td class="px-6 py-4"><div class="flex items-center gap-2"><i data-lucide="mail" class="w-3 h-3 text-gray-400"></i> ${lead.email}</div><div class="flex items-center gap-2 mt-1"><i data-lucide="phone" class="w-3 h-3 text-gray-400"></i> ${lead.phone}</div></td>
        <td class="px-6 py-4"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">${lead.origin}</span></td>
        <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">${lead.status}</span></td>
        <td class="px-6 py-4 text-right"><div class="flex items-center justify-end gap-2" onclick="event.stopPropagation()"><a href="mailto:${lead.email}" class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600"><i data-lucide="mail" class="w-4 h-4"></i></a><a href="https://wa.me/55${lead.phone.replace(/\D/g, '')}" target="_blank" class="p-2 bg-green-50 rounded-lg hover:bg-green-100 text-green-600"><i data-lucide="message-circle" class="w-4 h-4"></i></a><button onclick="deleteLead(${lead.id})" class="p-2 bg-red-50 rounded-lg hover:bg-red-100 text-red-600"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div></td>
    </tr>`).join('');
}
