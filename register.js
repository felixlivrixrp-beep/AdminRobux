// Загружаем заявки
let applications = JSON.parse(localStorage.getItem('applications') || '[]');

// Проверка статуса при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = sessionStorage.getItem('pendingUser');
    if (savedUser) {
        document.getElementById('username').value = savedUser;
        checkStatus(savedUser);
    }
});

function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirmPassword').value.trim();
    const msg = document.getElementById('msg');

    // Проверки
    if (!username || !password || !confirm) {
        msg.innerText = '❌ Заполни все поля!';
        return;
    }

    if (password !== confirm) {
        msg.innerText = '❌ Пароли не совпадают!';
        return;
    }

    if (password.length < 6) {
        msg.innerText = '❌ Пароль должен быть минимум 6 символов';
        return;
    }

    // Проверяем есть ли уже заявка
    const existing = applications.find(a => a.username === username);
    if (existing) {
        if (existing.status === 'pending') {
            msg.innerText = '⏳ Твоя заявка уже ожидает подтверждения!';
            sessionStorage.setItem('pendingUser', username);
            updateStatusBadge('pending');
            return;
        } else if (existing.status === 'approved') {
            msg.innerText = '✅ Ты уже зарегистрирован! Можешь войти.';
            return;
        }
    }

    // Создаем заявку
    const application = {
        id: Date.now(),
        username: username,
        password: password,
        time: new Date().toLocaleString(),
        status: 'pending' // pending, approved, rejected
    };

    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));

    // Сохраняем в сессию
    sessionStorage.setItem('pendingUser', username);

    // Показываем сообщение
    msg.innerHTML = '✅ Заявка отправлена! Жди подтверждения от админа.';
    updateStatusBadge('pending');

    // Очищаем поля (кроме ника)
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
}

function checkStatus(username) {
    const app = applications.find(a => a.username === username);
    if (app) {
        updateStatusBadge(app.status);
        if (app.status === 'approved') {
            document.getElementById('msg').innerHTML = '✅ Твой аккаунт подтвержден! <a href="login.html">Войти</a>';
        } else if (app.status === 'rejected') {
            document.getElementById('msg').innerHTML = '❌ Заявка отклонена. Попробуй снова.';
        }
    }
}

function updateStatusBadge(status) {
    const badge = document.getElementById('statusBadge');
    if (status === 'pending') {
        badge.innerHTML = '⏳ Статус: Ожидание подтверждения';
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
    }
}
