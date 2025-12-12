/**
 * Клас SliderElement
 * Відповідає за ініціалізацію та поведінку одного елемента управління (кнопок Prev/Next).
 */
class SliderElement {
    /**
     * @param {string} selector - CSS-селектор елемента (наприклад, '.prev', '.next').
     * @param {number} index - Індекс елемента в NodeList.
     */
    constructor(selector, index = 0) {
        this.selector = selector;
        this.index = index;
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
            // Прив'язка контексту this до методу handleClick
            this.element.addEventListener('click', this.handleClick.bind(this));
        }
    }

    handleClick(event) {
        console.log(`Клік спрацював на кнопці: ${this.selector}[${this.index}]`);
        // Виклик менеджера слайдів для переходу
        App.sliderManager.handleNavigation(this.selector);
    }
}

/**
 * Об'єкт SliderManager
 * Керує станом, перемиканням та відображенням усіх слайдів (.fade).
 */
const SliderManager = {
    slideElements: [],
    currentSlideIndex: 0,
    slideSelector: '.fade',

    /**
     * Знаходить всі слайди та встановлює початковий активний клас.
     * @param {number} [initialIndex=0] - Початковий індекс слайда.
     */
    initializeSlides(initialIndex = 0) {
        this.slideElements = document.querySelectorAll(this.slideSelector);

        if (this.slideElements.length === 0) {
            console.error(`Слайди з селектором '${this.slideSelector}' не знайдено.`);
            return;
        }

        const totalSlides = this.slideElements.length;
        // Гарантуємо, що початковий індекс знаходиться в межах [0, totalSlides - 1]
        const validIndex = (initialIndex % totalSlides + totalSlides) % totalSlides;

        this.setCurrentSlide(validIndex);
    },

    /**
     * Встановлює поточний слайд, оновлюючи класи 'active'.
     * @param {number} newIndex - Індекс слайда, який потрібно встановити як поточний.
     */
    setCurrentSlide(newIndex) {
        // 1. Видаляємо клас 'active' з поточного слайда, якщо він існує
        if (this.slideElements[this.currentSlideIndex]) {
            this.slideElements[this.currentSlideIndex].classList.remove('active');
        }

        // 2. Встановлюємо новий індекс
        this.currentSlideIndex = newIndex;

        // 3. Додаємо клас 'active' до нового слайда
        this.slideElements[this.currentSlideIndex].classList.add('active');
        console.log(`Слайд активовано: №${newIndex}`);
    },

    /**
     * Додає обробник кліку до кожного слайда (для індикатора або прямого переходу).
     */
    addSlideClickHandlers() {
        this.slideElements.forEach((element, index) => {
            element.addEventListener('click', () => this.handleSlideClick(index));
        });
        console.log("Обробники кліку додано до всіх слайдів.");
    },

    handleSlideClick(index) {
        this.goToSlide(index);
    },

    /**
     * Обробляє клік на кнопках навігації (.prev або .next).
     */
    handleNavigation(directionSelector) {
        let newIndex = this.currentSlideIndex;
        const totalSlides = this.slideElements.length;

        if (totalSlides === 0) return;

        if (directionSelector === '.next') {
            newIndex = (this.currentSlideIndex + 1) % totalSlides;
        } else if (directionSelector === '.prev') {
            // Формула для коректного циклічного переходу назад
            newIndex = (this.currentSlideIndex - 1 + totalSlides) % totalSlides;
        }

        this.goToSlide(newIndex);
    },

    /**
     * Перемикає відображення слайдів, оновлюючи класи 'active'.
     */
    goToSlide(newIndex) {
        if (newIndex < 0 || newIndex >= this.slideElements.length) {
            console.warn("Неможливо перейти до цього слайда. Індекс поза межами.");
            return;
        }
        this.setCurrentSlide(newIndex);
    }
};


/**
 * Об'єкт D (Тестування випадкових чисел)
 * Використовується для встановлення випадкового стартового слайда.
 */
const D = {};

D.Random = {
    one: 'act1',
    two: 'act2',
    three: 'act3',
    result: 0,

    random: function() {
        // Генеруємо число від 1 до 3
        const max = 3; 
        this.result = Math.floor(Math.random() * max) + 1;
        console.log(`Випадкове число (1-${max}), збережене в D.Random.result: ${this.result}`);
    }
};


/**
 * Об'єкт App (Точка входу)
 * Відповідає за ініціалізацію всієї програми та керування екземплярами класів.
 */
const App = {
    sliderInstancePrev: null,
    sliderInstanceNext: null,
    sliderManager: SliderManager,

    init() {
        console.log("--- Ініціалізація програми App ---");

        // 1. Генеруємо випадкове число для старту
        D.Random.random(); 

        // 2. Встановлюємо початковий слайд, використовуючи випадкове число
        // (Треба відняти 1, оскільки індекси починаються з 0, а число від 1)
        const startIndex = D.Random.result - 1;
        App.sliderManager.initializeSlides(startIndex);

        // 3. Створення екземплярів класу для кнопок управління
        App.sliderInstancePrev = new SliderElement('.prev', 0);
        App.sliderInstanceNext = new SliderElement('.next', 0);

        // 4. Додавання обробників подій
        if (App.sliderInstancePrev.element) {
            App.sliderInstancePrev.addEvents();
        }
        if (App.sliderInstanceNext.element) {
            App.sliderInstanceNext.addEvents();
        }

        // 5. Додавання обробників кліку до слайдів
        App.sliderManager.addSlideClickHandlers();
        console.log("--- Ініціалізація App завершена ---");
    }
};


// ========================= ГОЛОВНА ТОЧКА ВХОДУ =========================
// Запускаємо App.init після повного завантаження DOM
document.addEventListener('DOMContentLoaded', App.init);