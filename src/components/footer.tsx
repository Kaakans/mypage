import { h, Component } from 'preact';

export default class Footer extends Component<any, any> {
    render() {
        return <footer>
            <div className="label">
                <div>
                    <a href="https://facebook.com/kakanss">
                        <i className="fa fa-facebook-official" />Jonathan Boellke
                    </a>
                </div>
                <div>
                    <a href="https://github.com/kaakans">
                        <i className="fa fa-github" />Github
                    </a>
                </div>
                <div>
                    <i className="fa fa-phone" />
                    <span>070 - 555 72 75</span>
                </div>
                <div>
                    <i className="fa fa-envelope" />
                    <span>jonathanboellke@gmail.com</span>
                </div>
            </div>

            {/* <div className="label">
                <i className="fa fa-phone" />
                <span>070 - 555 72 75</span>
            </div>
            
            <div className="label">
                <i className="fa fa-envelope" />
                <span>jonathanboellke@gmail.com</span>
            </div> */}
        </footer>
    }
}