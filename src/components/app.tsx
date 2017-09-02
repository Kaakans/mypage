import { h, Component } from 'preact';
import Header from './header';
import Content from './content';
import Footer from './footer';

export default class App extends Component<any, any> {
    render() {
        return <div className="outer-container">
            <div className="box header-box">
                <Header />
            </div>
            <div className="box content-box">
                <Content />
            </div>
            <div className="box footer-box">
                <Footer />
            </div>
        </div>;
    }
}