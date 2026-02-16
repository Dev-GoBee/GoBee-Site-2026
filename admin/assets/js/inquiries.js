window.renderInquiriesView = function (container) {
    const inquiries = JSON.parse(localStorage.getItem('gobee_inquiries')) || [];

    // Sort: Pending first
    inquiries.sort((a, b) => (a.status === 'pendente' && b.status !== 'pendente') ? -1 : 1);

    const html = `
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Central de Dúvidas</h2>
                <p class="text-gray-500 text-sm">Gerencie perguntas recebidas pelo site.</p>
            </div>
             <div class="bg-white border border-gray-200 rounded-lg p-1 flex items-center">
                 <span class="text-xs font-medium px-3 text-gray-500">
                    ${inquiries.filter(i => i.status === 'pendente').length} pendentes
                 </span>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Column: Recebidos (Pendente) -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-200px)]">
                <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                    <h3 class="font-semibold text-gray-700 flex items-center gap-2">
                        <i data-lucide="inbox" class="w-4 h-4"></i> Recebidos
                    </h3>
                    <span class="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        ${inquiries.filter(i => i.status === 'pendente').length}
                    </span>
                </div>
                <div class="p-4 space-y-4 overflow-y-auto flex-1">
                    ${renderInquiryCards(inquiries, 'pendente')}
                </div>
            </div>

            <!-- Column: Respondidos -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-200px)]">
                <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                    <h3 class="font-semibold text-gray-700 flex items-center gap-2">
                         <i data-lucide="check-circle-2" class="w-4 h-4"></i> Respondidos
                    </h3>
                     <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        ${inquiries.filter(i => i.status === 'respondido').length}
                    </span>
                </div>
                <div class="p-4 space-y-4 overflow-y-auto flex-1">
                    ${renderInquiryCards(inquiries, 'respondido')}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderInquiryCards(inquiries, status) {
    const filtered = inquiries.filter(i => i.status === status);

    if (filtered.length === 0) {
        return `<div class="text-center text-gray-400 text-sm py-8">Nenhuma dúvida ${status}.</div>`;
    }

    return filtered.map(item => `
        <div class="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow group relative ${status === 'pendente' ? 'bg-white' : 'bg-gray-50'}">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-gray-900 text-sm">${item.name}</h4>
                <span class="text-[10px] text-gray-400">${item.date}</span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 leading-relaxed">"${item.message}"</p>
            
            <div class="flex items-center justify-between mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
               <div class="flex items-center gap-1">
                    <i data-lucide="mail" class="w-3 h-3"></i> ${item.email}
               </div>

               <div class="flex gap-2">
                    ${status === 'pendente' ? `
                        <button onclick="markAsResponded(${item.id})" class="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 hover:bg-green-50 px-2 py-1 rounded transition-colors">
                            <i data-lucide="check" class="w-3 h-3"></i> Responder
                        </button>
                    ` : `
                        <button onclick="markAsPending(${item.id})" class="text-gray-400 hover:text-gray-600 flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                            <i data-lucide="undo-2" class="w-3 h-3"></i>
                        </button>
                    `}
                    <button onclick="deleteInquiry(${item.id})" class="text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                    </button>
               </div>
            </div>
        </div>
    `).join('');
}

window.markAsResponded = function (id) {
    updateInquiryStatus(id, 'respondido');
}

window.markAsPending = function (id) {
    updateInquiryStatus(id, 'pendente');
}

function updateInquiryStatus(id, newStatus) {
    let inquiries = JSON.parse(localStorage.getItem('gobee_inquiries')) || [];
    const index = inquiries.findIndex(i => i.id === id);
    if (index !== -1) {
        inquiries[index].status = newStatus;
        localStorage.setItem('gobee_inquiries', JSON.stringify(inquiries));
        renderInquiriesView(document.getElementById('main-view')); // Re-render
        lucide.createIcons();
    }
}

window.deleteInquiry = function (id) {
    if (confirm('Excluir esta dúvida?')) {
        let inquiries = JSON.parse(localStorage.getItem('gobee_inquiries')) || [];
        inquiries = inquiries.filter(i => i.id !== id);
        localStorage.setItem('gobee_inquiries', JSON.stringify(inquiries));
        renderInquiriesView(document.getElementById('main-view'));
        lucide.createIcons();
    }
}
