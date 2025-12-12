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
     * 💡 МЕТОД, ЯКИЙ БУВ ВІДСУТНІЙ: initializeSlides()
     * Знаходить всі слайди, зберігає їх і встановлює початковий активний клас.
     */
    initializeSlides() {
        // Знаходимо всі елементи з класом '.fade'
        this.slideElements = document.querySelectorAll(this.slideSelector);

        if (this.slideElements.length === 0) {
            console.error(`Слайди з селектором '${this.slideSelector}' не знайдено.`);
            return;
        }

        // Встановлюємо перший слайд як активний
        this.slideElements[this.currentSlideIndex].classList.add('active');
        console.log(`Знайдено ${this.slideElements.length} слайдів. Перший слайд активовано.`);
    },

    /**
     * Додає обробник кліку до кожного слайда (для індикатора або прямого переходу).
     */
    addSlideClickHandlers() {
        this.slideElements.forEach((element, index) => {
            // Прив'язуємо обробник до кожного слайда
            element.addEventListener('click', () => this.handleSlideClick(index));
        });
        console.log("Обробники кліку додано до всіх слайдів.");
    },

    /**
     * Обробляє клік на самому слайді.
     * @param {number} index - Індекс слайда, на який клікнули.
     */
    handleSlideClick(index) {
        console.log(`Клік на слайді з індексом: ${index}. Переходимо.`);
        this.goToSlide(index);
    },

    /**
     * Обробляє клік на кнопках навігації (.prev або .next).
     * @param {string} directionSelector - Селектор, який вказує напрямок.
     */
    handleNavigation(directionSelector) {
        let newIndex = this.currentSlideIndex;
        const totalSlides = this.slideElements.length;

        if (totalSlides === 0) return;

        if (directionSelector === '.next') {
            // Перехід до наступного слайда (циклічно)
            newIndex = (this.currentSlideIndex + 1) % totalSlides;
        } else if (directionSelector === '.prev') {
            // Перехід до попереднього слайда (циклічно)
            newIndex = (this.currentSlideIndex - 1 + totalSlides) % totalSlides;
        }

        this.goToSlide(newIndex);
    },

    /**
     * Перемикає відображення слайдів, оновлюючи класи 'active'.
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
    sliderManager: SliderManager,

    init() {
        console.log("--- Ініціалізація програми ---");

        // 1. 💡 ВИПРАВЛЕННЯ: Тепер initializeSlides() існує і виконується першим
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

        // 4. Додавання обробників кліку до всіх слайдів (.fade)
        App.sliderManager.addSlideClickHandlers();

        console.log("--- Ініціалізація завершена ---");
    }
};


// Головна інструкція для запуску:
document.addEventListener('DOMContentLoaded', App.init);