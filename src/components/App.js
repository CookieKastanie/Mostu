import './App.css';

//* test
import { Mostu } from '../services/Mostu'
import { Grid } from './Grid';
import { MostuContext } from './MostuContext';
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
        <MostuContext.Provider value={new Mostu()}>
            <Grid></Grid>
        </MostuContext.Provider>
    </>;
}
