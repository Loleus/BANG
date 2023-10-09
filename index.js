const { style } = document.body;

const bgc = document.querySelector('.bgc');
const logo = document.querySelector('.logo');
const info = document.querySelector(".info div p");
const screws = document.querySelectorAll(".srub");
const circle = document.getElementById("box");
const inputs = document.querySelectorAll('input');
const btns = document.getElementsByTagName('button');
const numer = document.getElementById('numer');
const data = document.getElementById('data');
const spanInfoX = document.getElementById('x');
const spanInfoY = document.getElementById('y');
const nav = document.querySelector('nav');

const fps = 1000 / 24;
const coordSize = 200;
const fullDate = new Date();
const {round, abs, floor} = Math;

let biggestRatio;
let mm = fullDate.getMonth() + 1;
let dd = fullDate.getDate();
let yyyy = fullDate.getFullYear();
let date = dd;
// fix difference between sliders and coords
const getInputValue = index => Number(inputs[index].value - coordSize); 

const animCircle = () => {
    // inputs
    let sumX = getInputValue(0)
    let sumY = getInputValue(1)
    // x
    style.setProperty('--lx', `${50 - sumX*0.7}%`);
    style.setProperty('--sx', `${sumX / 2}vh`);
    circle.style.left = (sumX / 4) + "%"
    // y
    style.setProperty('--ly', `${50 - sumY*0.7}%`);
    style.setProperty('--sy', `${sumY / 2}vh`);
    circle.style.top = (sumY / 4) + "%";
    // shadow
    (abs(sumX) > abs(sumY))
        ? style.setProperty('--ss', `${(abs(sumX) / 10) + 1}vh`)
        : style.setProperty('--ss', `${(abs(sumY) / 10) + 1}vh`);
    // info 
    spanInfoX.innerText = `X = ${sumX} px`
    spanInfoY.innerText = `Y = ${sumY} px`

};

const enableInputsOnStop = (flag) => {

    btns[5].disabled = flag;
    inputs[0].disabled = flag;
    inputs[1].disabled = flag;

};

const updateInputs = (posX, posY) => {

    inputs[0].value = posX;
    inputs[1].value = posY;

};

const doSetTimeout = (delay, posX, posY) => {

    const updatedX = floor(posX + coordSize);
    const updatedY = floor(posY + coordSize);

    setTimeout(() => {

        updateInputs(updatedX, updatedY)

        animCircle();

        enableInputsOnStop(abs(posX) || abs(posY));

    }, delay);

};

const createRatiosArr = () => [abs(getInputValue(0)), abs(getInputValue(1))];

const getRatiosArr = () => {

    biggestRatio = [...createRatiosArr()].sort((a, b) => b - a)[0];

    const newRatioArr = createRatiosArr().map(ratio => ratio ? ratio /= biggestRatio : ratio = 0);
    
    return newRatioArr

};

const resetCircleCoords = () => {

    let ratios = getRatiosArr();
    let pos_X = getInputValue(0);
    let pos_Y = getInputValue(1);
    let delay = fps;

    if (biggestRatio) {

        for (let k = 0; k < biggestRatio; k++) {

            Number(pos_X) > 0 ? pos_X -= ratios[0] : pos_X += ratios[0];
            Number(pos_Y) > 0 ? pos_Y -= ratios[1] : pos_Y += ratios[1];

            doSetTimeout(delay, round(pos_X), round(pos_Y));

            delay += fps;
            
        };

    } else {

        doSetTimeout(delay, 0, 0)

    }

};

const effects = ({ classList }, classChange, button) => {

    classList.toggle(classChange);

    button.innerHTML = classList.contains(classChange) ? "stop" : "start";

};

const btnsHandler = (i) => {

    switch (i) {
        case 0:
            screws.forEach(item => effects(item, "rotate", btns[i]));
            break;
        case 1:
            effects(info, "scroll", btns[i]);
            break;
        case 2:
            effects(logo, "pulse", btns[i]);
            break;
        case 3:
            effects(nav, "shaker", btns[i]);
            break;
        case 4:
            effects(bgc, "anim", btns[i]);
            break;
        case 5:
            resetCircleCoords();
            break;
        default:
            alert('Wooot?');
    };

};

const setDate = () => {

    mm = mm < 10 ? `0${mm}` : mm;
    dd = dd < 10 ? `0${dd}` : dd;

    data.textContent = `${dd}/${mm}/${yyyy}`;
    dayUpdate()
};

const dayUpdate = () => numer.textContent = date < 10 ? `#0${date}` : "#" + date;

const navListener = () => {

    nav.onclick = () => {

        date++;

        dayUpdate();

    };

};

const btnsListeners = () => {

    for (let i = 0; i < btns.length; i++) {

        btns[i].onclick = () => btnsHandler(i);

    };

};

const inputsListeners = () => {

    inputs.forEach((input) => input.addEventListener('input', ({ target }) => animCircle(target), false));

};

const addListeners = () => {

    navListener();

    btnsListeners();

    inputsListeners();

};

const main = () => {

    resetCircleCoords();

    setDate();

    addListeners();

};
