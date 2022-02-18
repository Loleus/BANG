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
const getInputValue = (index) => {
    const getin = inputs[index];
    return Number(getin.value - coordSize); // fix difference between sliders and coords
};
const positionInfo = () => {
    spanInfoX.innerText = `X = ${getInputValue(0)} px`
    spanInfoY.innerText = `Y = ${getInputValue(1)} px`
};
const updateCssVars = () => {
    let sumX = getInputValue(0)
    let sumY = getInputValue(1)
    let xInputSS = (abs(getInputValue(0)) / 10) + 1;
    let yInputSS = (abs(getInputValue(1)) / 10) + 1;
    let circleX = 50 - sumX;
    let shadowX = sumX / 8;
    let circleY = 50 - sumY;
    let shadowY = sumY / 8;
    style.setProperty('--lx', `${circleX}%`);
    style.setProperty('--sx', `${shadowX}vh`);
    circle.style.left = (sumX / 4) + "%"
    style.setProperty('--ly', `${circleY}%`);
    style.setProperty('--sy', `${shadowY}vh`);
    circle.style.top = (sumY / 4) + "%";
    (xInputSS > yInputSS)
        ? style.setProperty('--ss', `${xInputSS}vh`)
        : style.setProperty('--ss', `${yInputSS}vh`);
};
const animCircle = () => {
    updateCssVars()
    positionInfo()
};
const disableInputs = (flag) => {
    btns[5].disabled = flag;
    inputs[0].disabled = flag;
    inputs[1].disabled = flag;
};
const updateInputs = (posX, posY) => {
    inputs[0].value = posX;
    inputs[1].value = posY;
};
const doSetTimeout = (delay, posX, posY) => {
    setTimeout(() => {
        updateInputs(floor(posX + coordSize), floor(posY + coordSize))
        animCircle();
        disableInputs((posX !== 0 || posY !== 0));
    }, delay);
};
const createRatiosArray = () => {
    let ratiosArr = []
    ratiosArr.push(abs(getInputValue(0)));
    ratiosArr.push(abs(getInputValue(1)));
    return ratiosArr
};
const getRatiosArray = () => {
    const ratios = createRatiosArray()
    biggestRatio = [...ratios].sort((a, b) => b - a)[0];
    for (let i = 0; i < ratios.length; i++) {
        ratios[i] ? ratios[i] = ratios[i] / biggestRatio : ratios[i] = 0;
    };
    // for(let ratio of ratios) {
    //     ratio ? ratio = ratio / biggestRatio : ratio = 0;
    // }
    return ratios;
};
const resetCircleCoords = () => {
    let ratios = getRatiosArray();
    let pos_X = getInputValue(0);
    let pos_Y = getInputValue(1);
    let delay = fps;

    if (biggestRatio) {
        for (let k = 0; k < biggestRatio; k++) {
            Number(pos_X) > 0 ? pos_X -= ratios[0] : pos_X += ratios[0];
            Number(pos_Y) > 0 ? pos_Y -= ratios[1] : pos_Y += ratios[1];
            doSetTimeout(delay, round(pos_X*100)/100, round(pos_Y*100)/100);
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
    };;
};
const setDate = () => {
    mm = mm < 10 ? `0${mm}` : mm;
    dd = dd < 10 ? `0${dd}` : dd;
    data.textContent = `${dd}/${mm}/${yyyy}`;
};
const dayUpdate = () => {
    let number = date < 10 ? `#0${date}` : "#" + date;
    numer.textContent = number
};
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
    inputs.forEach((input) => {
        input.addEventListener('input', ({ target }) => {
            animCircle(target);
        }, false)
    });
};
const addListeners = () => {
    navListener();
    btnsListeners();
    inputsListeners();
};
const main = () => {
    resetCircleCoords();
    setDate();
    dayUpdate();
    addListeners();
};
