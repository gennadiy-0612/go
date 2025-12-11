let slider = new Object();
class slide {
    /**
     * @param {string} nameNODE - Ім'я елемента 
     */
    constructor(nameNODE) {
        this.nameNODE = nameNODE;
        this.elem = document.querySelectorAll(this.nameNODE)[2];
    }
        adding(){
        // this.elem.addEventListener('click', show);
        console.log(this.elem);
        console.log(this);
    }
}
slider.letWork = new slide('fade');
slider.allTogether = function(){
  slider.letWork.adding();
};
 
document.addEventListener('DOMContentLoaded', slider.letWork.allTogether);