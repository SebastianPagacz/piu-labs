class Store {
    #State = {
        squareCounter: 0,
        circleCounter: 0,
    };

    #subscribers = new Set();

    getState(){
        return { ...this.#State };
    }

    getSquareCounter(){
        return this.#State.squareCounter;
    }

    getCircleCounter() {
        return this.#State.circleCounter;
    }

    incrementSquare(){
        this.#State.squareCounter++;
        this.#notify();
    }

    incrementCircle(){
        this.#State.circleCounter++;
        this.#notify();
    }

    decrementSquare(){
        this.#State.squareCounter--;
        this.#notify();
    }

    decrementCircle(){
        this.#State.circleCounter--;
        this.#notify();
    }

    subscribe(callback){
        this.#subscribers.add(callback);

        callback(this.getState());

        return () => this.#subscribers.delete(callback);
    }

    #notify(){
        for (const cb of this.#subscribers){
            cb(this.getState());
        }
    }
}

class lStorage{
    loadLocalStorage(){
        const data = localStorage.getItem("shape");
        if(data){
            const parsedData = JSON.parse(data);
            return parsedData;
        }
        else{
            return [];
        }
    }

    updateLocalStorage(){
        let currentShapes = document.querySelectorAll(".shape");

        let allShapes = [];

        currentShapes.forEach(shape =>{
            const shapeObject = {
                classes: shape.classList,
                color: shape.style.backgroundColor
            };

            allShapes.push(shapeObject);
        })

        localStorage.setItem("shape", JSON.stringify(allShapes));
    }

}

export const lStore = new lStorage();
export const store = new Store();