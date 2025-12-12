/**
 * Клас SliderElement
 * Відповідає за ініціалізацію та поведінку одного елемента слайдера (кнопок Prev/Next).
 * (Без змін, окрім додавання статичного поля для більш чистої ініціалізації)
 */
class SliderElement {
    // Статичне поле для зберігання спільної логіки слайдера, якщо вона знадобиться
    // static totalSlides = 0; 

    /**
     * @param {string} selector - CSS-селектор елемента (наприклад, '.prev', '.next').
     * @param {number} index - Індекс елемента в NodeList, який потрібно обрати.
     */
    constructor(selector, index = 0) {
        this.selector = selector;
        this.index = index;
        
        // Тут ми шукаємо елемент лише за селектором та індексом
        this.element = this._findElement();

        if (!this.element) {
            console.error(`Елемент з селектором '${selector}' та індексом ${index} не знайдено.`);
        }
    }

    _findElement() {
        const allElements = document.querySelectorAll(this.selector);
        return allElements[this.index] || null;
    }

    addEvents() {
        if (this.element) {
            this.element.addEventListener('click', this.handleClick.bind(this));
        }
    }

    handleClick(event) {
        console.log(`Клік спрацював на кнопці: ${this.selector}[${this.index}]`);
        // У цьому місці, при кліку на Prev/Next, має бути викликаний App.sliderManager
        App.sliderManager.handleNavigation(this.selector); 
    }
}

/**
 * Об'єкт SliderManager (Новий компонент)
 * Керує станом, перемиканням та відображенням усіх слайдів.
 */
/**
 * Об'єкт SliderManager
 * Керує станом, перемиканням та відображенням усіх слайдів.
 */
const SliderManager = {
    slideElements: [], 
    currentSlideIndex: 0,
    slideSelector: '.fade',

    // ... (методи initializeSlides, addSlideClickHandlers, handleSlideClick, goToSlide залишаються без змін)
    
    // 💡 НОВИЙ МЕТОД: handleNavigation
    /**
     * Обробляє клік на кнопках навігації (.prev або .next).
     * @param {string} directionSelector - Селектор, який вказує напрямок (наприклад, '.prev').
     */
    handleNavigation(directionSelector) {
        let newIndex = this.currentSlideIndex;
        const totalSlides = this.slideElements.length;

        if (totalSlides === 0) return; // Нічого не робити, якщо немає слайдів

        if (directionSelector === '.next') {
            // Перехід до наступного слайда. Використовуємо оператор % для циклічного переходу.
            newIndex = (this.currentSlideIndex + 1) % totalSlides;
        } else if (directionSelector === '.prev') {
            // Перехід до попереднього слайда.
            // Якщо newIndex = -1, додаємо totalSlides, щоб отримати останній індекс.
            newIndex = (this.currentSlideIndex - 1 + totalSlides) % totalSlides;
        }
        
        // Викликаємо існуючий метод для виконання переходу та оновлення DOM
        this.goToSlide(newIndex);
    },
    
    /**
     * Перемикає відображення слайдів. (Залишається як було)
     * @param {number} newIndex - Індекс слайда, який потрібно показати.
     */
    goToSlide(newIndex) {
        if (newIndex < 0 || newIndex >= this.slideElements.length) {
            console.warn("Неможливо перейти до цього слайда. Індекс поза межами.");
            return;
        }

        // 1. Видаляємо клас 'active' з поточного слайда
        this.slideElements[this.currentSlideIndex].classList.remove('active');

        // 2. Встановлюємо новий індекс
        this.currentSlideIndex = newIndex;

        // 3. Додаємо клас 'active' до нового слайда
        this.slideElements[this.currentSlideIndex].classList.add('active');
        console.log(`Показано слайд №${this.currentSlideIndex}`);
    }
};
// ... решта коду,

    /**
     * Додає обробник кліку до кожного слайда (якщо потрібно для індикатора або перемикання).
     */
    addSlideClickHandlers() {
        this.slideElements.forEach((element, index) => {
            // Прив'язуємо обробник до кожного слайда
            element.addEventListener('click', () => this.handleSlideClick(index));
        });
        console.log("Обробники кліку додано до всіх слайдів.");
    },
    
    /**
     * Обробник кліку на самому слайді.
     * @param {number} index - Індекс слайда, на який клікнули.
     */
    handleSlideClick(index) {
        console.log(`Клік на слайді з індексом: ${index}`);
        this.goToSlide(index);
    },

    /**
     * Перемикає відображення слайдів.
     * @param {number} newIndex - Індекс слайда, який потрібно показати.
     */
    goToSlide(newIndex) {
        if (newIndex < 0 || newIndex >= this.slideElements.length) {
            console.warn("Неможливо перейти до цього слайда. Індекс поза межами.");
            return;
        }

        // 1. Видаляємо клас 'active' з поточного слайда
        this.slideElements[this.currentSlideIndex].classList.remove('active');

        // 2. Встановлюємо новий індекс
        this.currentSlideIndex = newIndex;

        // 3. Додаємо клас 'active' до нового слайда
        this.slideElements[this.currentSlideIndex].classList.add('active');
        console.log(`Показано слайд №${this.currentSlideIndex}`);
    }
};


/**
 * Об'єкт App (Точка входу)
 * Відповідає за ініціалізацію всієї програми та керування екземплярами класів.
 */
const App = {
    sliderInstancePrev: null,
    sliderInstanceNext: null,
    sliderManager: SliderManager, // Підключаємо менеджер слайдів

    init() {
        console.log("--- Ініціалізація програми ---");

        // 1. Ініціалізація головного менеджера слайдів (знаходить всі слайди)
        App.sliderManager.initializeSlides();

        // 2. Створення екземплярів класу для кнопок управління
        App.sliderInstancePrev = new SliderElement('.prev', 0);
        App.sliderInstanceNext = new SliderElement('.next', 0);

        // 3. Додавання обробників подій до кнопок Prev/Next
        if (App.sliderInstancePrev.element) {
            App.sliderInstancePrev.addEvents();
        }
        if (App.sliderInstanceNext.element) {
            App.sliderInstanceNext.addEvents();
        }

        // 4. 🚨 Додавання обробників кліку до всіх слайдів (.fade)
        App.sliderManager.addSlideClickHandlers(); 

        console.log("--- Ініціалізація завершена ---");
    }
};


// Головна інструкція для запуску:
document.addEventListener('DOMContentLoaded', App.init);