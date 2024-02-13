

class CountingGame {
    constructor() {


        this._countSetting = 21;
        this._countTotal = 21;
        this._minDecrement = 1;
        this._maxDecrement = 3;
        this._victoryCondition = 0; // zero means whoever gets total count to 0 wins
        this._turnOrder;
        this.loadCountGameEvents();
    }


    loadCountGameEvents() {
        document.getElementById('go-first')
        .addEventListener('click', this.chooseTurnOrder.bind(this, 'go-first'));

        document.getElementById('go-second')
        .addEventListener('click', this.chooseTurnOrder.bind(this, 'go-second'));

        document.getElementById('decrement-btn').addEventListener('click', this.decrementTotal
        .bind(this, 'player'));

        document.getElementById('restart').addEventListener('click', this.restart.bind(this));

        document.getElementById('min-decrement-input')
        .addEventListener('input', this.setMinDecrement.bind(this));

        document.getElementById('max-decrement-input')
        .addEventListener('input', this.setMaxDecrement.bind(this));

        document.getElementById('select-victory')
        .addEventListener('change', this.setVictoryCondition.bind(this));
    }


    setMinDecrement(e) {
        // this._minDecrement = e.target.value;
    }

    setMaxDecrement(e) {
        // this._maxDecrement = e.target.value;
    }

    setVictoryCondition(e) {
            // if(e.target.value == 'if the computer gets the total down to 0'){
            //     this._victoryCondition = 1;
            //     e.target.parentElement.nextSibling.innerText = 
            //     'You lose if you get the total down to 0 on your turn';
            // } else {
            //     this._victoryCondition = 0;
            //     e.target.parentElement.nextSibling.innerText = 
            //     'You lose if the computer gets the total down to 0 on its turn';
            // }
    }

    chooseTurnOrder(id){
        if (this._minDecrement > this._maxDecrement) {
            alert('Please make sure your minimum decrement is less than or equal to your'
            + ' maximum decrement');
            return;
        }

        if (id == 'go-first'){
            this.disableGameSettings();
            this._turnOrder = 1; // 1 means player goes first
            this.enableGame();
        } else {
            this.disableGameSettings();
            this._turnOrder = 2; // 2 means player goes second
            this.runAI();
        }
    }


    enableGame() {
        document.getElementById('decrement-input').disabled = 0;
        document.getElementById('decrement-btn').disabled = 0;
        document.getElementById('restart').disabled = 0;
    }


    enableRestart() {
        document.getElementById('restart').disabled = 0;
    }


    disableGame() {
        document.getElementById('decrement-input').disabled = 'true';
        document.getElementById('decrement-btn').disabled = 'true';
        document.getElementById('restart').disabled = 'true';
    }


    disableGameSettings() {
        document.getElementById('go-first').disabled = 'true';
        document.getElementById('go-second').disabled = 'true';
        document.getElementById('min-decrement-input').disabled = 'true';
        document.getElementById('max-decrement-input').disabled = 'true';
        document.getElementById('select-victory').disabled = 'true';
        document.getElementById('count-setting-input').style.display = 'none';
        document.querySelector('output').style.display = 'block';
    }


    decrementTotal() {  
        this.disableGame();


        const decrement = +document.getElementById('decrement-input').value;


            if(decrement < this._minDecrement) {
            alert('Your Decrement is too low, try again.');
            this.enableGame();
            return;
            } else if (decrement > this._maxDecrement || (this._countTotal - decrement) < 0) {
                alert('Your Decrement is too high, try again.');
                this.enableGame();
                return;
            } else {
                this._countTotal -= decrement;
                document.querySelector('output').innerHTML = this._countTotal;


                if (this._countTotal == 0) {
                    if(this._victoryCondition == 0) { //if the goal is to get to 0 on your turn
                        alert("You Win!");
                        this.enableRestart();
                        return;
                    } else {
                        alert("You Lose!");
                        this.enableRestart();
                        return;
                    }
                }
            }


                this.runAI();


    }


    restart() {
        this._countTotal = this._countSetting;
        document.querySelector('output').innerText = this._countTotal;
        document.getElementById('decrement-input').value = '';


        document.getElementById('decrement-input').disabled = 'true';
        document.getElementById('decrement-btn').disabled = 'true';
        document.getElementById('restart').disabled = 'true';
        document.getElementById('go-first').disabled = 0;
        document.getElementById('go-second').disabled = 0;
        document.getElementById('min-decrement-input').disabled = 0;
        document.getElementById('max-decrement-input').disabled = 0;
        document.getElementById('select-victory').disabled = 0;
        document.getElementById('count-setting-input').style.display = 'block';
        document.querySelector('output').style.display = 'none';
    }


    runAI() {


        const loadAiTurn = document.getElementById('add-ai-turn');
        const loadIcon = document.createElement('i'); loadIcon.className = 'fa-solid fa-spinner';
        const aiTurnText = document.createTextNode("It's the Computer's turn.")
        loadAiTurn.appendChild(loadIcon);loadAiTurn.appendChild(aiTurnText);
   
        setTimeout(() => {
            let end;
            let logDecrement;
   
            if (!(this._victoryCondition)) { //if the goal is to get to 0 on your turn
                // console.log(this._countTotal + " % " + (this._maxDecrement +1) + " = "
                // + (this._countTotal % (this._maxDecrement +1)));
   
                if(!(this._countTotal % (this._maxDecrement +1))) {
                    logDecrement = Math.floor(Math.random() * (this._maxDecrement) + 1);
                    end = this.decrementTotalAi(logDecrement);
                } else {
                    logDecrement = this._countTotal % (this._maxDecrement + 1);
                    end = this.decrementTotalAi(this._countTotal % (this._maxDecrement + 1));
                }
                // console.log(logDecrement)
   
            } else { //if the goal is to avoid getting to 0 on your turn
                switch (this._countTotal % (this._maxDecrement + 1)) {
                    case 1:
                        if (this._countTotal == 1) {
                            logDecrement = 1;
                            end = this.decrementTotalAi(1);
                            break;
                        } else {
                            logDecrement = Math.floor(Math.random() * (this._maxDecrement + 1));
                            end = this.decrementTotalAi(logDecrement);
                        //this random decriment would not work if we changed the minDecriment
                        break;
                        }
                    case 2:
                        logDecrement = 1;
                        end = this.decrementTotalAi(1);
                        break;
                    case 3:
                        logDecrement = 2;
                        end = this.decrementTotalAi(2);
                        break;
                    case 0:
                        logDecrement = 3;
                        end = this.decrementTotalAi(3);
                        break;
                }
   
            }
            loadAiTurn.lastChild.remove(); loadAiTurn.lastChild.remove();
   
            if(end == 'continue') {
                this.enableGame();
            } else {
                this.enableRestart();
            }
   
            document.getElementById('decrement-input').value = '';
        }, 3000)
       
   
    }
   
    decrementTotalAi(decrement) {  
   
                this._countTotal -= decrement;
                document.querySelector('output').innerHTML = this._countTotal;
   
                if (this._countTotal == 0) {
                   
                    if(this._victoryCondition != 0) { //if the goal is to get to 0 on your turn
                        alert("You Win!");
                        this.disableGame();
                        return 'end';
                     } else {
                        alert("You Lose!");
                        this.disableGame();
                        return 'end';
                    }
                }
   
                return 'continue';
    }
  }




 




const countGame = new CountingGame();

