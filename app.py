from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import pytesseract
import re
import sqlite3
from datetime import datetime
from docxtpl import DocxTemplate

# Укажите путь к Tesseract на вашем компьютере
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Инициализация приложения Flask
app = Flask(__name__)
CORS(app)  # Разрешение CORS для взаимодействия с фронтендом

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Преобразование в оттенки серого
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)  # Бинаризация
    return thresh

def extract_text(image):
    return pytesseract.image_to_string(image, lang='rus')

def parse_data(text):
    data = {}
    
    # Дата в формате ДД.ММ.ГГГГ или ДД/ММ/ГГГГ
    date_match = re.search(r'\b\d{2}[./]\d{2}[./]\d{4}\b', text)
    if date_match:
        data['date'] = datetime.strptime(date_match.group(), '%d.%m.%Y').strftime('%Y-%m-%d')
    else:
        data['date'] = None

    # Сумма в формате "1000.00" или "1000,00"
    amount_match = re.search(r'\b\d+[,.]?\d*\s?(руб|RUB)?\b', text)
    if amount_match:
        data['amount'] = amount_match.group().replace(',', '.').split()[0]
    else:
        data['amount'] = None

    # БИК (9 цифр)
    bik_match = re.search(r'\b\d{9}\b', text)
    if bik_match:
        data['bik'] = bik_match.group()
    else:
        data['bik'] = None

    # ИНН (10 или 12 цифр)
    inn_match = re.search(r'\b\d{10,12}\b', text)
    if inn_match:
        data['inn'] = inn_match.group()
    else:
        data['inn'] = None

    # КПП (9 цифр)
    kpp_match = re.search(r'\b\d{9}\b', text)
    if kpp_match:
        data['kpp'] = kpp_match.group()
    else:
        data['kpp'] = None

    # Название организации
    organization_match = re.search(r'(ООО|АО|ЗАО|ИП)\s[\w\s]+', text)
    if organization_match:
        data['organization'] = organization_match.group()
    else:
        data['organization'] = None

    # Получатель
    recipient_match = re.search(r'Получатель\s([\w\s]+)', text)
    if recipient_match:
        data['recipient'] = recipient_match.group(1)
    else:
        data['recipient'] = None

    # ОКТМО (8-11 цифр)
    oktmo_match = re.search(r'\b\d{8,11}\b', text)
    if oktmo_match:
        data['oktmo'] = oktmo_match.group()
    else:
        data['oktmo'] = None

    return data

def save_to_db(data):
    conn = sqlite3.connect('receipts.db')
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS receipts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            amount REAL,
            bik TEXT,
            inn TEXT,
            kpp TEXT,
            oktmo TEXT,
            organization TEXT,
            recipient TEXT)''')

    cursor.execute('''INSERT INTO receipts (date, amount, bik, inn, kpp, organization, recipient, oktmo)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', (
                          data.get('date'),
                          #data.get('name'),
                          data.get('amount'),
                          data.get('bik'),
                          data.get('inn'),
                          data.get('kpp'),
                          data.get('oktmo'),
                          data.get('organization'),
                          data.get('recipient')))
    
    conn.commit()
    conn.close()
    print(f"Данные сохранены в БД: {data}")

# Вставка в шаблон
def generate_docx_from_template(data, template_path, output_path):
    doc = DocxTemplate(template_path)
    context = {
        'date': data.get('date'),
        'amount': data.get('amount'),
        'bik': data.get('bik'),
        'inn': data.get('inn'),
        'kpp': data.get('kpp'),
        'organization': data.get('organization'),
        'recipient': data.get('recipient'),
        'oktmo': data.get('oktmo')
    }
    
    doc.render(context)
    doc.save(output_path)
    print(f"Документ сохранен: {output_path}")
    

# Маршрут для обработки загруженного файла
@app.route('/process', methods=['POST'])
def process_receipt():
    file = request.files['file']
    if not file:
        return jsonify({'error': 'Файл не был загружен.'}), 400

    image_path = os.path.join('uploads', file.filename)
    file.save(image_path)

    template_path = 'template.docx'
    output_path = f"output_{file.filename}.docx"

    try:
        # Обработка файла
        processed_image = preprocess_image(image_path)
        text = extract_text(processed_image)
        data = parse_data(text)
        save_to_db(data)
        generate_docx_from_template(data, template_path, output_path)
        return jsonify({'message': 'Файл обработан успешно.', 'data': data, 'output_file': output_path})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Маршрут для сохранения отредактированных данных
@app.route('/save', methods=['POST'])
def save_edited_data():
    data = request.json
    if not data:
        return jsonify({'error': 'Нет данных для сохранения'}), 400

    try:
        save_to_db(data)
        generate_docx_from_template(data, 'template.docx', 'final_output.docx')
        return jsonify({'message': 'Данные успешно сохранены.'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
