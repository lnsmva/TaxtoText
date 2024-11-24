document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const statusMessage = document.getElementById('statusMessage');

    // Событие выбора файла
    fileInput.addEventListener('change', async () => {
        if (!fileInput.files.length) {
            statusMessage.textContent = 'Пожалуйста, выберите файл.';
            return;
        }

        // Создаем объект FormData для отправки файла
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            statusMessage.textContent = 'Отправка файла...';

            // Отправляем файл на сервер
            const response = await fetch('http://127.0.0.1:5000/process', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                // Сохраняем данные шаблона для последующего редактирования
                localStorage.setItem('templateData', JSON.stringify(result));
                statusMessage.textContent = 'Файл обработан успешно. Переход на страницу редактирования.';
                setTimeout(() => {
                    window.location.href = 'edit.html';
                }, 1000);
            } else {
                statusMessage.textContent = `Ошибка: ${result.error}`;
            }
        } catch (error) {
            statusMessage.textContent = 'Произошла ошибка при отправке файла.';
        }
    });
});
