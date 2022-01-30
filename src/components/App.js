import './App.css';

import { Mostu } from '../services/Mostu'
import { Grid } from './Grid';
import { useCallback, useEffect, useState } from 'react';

const checkKey = key => {
    if(key.length === 1) {
        key = key.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();

        if(key >= 'A' && key <= 'Z') return key;
    }

    return '';
}

export const App = () => {
    const [mostu, setMostu] = useState(() => new Mostu());
    const [buffer, setBuffer] = useState('');
    const [msg, setMsg] = useState({text: '', className: ''});

    const reset = useCallback(() => {
        setMostu(new Mostu());
        setBuffer('');
        setMsg({text: '', className: ''});
    }, []);

    useEffect(() => {
        const onKeyPress = ({key}) => {
            switch (key) {
                case 'Enter':
                    const result = mostu.tryWord(buffer);
                    if(result.valid) setBuffer('');
                    else {
                        setMsg({text: result.msg, className: ''});
                        setTimeout(() => {
                            setMsg(m => {
                                return {...m, className: 'toast'};
                            });
                        }, 0);
                    }
                    break;

                case 'Backspace':
                    setBuffer(buffer => buffer.slice(0, -1));
                    break;
            
                case 'Escape':
                    reset();
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
    }, [mostu, buffer, reset]);

    return <>
        <h1>Mostu</h1>
        <button onClick={reset}>Rejouer</button>
        <p className={msg.className}>{msg.text}</p>
        <Grid grid={mostu.getGrid()} buffer={!mostu.isFinished() ? buffer : null}></Grid>
    </>;
}
