import { h, Component } from 'preact';

export default class Footer extends Component<any, any> {
    render() {
        return <footer>
            <div className="label">
                <i className="fa fa-facebook-official" />
                <a href="http://facebook.com/kakanss">Jonathan Boellke</a>
            </div>
            
            <div className="label">
                <i className="fa fa-phone" />
                <span>070 - 555 72 75</span>
            </div>
            
            <div className="label">
                <i className="fa fa-envelope" />
                <span>jonathanboellke@gmail.com</span>
            </div>
        </footer>
    }
}