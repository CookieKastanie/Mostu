import { useContext, useEffect, useState } from 'react';
import { Mostu } from '../services/Mostu';
import './Grid.css';
import { MostuContext } from './MostuContext';


const checkKey = key => {
    if( key.length === 1 && ((key >= "A" && key <= "Z") || (key >= "a" && key <= "z"))){
        return key
    } else return ""
}

const stateToClassName= state => {
    if(state === Mostu.VALID){
        return "LettreTrouve"
    }else if(state === Mostu.MISPLACED){
        return "LettreMauvaisePlace"
    }   return ""
}

const Line = ({word}) =>{
let cellNum = 0;
    
    return <>
        <tr>
            {word.map(infos => <td className={stateToClassName(infos.state)} key={cellNum++}>{infos.letter}</td>)}
        </tr>
    </>
}

const createLines = grid => {
    let lines = [];
    for(let i = 0; i < grid.getHeight(); ++i) {
        lines.push(<Line word={grid.getLine(i)} key={i} />);
    }
  
    return lines;
  }

export const Grid = () => {
    const mostu = useContext(MostuContext);
    console.log(mostu)
    const [buffer, setBuffer] = useState("");
    
    useEffect(() => {
        
        const onKeyPress = event =>{
            let key = event.key;
            setBuffer(buffer + checkKey(key));
        }

        window.addEventListener("keypress", onKeyPress);
        return () => {
            window.removeEventListener("keypress", onKeyPress);
        }
    })


    return <>
    {buffer}
        <section id="grille">
            <table>
                <tbody>
                    {createLines(mostu.getGrid())}            
                </tbody>
            </table>
        </section>
        
    </>;
}
