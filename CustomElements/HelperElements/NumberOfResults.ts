export default class NumberOfResults extends HTMLElement{
    set number(val: number){
        this.textContent = `${val} results:`
    }
}