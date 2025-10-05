# 🌌 Galaxy Download System

Автоматическая система загрузки высококачественных изображений галактик из NASA API.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
cd x:/nura/nasa/web2
npm install
```

### 2. Загрузка галактик
```bash
npm run download-galaxies
```

Скрипт автоматически:
- 🔍 Ищет изображения галактик по 13 различным запросам
- 📥 Загружает высококачественные версии (orig/large)
- 💾 Сохраняет в `public/media/galaxies/`
- 📋 Создает метаданные в `galaxies_metadata.json`

### 3. Запуск приложения
```bash
npm start
```

Перейдите на `/map-andromeda` для исследования галактик.

## 📁 Структура файлов

```
web2/
├── scripts/
│   └── downloadGalaxies.js          # Скрипт загрузки
├── public/
│   └── media/
│       └── galaxies/                # Загруженные изображения
│           ├── *.jpg                # Изображения галактик
│           └── galaxies_metadata.json # Метаданные
└── src/
    └── components/
        └── GalaxySelector/          # Компонент выбора галактик
```

## 🔧 Настройка

### NASA API Key (опционально)
Для увеличения лимитов запросов:
```bash
export NASA_API_KEY=your_api_key_here
```

### Поисковые запросы
Скрипт ищет галактики по следующим запросам:
- `andromeda galaxy`
- `spiral galaxy`
- `elliptical galaxy`
- `whirlpool galaxy`
- `sombrero galaxy`
- `pinwheel galaxy`
- `cartwheel galaxy`
- `antennae galaxies`
- `stephan quintet`
- `galaxy cluster`
- `hubble galaxy`
- `messier galaxy`
- `ngc galaxy`

## 🎮 Использование

### В интерфейсе:
1. Откройте `/map-andromeda`
2. Выберите галактику из списка слева
3. Используйте элементы управления для навигации:
   - **Колесо мыши**: Зум
   - **Клик и перетаскивание**: Панорамирование
   - **Кнопки**: Плавный зум и сброс

### Программно:
```javascript
import GalaxySelector from './components/GalaxySelector/GalaxySelector';

const [selectedGalaxy, setSelectedGalaxy] = useState(null);

<GalaxySelector 
  onGalaxySelect={setSelectedGalaxy}
  selectedGalaxy={selectedGalaxy}
/>
```

## 🔄 Принцип работы тайлов

Система тайлов остается неизменной:
- ✅ Viewport-based rendering
- ✅ Progressive loading
- ✅ Tile caching
- ✅ Memory optimization

Каждая галактика обрабатывается как отдельное изображение с теми же оптимизациями.

## 📊 Метаданные галактик

Каждая галактика содержит:
```json
{
  "filename": "Galaxy_Name_NASA_ID.jpg",
  "title": "Официальное название",
  "description": "Описание от NASA",
  "nasaId": "Уникальный ID NASA",
  "dateCreated": "Дата создания",
  "center": "Центр NASA",
  "originalUrl": "Оригинальный URL"
}
```

## 🚨 Устранение неполадок

### Ошибка "Galaxies metadata not found"
```bash
npm run download-galaxies
```

### Изображения не загружаются
1. Проверьте папку `public/media/galaxies/`
2. Убедитесь что файлы скачались
3. Проверьте консоль браузера на ошибки

### Медленная загрузка
- Скрипт добавляет задержки между запросами (1-2 сек)
- Это нормально для соблюдения лимитов NASA API

## 🎯 Возможности расширения

### Добавление новых галактик:
1. Отредактируйте `GALAXY_QUERIES` в `downloadGalaxies.js`
2. Запустите `npm run download-galaxies`

### Поддержка других форматов:
- Измените фильтры в функции `getHighResImageUrl`
- Добавьте поддержку `.png`, `.tiff` и др.

### Генерация тайлов:
- Добавьте скрипт для нарезки больших изображений
- Интегрируйте с существующей системой тайлов

## 📈 Производительность

- **Загрузка**: ~3-5 изображений на запрос
- **Размер**: Обычно 5-50 МБ на изображение
- **Качество**: Максимально доступное в NASA API
- **Кэширование**: Автоматическое, не перезагружает существующие

## 🔗 API Endpoints

- **NASA Images API**: `https://images-api.nasa.gov/search`
- **Asset API**: `https://images-api.nasa.gov/asset/{nasa_id}`
- **Документация**: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
