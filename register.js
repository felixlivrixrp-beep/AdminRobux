// Загружаем заявки
let applications = JSON.parse(localStorage.getItem('applications') || '[]');

// Проверка статуса при загрузке
window.onload = function() {
    const savedUser = sessionStorage.getItem('pendingUser');
    if (savedUser) {
        document.getElementById('username').value = savedUser;
        checkStatus(savedUser);
    }
};

function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirmPassword').value.trim();
    const msg = document.getElementById('msg');

    // Проверки
    if (!username || !password || !confirm) {
        showMessage('❌ Заполни все поля!', 'error');
        return;
    }

    if (password !== confirm) {
        showMessage('❌ Пароли не совпадают!', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('❌ Пароль минимум 6 символов', 'error');
        return;
    }

    // Проверяем есть ли уже заявка
    const existing = applications.find(a => a.username === username);
    if (existing) {
        if (existing.status === 'pending') {
            showMessage('⏳ Заявка уже ожидает подтверждения!', 'warning');
            sessionStorage.setItem('pendingUser', username);
            updateStatusBadge('pending');
            return;
        } else if (existing.status === 'approved') {
            showMessage('✅ Ты уже зарегистрирован!', 'success');
            return;
        }
    }

    // Создаем заявку
    const application = {
        id: Date.now(),
        username: username,
        password: password,
        time: new Date().toLocaleString(),
        status: 'pending'
    };

    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));
    sessionStorage.setItem('pendingUser', username);

    showMessage('✅ Заявка отправлена! Жди подтверждения.', 'success');
    updateStatusBadge('pending');

    // Очищаем поля паролей
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
}

function checkStatus(username) {
    const app = applications.find(a => a.username === username);
    if (app) {
        updateStatusBadge(app.status);
        if (app.status === 'approved') {
            showMessage('✅ Аккаунт подтвержден!', 'success');
        } else if (app.status === 'rejected') {
            showMessage('❌ Заявка отклонена', 'error');
        }
    }
}

function updateStatusBadge(status) {
    const badge = document.getElementById('statusBadge');
    if (status === 'pending') {
        badge.innerHTML = '⏳ Статус: Ожидает подтверждения';
        badge.style.background = 'rgba(255,165,0,0.2)';
        badge.style.color = 'orange';
    } else if (status === 'approved') {
        badge.innerHTML = '✅ Статус: Подтвержден';
        badge.style.background = 'rgba(0,255,0,0.2)';
        badge.style.color = '#00ff00';
    } else if (status === 'rejected') {
        badge.innerHTML = '❌ Статус: Отклонен';
        badge.style.background = 'rgba(255,0,0,0.2)';
        badge.style.color = '#ff4444';
    } else {
        badge.innerHTML = '⏳ Статус: не подана';
        badge.style.background = 'rgba(255,255,255,0.05)';
        badge.style.color = 'white';
    }
}

function showMessage(text, type) {
    const msg = document.getElementById('msg');
    msg.innerHTML = text;
    if (type === 'error') {
        msg.style.background = 'rgba(255,0,0,0.2)';
        msg.style.color = '#ff4444';
    } else if (type === 'success') {
        msg.style.background = 'rgba(0,255,0,0.2)';
        msg.style.color = '#00ff00';
    } else {
        msg.style.background = 'rgba(255,165,0,0.2)';
        msg.style.color = 'orange';
    }
}
