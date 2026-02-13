// Логин и пароль
const ADMIN_LOGIN = 'Felix';
const ADMIN_PASSWORD = 'Felix2013FelixBux';

let applications = [];

// Проверка логина
function login() {
    const user = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;

    if (user === ADMIN_LOGIN && pass === ADMIN_PASSWORD) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        sessionStorage.setItem('regAdmin', 'true');
        loadApplications();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

// Проверка сессии
window.onload = function() {
    if (sessionStorage.getItem('regAdmin') === 'true') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadApplications();
    }
};

// Загрузить заявки
function loadApplications() {
    applications = JSON.parse(localStorage.getItem('applications') || '[]');
    updateStats();
    renderApplications();
}

// Обновить статистику
function updateStats() {
    document.getElementById('totalApps').innerText = applications.length;
    document.getElementById('pendingApps').innerText = applications.filter(a => a.status === 'pending').length;
    document.getElementById('approvedApps').innerText = applications.filter(a => a.status === 'approved').length;
}

// Подтвердить
function approveApplication(id) {
    applications = applications.map(a => {
        if (a.id === id) a.status = 'approved';
        return a;
    });
    localStorage.setItem('applications', JSON.stringify(applications));
    loadApplications();
}

// Отклонить
function rejectApplication(id) {
    if (confirm('Отклонить заявку?')) {
        applications = applications.map(a => {
            if (a.id === id) a.status = 'rejected';
            return a;
        });
        localStorage.setItem('applications', JSON.stringify(applications));
        loadApplications();
    }
}

// Удалить
function deleteApplication(id) {
    if (confirm('Удалить заявку навсегда?')) {
        applications = applications.filter(a => a.id !== id);
        localStorage.setItem('applications', JSON.stringify(applications));
        loadApplications();
    }
}

// Показать таблицу
function renderApplications() {
    const tbody = document.getElementById('appsTable');

    if (applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">Нет заявок</td></tr>';
        return;
    }

    tbody.innerHTML = applications.reverse().map(a => {
        let statusClass = 'status-pending';
        let statusText = 'Ожидает';

        if (a.status === 'approved') {
            statusClass = 'status-approved';
            statusText = 'Подтвержден';
        } else if (a.status === 'rejected') {
            statusClass = 'status-rejected';
            statusText = 'Отклонен';
        }

        return `
            <tr>
                <td><strong style="color:#66ccff;">${a.username}</strong></td>
                <td>${a.time}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>
                    ${a.status === 'pending' 
                        ? `<button class="action-btn approve-btn" onclick="approveApplication(${a.id})">✓ Подтвердить</button>
                           <button class="action-btn reject-btn" onclick="rejectApplication(${a.id})">✗ Отклонить</button>`
                        : `<button class="action-btn delete-btn" onclick="deleteApplication(${a.id})">🗑 Удалить</button>`
                    }
                </td>
            </tr>
        `;
    }).join('');
}

// Обновление каждые 2 секунды
setInterval(() => {
    if (sessionStorage.getItem('regAdmin') === 'true') {
        loadApplications();
    }
}, 2000);
