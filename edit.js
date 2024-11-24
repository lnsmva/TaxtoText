document.addEventListener('DOMContentLoaded', () => {
    //const templateEditor = document.getElementById('templateEditor');
    const saveBtn = document.getElementById('saveBtn');
    const saveStatus = document.getElementById('saveStatus');
    const uploadedImage = document.getElementById('uploadedImage');


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
    

    saveBtn.addEventListener('click', async () => {
        try {
            const editedData = JSON.parse(templateEditor.value);
            const format = document.getElementById('formatSelect').value; 
    
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
    
            link.click();
    
            saveStatus.textContent = 'Данные успешно сохранены на вашем компьютере.';
        } catch (error) {
            saveStatus.textContent = 'Произошла ошибка при сохранении данных.';
        }
    });
