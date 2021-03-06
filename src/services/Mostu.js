import { words } from '../data/words';
import { dictionary } from '../data/dictionary';

class Grid {
    constructor(x, y) {
        this.width = x;
        this.height = y;

        this.currentLine = 0;
        this.grid = [];

        for(let i = 0; i < this.height; ++i) {
            const line = new Array(this.width);
            line.fill({
                state: Mostu.WAITING,
                letter: ' '
            });

            this.grid.push(line);
        }
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    at(x, y) {
        return this.grid[y][x];
    }

    setCurrentLine(line) {
        const count = Math.min(line.length, this.width);
        for(let i = 0; i < count; ++i) {
            this.grid[this.currentLine][i] = {...line[i]};
        }

        for(let i = count; i < this.width; ++i) {
            this.grid[this.currentLine][i] = {
                state: Mostu.WAITING,
                letter: '.'
            };
        }
    }

    getLine(index) {
        const line = new Array(this.width);
        for(let i = 0; i < this.width; ++i) {
            line[i] = {...this.grid[index][i]};
        }

        return line;
    }

    getCurrentLine() {
        return this.getLine(this.currentLine);
    }

    getCurrentLineIndex() {
        return this.currentLine;
    }

    isLastLine() {
        return this.currentLine === this.height - 1;
    }

    moveNextLine() {
        if(this.isLastLine()) return false;
        ++this.currentLine;
        return true;
    }

    getGrid() {
        return this.grid;
    }

    print() {
        for(let y = 0; y < this.height; ++y) {
            let line = `%c${y + 1} `;
            let css = ['background: #FFF; color: #000;'];

            for(let x = 0; x < this.width; ++x) {
                const cell = this.grid[y][x];

                line += `%c${cell.letter}`;
                switch (cell.state) {
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

export class Mostu {
    constructor(tryCount = 6) {
        const w = words[Math.floor(Math.random() * words.length)];
        this.word = w.split('');
        
        this.tryCount = tryCount;

        this.grid = new Grid(this.getLength(), tryCount);

        this.grid.setCurrentLine([{
            state: Mostu.VALID,
            letter: this.word[0]
        }]);

        this.status = {
            finished: false,
            win: false,
            lose: false
        }
    }

    getLength() {
        return this.word.length;
    }

    getTryCount() {
        return this.tryCount;
    }

    getFirstLetter() {
        return this.word[0];
    }

    getStatus() {
        return {...this.status};
    }

    _processWord(word) {
        if(typeof word !== 'string') return {
            valid: false,
            msg: 'Invalid input state.'
        };

        if(word.length !== this.getLength()) return {
            valid: false,
            msg: `Le mot n'est pas de la bonne taille.`
        };

        word = word.toUpperCase();
        word = dictionary.find(w => word === w);

        if(!word) return {
            valid: false,
            msg: `Le mot n'est pas dans le dictionnaire.`
        };

        word = word.split('');

        if(word[0] !== this.word[0]) return {
            valid: false,
            msg: `La premi??re lettre est incorrecte.`
        }

        return {
            valid: true,
            msg: ``,
            word
        }; 
    }

    tryWord(word) {
        if(this.status.finished) return {
            valid: true,
            msg: 'Le jeu est fini.'
        };

        const processResult = this._processWord(word);
        if(!processResult.valid) return processResult;
        word = processResult.word;

        let win = true;
        const line = this.grid.getCurrentLine();

        const mapCount = new Map();
        for(const w of this.word) mapCount.set(w, 0);
        for(const w of this.word) mapCount.set(w, mapCount.get(w) + 1);

        for(let i = 0; i < this.getLength(); ++i) {
            line[i].letter = word[i];
            line[i].state = Mostu.INVALID;

            if(word[i] === this.word[i]) {
                line[i].state = Mostu.VALID;
                mapCount.set(word[i], mapCount.get(word[i]) - 1);
            } else {
                win = false;
            }
        }

        for(let i = 0; i < this.getLength(); ++i)
        for(let j = 0; j < this.getLength(); ++j) {
            const count = mapCount.get(word[i]) || 0;
            if(line[i].state !== Mostu.VALID &&
                count > 0 && word[i] === this.word[j]) {

                mapCount.set(word[i], count - 1);
                line[i].state = Mostu.MISPLACED;
                break;
            }
        }

        const oldLine = this.grid.getCurrentLine();
        const newLine = []
        for(let i = 0; i < this.getLength(); ++i) {
            const cell = {
                state: Mostu.WAITING,
                letter: '.'
            }

            if(oldLine[i].state === Mostu.VALID) {
                cell.state = Mostu.VALID;
                cell.letter = oldLine[i].letter;
            } else if(line[i].state === Mostu.VALID) {
                cell.state = Mostu.VALID;
                cell.letter = line[i].letter;
            }

            newLine.push(cell);
        }

        this.grid.setCurrentLine(line);

        if(win) {
            this.status.win = true;
            this.status.finished = true;
        } else if(this.grid.isLastLine()) {
            this.status.lose = true;
            this.status.finished = true;
            this.status.anwser = this.word.join('');
        } else {
            this.grid.moveNextLine();
            this.grid.setCurrentLine(newLine);
        }

        return {
            valid: true,
            msg: ``
        }
    }

    getGrid() {
        return this.grid;
    }

    printGrid() {
        this.grid.print();
    }
}

Mostu.VALID = 0;
Mostu.INVALID = 1;
Mostu.MISPLACED = 2;
Mostu.WAITING = 3;
