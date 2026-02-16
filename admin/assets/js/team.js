window.renderTeamView = function (container) {
    const users = JSON.parse(localStorage.getItem('gobee_users')) || [];

    const html = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Gerenciamento de Equipe</h2>
                <p class="text-gray-500 text-sm">Controle de acesso e usuários.</p>
            </div>
            <button onclick="addUser()" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i> Novo Usuário
            </button>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-600">
                    <thead class="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-4">Usuário</th>
                            <th class="px-6 py-4">Função</th>
                            <th class="px-6 py-4">Permissões</th>
                            <th class="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${renderUserRows(users)}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderUserRows(users) {
    return users.map(user => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        ${getInitials(user.name)}
                    </div>
                    <div>
                        <div class="font-bold text-gray-900">${user.name}</div>
                        <div class="text-xs text-gray-400">${user.email}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getRoleBadge(user.role)}">
                    ${user.role}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                    ${renderPermissions(user.permissions)}
                </div>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="deleteUser(${user.id})" class="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors" ${user.role === 'Super Admin' ? 'disabled title="Não é possível remover Super Admin"' : ''}>
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getRoleBadge(role) {
    if (role === 'Super Admin') return 'bg-purple-100 text-purple-700';
    if (role === 'Admin') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-600';
}

function renderPermissions(perms) {
    if (perms.includes('all')) return '<span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] border border-gray-200">Acesso Total</span>';

    return perms.map(p => `
        <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] border border-gray-200 capitalize">${p}</span>
    `).join('');
}

window.addUser = function () {
    const name = prompt('Nome do Usuário:');
    if (!name) return;

    const email = prompt('Email do Usuário:');
    if (!email) return;

    const role = prompt('Função (Admin, Editor):', 'Editor');

    const newUser = {
        id: Date.now(),
        name,
        email,
        role,
        permissions: ['leads', 'inquiries'] // Default permissions
    };

    let users = JSON.parse(localStorage.getItem('gobee_users')) || [];
    users.push(newUser);
    localStorage.setItem('gobee_users', JSON.stringify(users));
    renderTeamView(document.getElementById('main-view'));
    lucide.createIcons();
}

window.deleteUser = function (id) {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
        let users = JSON.parse(localStorage.getItem('gobee_users')) || [];
        users = users.filter(u => u.id !== id);
        localStorage.setItem('gobee_users', JSON.stringify(users));
        renderTeamView(document.getElementById('main-view'));
        lucide.createIcons();
    }
}
