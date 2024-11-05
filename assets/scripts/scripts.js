fetch('assets/scripts/setting.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON data
    })
    .then(data => {
        const state = data; // Store the JSON data in a variable
        console.log(state); // Log or use the JSON data as needed

        // Example: Use data to render settings
        if (state.settings) {
            state.settings.forEach(setting => renderSettingElement(setting));
        }

        // Call toggleEmptyState if needed
        toggleEmptyState();
    })
    .catch(error => console.error('Error loading JSON:', error));



function removeSettingHandler(settingId) {
    // 1. Видалення елемента з DOM
    const settingLineElement = document.querySelector(`#setting-${settingId}`);
    if (settingLineElement) {
        settingLineElement.remove(); // Видаляємо елемент з DOM
    }

    // 2. Пошук індексу налаштування в масиві state.settings
    const settingIndex = state.settings.findIndex(setting => setting.id === settingId);
    if (settingIndex !== -1) {
        // 3. Видалення налаштування з масиву state.settings
        state.settings.splice(settingIndex, 1); // Видаляємо елемент із масиву
    }

    // 4. Оновлення порожнього стану
    toggleEmptyState(); // Перевіряємо, чи залишились налаштування, і оновлюємо інтерфейс
}

function renderSettingElement(setting) {
    // 1. Вибір елемента шаблону
    const template = document.querySelector('#setting-template');
    
    if (!template) {
        console.error('Template not found!');
        return;
    }

    // 2. Клонування шаблону
    const clone = template.content.cloneNode(true);
    const settingElement = clone.querySelector('.setting-item');

    // 3. Встановлення атрибутів та контенту
    settingElement.id = `setting-${setting.id}`; // Призначення ID

    // Лінк для редагування налаштування
    const editLink = settingElement.querySelector('.edit-link');
    editLink.href = `/settings/edit/${setting.id}`; // Посилання на сторінку редагування

    // Відображення назви налаштування
    const nameElement = settingElement.querySelector('.setting-name');
    nameElement.textContent = setting.name; // Назва налаштування

    // Відображення статусу налаштування
    const statusElement = settingElement.querySelector('.setting-status');
    statusElement.textContent = setting.active ? 'Active' : 'Draft'; // Статус налаштування

    // Перемикання "active" класу
    if (setting.active) {
        settingElement.classList.add('Active');
    } else {
        settingElement.classList.remove('Active');
    }

    // 4. Додавання обробника події для кнопки видалення
    const deleteButton = settingElement.querySelector('.delete-icon');
    deleteButton.addEventListener('click', function() {
        removeSettingHandler(setting.id); // Виклик функції видалення
    });

    // 5. Додавання до DOM
    const settingsList = document.querySelector('#settings-list');
    settingsList.appendChild(settingElement);
}

function toggleEmptyState() {
    // 1. Отримуємо посилання на елементи порожнього стану та таблиці налаштувань
    const emptyStateElement = document.querySelector('#empty-state');
    const settingsTable = document.querySelector('#settings-table');
    
    // 2. Перевіряємо, чи state.settings порожній
    if (state.settings.length === 0) {
        // Якщо порожній, відображаємо порожній стан і приховуємо таблицю
        emptyStateElement.style.display = 'block'; // Показуємо повідомлення про порожній стан
        settingsTable.style.display = 'none'; // Приховуємо таблицю налаштувань
    } else {
        // Якщо не порожній, приховуємо порожній стан і показуємо таблицю
        emptyStateElement.style.display = 'none'; // Приховуємо повідомлення про порожній стан
        settingsTable.style.display = 'table'; // Показуємо таблицю налаштувань
    }
}

const state = {
    settings: []
};

document.addEventListener('DOMContentLoaded', function () {
    const createButton = document.querySelector('.button.create');
    createButton.addEventListener('click', function () {
        const settingName = document.getElementById('setting-name').value;
        const settingStatus = document.getElementById('setting-status').value;

        if (settingName) { // Перевірка, що ім'я налаштування не порожнє
            const newSetting = {
                name: settingName,
                status: settingStatus
            };
            addNewSetting(newSetting);
            document.getElementById('setting-name').value = ''; // Очищення поля введення
        } else {
            alert('Please enter a setting name.'); // Повідомлення, якщо поле порожнє
        }
    });
});

function addNewSetting(newSetting) {
    // 1. Додавання нового налаштування до state.settings
    state.settings.push(newSetting);

    // 2. Очищення попереднього рендеру
    const settingsList = document.querySelector('#settings-list');
    settingsList.innerHTML = ''; // Очищення списку перед рендером

    // 3. Оновлення порожнього стану
    toggleEmptyState();

    // 4. Рендеринг кожного налаштування
    state.settings.forEach(setting => {
        renderSettingElement(setting); // Відображення кожного налаштування
    });
}

function renderSettingElement(setting) {
    const settingsList = document.querySelector('#settings-list');

    const row = document.createElement('tr');
    row.classList.add('settings-item');

    const settingLink = document.createElement('td');
    settingLink.innerHTML = `<a href="#">${setting.name}</a>`;
    row.appendChild(settingLink);

    const statusCell = document.createElement('td');
    statusCell.innerHTML = `<span class="status ${setting.status.toLowerCase()}">${setting.status}</span>`;
    row.appendChild(statusCell);

    const actionsCell = document.createElement('td');
    actionsCell.innerHTML = '<img src="assets/Icontrash.svg" alt="Delete" class="delete-icon">';
    row.appendChild(actionsCell);

    settingsList.appendChild(row);
}

document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        // Видалення класу active з інших елементів
        document.querySelectorAll('.tab.active').forEach(function(activeTab) {
            activeTab.classList.remove('active');
        });

        // Додавання класу active до поточного елемента
        this.classList.add('active');
    });
});
