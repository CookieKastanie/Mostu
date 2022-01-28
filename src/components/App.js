import './App.css';

//* test
import { Mostu } from '../services/Mostu'
const mostu = new Mostu();
mostu.onWin(() => {
    console.log('Win');
});
mostu.onLose(() => {
    console.log('Lose');
});
window.mostu = mostu;
//*/

export const App = () => {
    return <>
        <h1>Mostu</h1>
    </>;
}
