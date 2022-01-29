import './App.css';

import { Mostu } from '../services/Mostu'
import { Grid } from './Grid';
import { useCallback, useEffect, useState } from 'react';

const checkKey = key => {
    if(key.length === 1
        && ((key >= 'A' && key <= 'Z')
        || (key >= 'a' && key <= 'z'))) {
            
        return key.toUpperCase();
    }

    return '';
}

export const App = () => {
    const [mostu, setMostu] = useState(() => new Mostu());
    const [buffer, setBuffer] = useState(mostu.getFirstLetter());

    useEffect(() => {
        const onKeyPress = ({key}) => {
            switch (key) {
                case 'Enter':
                    /*setBuffer(buffer => {
                        const result = mostu.tryWord(buffer);
                        if(result.valid) return '';
                        else return buffer;
                    });*/

                    const result = mostu.tryWord(buffer);
                    if(result.valid) setBuffer(mostu.getFirstLetter());
                    else console.log(result.msg);
                    break;

                case 'Backspace':
                    setBuffer(buffer => buffer.slice(0, -1));
                    break;
            
                default:
                    if(buffer.length < mostu.getLength()) {
                        setBuffer(buffer => buffer + checkKey(key));
                    }
                    break;
            }
        }

        window.addEventListener('keydown', onKeyPress);
        return () => window.removeEventListener('keydown', onKeyPress);
    }, [mostu, buffer]);

    const reset = useCallback(() => {
        setMostu(new Mostu());
        setBuffer('');
    }, []);

    return <>
        <h1>Mostu</h1>
        <button onClick={reset}>Rejouer</button>
        <Grid grid={mostu.getGrid()} buffer={!mostu.isFinished() ? buffer : ''}></Grid>
    </>;
}
