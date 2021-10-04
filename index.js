'use strict'
const bodyStyles = document.body.style;

const clock = document.getElementById("box");
const inputs = document.querySelectorAll('input');
const btns = document.getElementsByTagName('button');
const numer = document.getElementById('numer');
const data = document.getElementById('data');
const spanInfo = document.querySelectorAll('span');
let biggestRatio;
const fps = 1000 / 24.97;
const precision = 100;
const coordSize = 200;
let mm = new Date().getMonth() + 1;
let dd = new Date().getDate()
let yyyy = new Date().getFullYear();
let date = dd;
const eventHandlers = () => {
    // info line
    nav.onclick = () => {
        date++;
        numer.textContent = spanUpdate();
    };
    // buttons
    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = () => btnsHandler(i);
    }
    // input sliders 
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', inputHandler, false)
    }
}
const main = () => {
    data.textContent = setDate();
    numer.textContent = spanUpdate();
    btnsHandler(5); // reset clock coord
    eventHandlers(); // observers
}
function setDate() {
    mm = mm < 10 ? `0${mm}` : mm;
    dd = dd < 10 ? `0${dd}` : dd;
    return `${dd}/${mm}/${yyyy}`;
}
function spanUpdate() {
    let number = date < 10 ? `#0${date}` : "#" + date;
    return number
}
const effects = (object, classChange, button) => {
    object.classList.toggle(classChange);
    button.innerHTML = object.classList.contains(classChange) ? "stop" : "start";
}
const inputHandler = ({ target }) => {
    moveSlider(target);
}
const positionInfo = (name,sum) => {
    for (let i = 0; i < spanInfo.length; i++) {
        if (spanInfo[i].id === name) {
            spanInfo[i].innerText = `${name.toUpperCase()} = ${sum} px`
        }
    }
}
const moveSlider = ({ name, value }) => {
    const sum = value - coordSize; // fix difference between sliders and coords
    if (sum === 0) { // enable reset button on 0 
        btns[5].disabled = false; 
    }

    if(name === "x") {
        bodyStyles.setProperty('--lx', `${50 - sum}%`);
        bodyStyles.setProperty('--sx', `${(sum / 8)}vh`);
        clock.style.left = sum + "px"
    }
    if (name ==='y') {
        bodyStyles.setProperty('--ly', `${50 - sum}%`);
        bodyStyles.setProperty('--sy', `${(sum / 8)}vh`);
        clock.style.top = sum + "px";
    }
    positionInfo(name,sum) // update coord info
}
const doSetTimeout = (slider, delay, i) => {
    setTimeout(() => {
        slider.value = Math.floor(i + coordSize);
        moveSlider(slider);
    }, delay);
}
const counter = (slider, ratio) => {
    const { value } = slider
    let delay = fps;
    const i = Number(value - coordSize);
    let counter = Number(i);
    for (let k = 0; k < biggestRatio; k++) {
        Number(counter) > 0
        ? counter -= ratio
        : counter += ratio;
        let i_counter = Math.round(counter * precision) / precision;
        doSetTimeout(slider, delay, i_counter);
        delay += fps;
    }
    if (counter != -1) {
        counter = 0;
        doSetTimeout(slider, delay, Math.round(counter * precision) / precision);
    }
}
const getValue = () => {
    let ratios = [];
    for (let i = 0; i < inputs.length; i++) {
        const slider = inputs[i];
        const value = slider.value
        const sliderRatio = Number(Math.abs(value - coordSize))
        const ratio = sliderRatio;
        ratios.push(ratio);
    };
    let sortedRatios = [...ratios].sort((a, b) => b - a)
    biggestRatio = sortedRatios[0]
    for (let i = 0; i < ratios.length; i++) {
        if (ratios[i] != 0) {
            let newRatio = ratios[i] / biggestRatio;
            ratios[i] = Math.round(newRatio * precision) / precision;
        } else {
            ratios[i] = 0;
        }
    }
    return ratios;
}
const resetCoord = () => {
    let ratios = getValue();
    for (let i = 0; i < inputs.length; i++) {
        const slider = inputs[i];
        counter(slider, ratios[i]);
    }
    btns[5].disabled = true;
}
const btnsHandler = (i)=>  {
    let button = btns[i];
    switch (i) {
        case 0:
            document.querySelectorAll(".srub").forEach(item => {
                effects(item, "rotate", button);
            })
            break;
        case 1:
            effects(document.querySelector(".info div p"), "scroll", button);
            break;
        case 2:
            effects(document.querySelector('.logo'), "pulse", button);
            break;
        case 3:
            effects(nav, "shaker", button);
            break;
        case 4:
            effects(document.querySelector('.bgc'), "anim", button);
            break;
        case 5:
            resetCoord();
            break;
        default:
            alert('Wooot?');
    }
}
