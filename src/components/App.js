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

    const reset = useCallback(e => {
        setMostu(new Mostu());
        setBuffer('');
        setMsg({text: '', className: ''});

        if(e) e.target.blur();
    }, []);

    const printMessage = useCallback((text, persistant = false) => {
        setMsg({text, className: ''});

        if(!persistant)
        setTimeout(() => {
            setMsg(m => {
                return {...m, className: 'toast'};
            });
        }, 0);
    }, []);

    useEffect(() => {
        const onKeyPress = ({key}) => {
            switch (key) {
                case 'Enter':
                    const result = mostu.tryWord(buffer);
                    if(result.valid) setBuffer('');
                    else printMessage(result.msg);

                    const status = mostu.getStatus();
                    if(status.lose)
                        printMessage(`Dommage, le mot était «${status.anwser}».`, true);
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
    }, [mostu, buffer, printMessage, reset]);

    return <>
        <button tabIndex='-1' id='reset-button' onClick={reset}>&#128472;</button>
        <div id='message-container' className={msg.className}>{msg.text}</div>
        <Grid grid={mostu.getGrid()} buffer={!mostu.getStatus().finished ? buffer : null}></Grid>
    </>;
}
