import { h, Component } from 'preact';

export default class Footer extends Component<any, any> {
    render() {
        return <footer>
            <div className="label">
                <span>
                    <i className="fa fa-envelope" />
                    jonathanboellke@gmail.com
                </span>
            </div>
        </footer>
    }
}