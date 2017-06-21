import { h, Component } from 'preact';
import Contact from './contact';

export default class App extends Component<any, any> {
    render() {
        return <div>
            <h1>Hello!</h1>
            <Contact />
        </div>;
    }
}