import { Mostu } from '../services/Mostu';
import './Grid.css';

const stateToClassName = state => {
    switch (state) {
        case Mostu.VALID:
            return 'valid-letter';

        case Mostu.MISPLACED:
            return 'misplaced-letter';
    
        default:
            return '';
    }
}

const Line = ({word, override}) =>{
    const letters = [];
    for(let i = 0; i < word.length; ++i) {
        const infos = word[i];
        let classes = stateToClassName(infos.state);

        if(override !== null) {
            if(i < override.length) {
                if(override[i] !== infos.letter) {
                    infos.state = Mostu.INVALID;
                    infos.letter = override[i];
                }
            } else {
                classes += ' darken';
            }
        }

        letters.push(<td className={classes} key={i}>{infos.letter}</td>);
    }

    return <>
        <tr>
            {letters}
        </tr>
    </>
}

export const Grid = ({grid, buffer}) => {
    let lines = [];
    for(let i = 0; i < grid.getHeight(); ++i) {
        let override = null;
        if(i === grid.getCurrentLineIndex()) override = buffer;
        lines.push(<Line word={grid.getLine(i)} override={override} key={i}/>);
    }

    return <>
        <section id="grid">
            <table>
                <tbody>
                    {lines}            
                </tbody>
            </table>
        </section>
    </>;
}
