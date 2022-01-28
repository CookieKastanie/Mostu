import { words } from '../data/words';

export class Mostu {
    constructor(maxTry = 6) {
        const w = words[Math.floor(Math.random() * words.length)];
        this.word = w.split('');
        
        this.maxTry = maxTry;

        this.grid = [];

        const line = new Array(this.getLength());
        line.fill({
            state: Mostu.WAITING,
            letter: '.'
        });

        line[0] = {
            state: Mostu.VALID,
            letter: this.word[0]
        };
        this.grid.push(line);

        this.onWin();
        this.onLose();

        this.finished = false;
    }

    getLength() {
        return this.word.length;
    }

    onWin(cb = () => {}) {
        this.winCb = cb;
    }

    onLose(cb = () => {}) {
        this.loseCb = cb;
    }

    isFinished() {
        return this.finished;
    }

    tryWord(w) {
        if(this.finished) return {
            valid: false,
            msg: 'Le jeu est fini.'
        };

        if(typeof w !== 'string') return {
            valid: false,
            msg: 'Invalid input state.'
        };

        if(w.length !== this.getLength()) return {
            valid: false,
            msg: `Le mot n'est pas de la bonne taille.`
        };

        w = w.toUpperCase();
        w = words.find(i => w === i);

        if(!w) return {
            valid: false,
            msg: `Le mot n'est pas dans le dictionnaire.`
        };

        w = w.split('');

        let win = true;
        const lastGridLine = this.grid[this.grid.length - 1];
        const line = [];
        for(let i = 0; i < this.getLength(); ++i) {
            const o = {
                state: Mostu.INVALID,
                letter: w[i]
            };

            if(w[i] === this.word[i]) {
                o.state = Mostu.VALID;
            } else {
                win = false;

                for(let j = 0; j < this.getLength(); ++j) {
                    if(w[i] === this.word[j] && lastGridLine[j].state === Mostu.WAITING) {
                        o.state = Mostu.MISPLACED;
                    }
                }
            }

            line.push(o);
        }

        // ajout nouvelle ligne
        const newLine = []
        for(let i = 0; i < this.getLength(); ++i) {
            if(lastGridLine[i].state === Mostu.VALID) {
                newLine.push({
                    state: Mostu.VALID,
                    letter: lastGridLine[i].letter
                });
            } else if(line[i].state === Mostu.VALID) {
                newLine.push({
                    state: Mostu.VALID,
                    letter: line[i].letter
                });
            } else {
                newLine.push({
                    state: Mostu.WAITING,
                    letter: '.'
                });
            }

            lastGridLine[i] = {...line[i]};
        }

        const lose = (this.grid.length) === this.maxTry;

        if(!win && !lose) this.grid.push(newLine);
        else this.finished = true;
        if(win) this.winCb();
        else if(lose) this.loseCb();

        return {
            valid: true,
            msg: ``
        }
    }

    printGrid() {
        for(let i = 0; i < this.grid.length; ++i) {
            let line = '';
            let css = [];

            for(let j = 0; j < this.getLength(); ++j) {
                line += `%c${this.grid[i][j].letter}`;
                switch (this.grid[i][j].state) {
                    case Mostu.VALID:
                        css.push('background: #E44; color: #FFF;');
                        break;
                    case Mostu.MISPLACED:
                        css.push('background: #EE4; color: #000;');
                        break;

                    default:
                        css.push('background: #44E; color: #FFF;');
                        break;
                }
            }

            console.log(line, ...css);
        }
    }
}

Mostu.VALID = 0;
Mostu.INVALID = 1;
Mostu.MISPLACED = 2;
Mostu.WAITING = 3;
