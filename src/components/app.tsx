import { h, Component } from 'preact';
import Header from './header';
import Content from './content';
import Footer from './footer';

export default class App extends Component<any, any> {
    render() {
        return <div>
            <Header />
            <Content />
            <Footer />
        </div>;
    }
}