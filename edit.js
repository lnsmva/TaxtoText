document.addEventListener('DOMContentLoaded', () => {
    //const templateEditor = document.getElementById('templateEditor');
    const saveBtn = document.getElementById('saveBtn');
    const saveStatus = document.getElementById('saveStatus');
    const uploadedImage = document.getElementById('uploadedImage');


    // Инициализация редактора CodeMirror
    // const templateEditor = CodeMirror(document.getElementById('editor'), {
    //     lineNumbers: true,
    //     mode: 'javascript', // Режим отображения синтаксиса
    //     theme: 'default',
    //     value: '' // Начальные данные (загрузим позже)
    // });

    // Загрузка данных в редактор
    const templateData = JSON.parse(localStorage.getItem('templateData'));
    const imagePath = localStorage.getItem('uploadedImagePath');

    if (templateData) {
        templateEditor.value = JSON.stringify(templateData, null, 4);
        // editor.value =JSON.stringify(templateData, null, 4);
    }
    if (imagePath) {
        uploadedImage.src = `uploads/${imagePath}`;
    }

    // // Загрузка данных в редактор
    // const templateData = JSON.parse(localStorage.getItem('templateData'));
    // const imagePath = localStorage.getItem('uploadedImagePath');

    

    // if (templateData) {
    //     // Если templateData хранит текстовые данные, отобразим их как текст
    //     templateEditor.value = typeof templateData === 'string' 
    //         ? templateData 
    //         : JSON.stringify(templateData, null, 4); // Фолбэк для объектов
    // }

    // if (imagePath) {
    //     uploadedImage.src = `uploads/${imagePath}`;
    // }


    saveBtn.addEventListener('click', async () => {
        try {
            const editedData = JSON.parse(templateEditor.value);
            const format = document.getElementById('formatSelect').value; // Получаем выбранный формат
    
            // Создание Blob с данными, которые будут сохранены в файл
            const blob = new Blob([JSON.stringify(editedData, null, 2)], { type: 'application/json' });
            
            

            // Создание ссылки для скачивания
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            if (format == 'pdf'){
                link.download = 'output.pdf'; 
            } else if(format =='docx'){
                link.download = 'output.docx'; 
            } else if (format =='accdb'){
                link.download = 'output.accdb'; 
            }else{
                link.download = 'output.xlsx';
            }
    
            // Инициализация скачивания
            link.click();
    
            saveStatus.textContent = 'Данные успешно сохранены на вашем компьютере.';
        } catch (error) {
            saveStatus.textContent = 'Произошла ошибка при сохранении данных.';
        }
    });


    // saveBtn.addEventListener('click', async () => {
    //     try {
    //         const format = document.getElementById('formatSelect').value; // Получаем выбранный формат
    //         const editedData = JSON.parse(templateEditor.value); // Получаем отредактированные данные
    
    //         if (format === 'json') {
    //             // Сохранение данных в формате JSON
    //             const blob = new Blob([JSON.stringify(editedData, null, 2)], { type: 'application/json' });
    
    //             // Создание ссылки для скачивания
    //             const link = document.createElement('a');
    //             link.href = URL.createObjectURL(blob);
    //             link.download = 'editedData.json'; // Имя файла
    
    //             // Инициализация скачивания
    //             link.click();
    //             saveStatus.textContent = 'Данные успешно сохранены в формате JSON.';
    //         } else if (format === 'pdf') {
    //             // Сохранение данных в формате PDF
    //             const doc = new jsPDF();
    //             doc.text(JSON.stringify(editedData, null, 2), 10, 10);
    //             doc.save('editedData.pdf');
    //             saveStatus.textContent = 'Данные успешно сохранены в формате PDF.';
    //         } else if (format === 'docx') {
    //             // Сохранение данных в формате DOCX
    //             const zip = new PizZip();
    //             const doc = new Docxtemplater(zip);
    //             doc.setData(editedData);
    
    //             try {
    //                 doc.render();
    //                 const out = doc.getZip().generate({ type: 'blob' });
    //                 const link = document.createElement('a');
    //                 link.href = URL.createObjectURL(out);
    //                 link.download = 'editedData.docx';
    //                 link.click();
    //                 saveStatus.textContent = 'Данные успешно сохранены в формате DOCX.';
    //             } catch (error) {
    //                 saveStatus.textContent = 'Ошибка при генерации DOCX файла.';
    //             }
    //         }
    //     } catch (error) {
    //         saveStatus.textContent = 'Произошла ошибка при сохранении данных.';
    //     }
    // });
    

});


// document.addEventListener('DOMContentLoaded', () => {
//     // const templateEditor = document.getElementById('templateEditor');
//     const saveBtn = document.getElementById('saveBtn');
//     const saveStatus = document.getElementById('saveStatus');
//     const uploadedImage = document.getElementById('uploadedImage');


//     // Инициализация редактора CodeMirror
//     const editor = CodeMirror(document.getElementById('editor'), {
//         lineNumbers: true,
//         mode: 'javascript', // Режим отображения синтаксиса
//         theme: 'default',
//         value: '' // Начальные данные (загрузим позже)
//     });

//     // Загрузка данных в редактор
//     const templateData = JSON.parse(localStorage.getItem('templateData'));
//     const imagePath = localStorage.getItem('uploadedImagePath');

//     if (templateData) {
//         editor.setValue(JSON.stringify(templateData, null, 4)); // Загружаем данные в CodeMirror
//     }

//     if (imagePath) {
//         uploadedImage.src = `uploads/${imagePath}`; // Загружаем изображение
//     }

//     saveBtn.addEventListener('click', async () => {
//         try {
//             const editedData = JSON.parse(templateEditor.value);
    
//             // Создание Blob с данными, которые будут сохранены в файл
//             const blob = new Blob([JSON.stringify(editedData, null, 2)], { type: 'application/json' });
    
//             // Создание ссылки для скачивания
//             const link = document.createElement('a');
//             link.href = URL.createObjectURL(blob);
//             link.download = 'editedData.json'; // Имя файла
    
//             // Инициализация скачивания
//             link.click();
    
//             saveStatus.textContent = 'Данные успешно сохранены на вашем компьютере.';
//         } catch (error) {
//             saveStatus.textContent = 'Произошла ошибка при сохранении данных.';
//         }
//     });
    

// });
