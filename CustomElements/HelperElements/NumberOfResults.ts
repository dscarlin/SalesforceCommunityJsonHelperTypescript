export default class NumberOfResults extends HTMLElement{
    public set number(val: number){
        this.textContent = `${val} results:`
    }
}