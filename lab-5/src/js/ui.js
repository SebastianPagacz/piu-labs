import { colorAllShapes, colorSingleShape } from "./helpers.js";
import { store, lStore } from './store.js'

export const initListeners = () => {
    const shapesContainer = document.getElementById("shapes-container");
    const squareCounterElement = document.getElementById("squareCounter");
    const circleCounterElement = document.getElementById("circleCounter");

    store.subscribe((state) => {
        squareCounterElement.innerText = state.squareCounter;
        circleCounterElement.innerText = state.circleCounter;
    });

    function unpackLocalStorage(){
        let tasks = JSON.parse(localStorage.getItem('shape')) || [];

        tasks.forEach(shape => {
            console.log(shape);
            const shapeElement = document.createElement("div");
            shapeElement.style.backgroundColor = shape.color;
            shapeElement.classList.add("shape");
            
            if(shape.classes[1] == "circle-element"){
                shapeElement.classList.add(shape.classes[1]);
                store.incrementCircle();

                shapeElement.addEventListener("click", () => {
                    store.decrementCircle();
                    shapeElement.remove();
                    lStore.updateLocalStorage();
                });
            }
            else{
                shapeElement.classList.add(shape.classes[1]);
                store.incrementSquare();

                shapeElement.addEventListener("click", () => {
                    store.decrementSquare();
                    shapeElement.remove();
                    lStore.updateLocalStorage();
                });
            }

            shapesContainer.appendChild(shapeElement);
        });

    }

    unpackLocalStorage();

    const squareBtn = document.getElementById("add-square");
    const squareColorBtn = document.getElementById("color-square");

    const circleBtn = document.getElementById("add-circle");
    const circleColorBtn = document.getElementById("color-circle");

    squareBtn.addEventListener("click", () => {
        const s = document.createElement("div");
        s.classList.add("shape");
        s.classList.add("square-element");

        colorSingleShape(s);

        s.addEventListener("click", () => {
            store.decrementSquare();
            s.remove();
        });

        shapesContainer.appendChild(s);

        store.incrementSquare();

        lStore.updateLocalStorage();
    });

    squareColorBtn.addEventListener("click", () => {
        colorAllShapes(".square-element");
        lStore.updateLocalStorage();
    });

    circleBtn.addEventListener("click", () => {
        const c = document.createElement("div");
        c.classList.add("shape");
        c.classList.add("circle-element");

        colorSingleShape(c);

        c.addEventListener("click", () => {
            store.decrementCircle();
            c.remove();
            lStore.updateLocalStorage();
        });

        shapesContainer.appendChild(c);

        store.incrementCircle();

        lStore.updateLocalStorage();
    });

    circleColorBtn.addEventListener("click", () => {
        colorAllShapes(".circle-element");
        lStore.updateLocalStorage();
    });


};