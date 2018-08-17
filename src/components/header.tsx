import { h, Component } from 'preact';
import { View } from './enums/view';

export interface IHeaderProps {
    renderCallback: (view: View) => void;
}

export default class Header extends Component<IHeaderProps, any> {
    render() {
        return <header className="top-header">
            <nav className="wrapper">
                <div className="logo"></div>
                <input type="checkbox" id="menu-toggle" />
                <label for="menu-toggle" class="label-toggle"></label>
                <ul id="nav-menu">
                    <li><a href="#" onClick={() => this.props.renderCallback(View.Start)}>Me</a></li>
                    <li><a href="#" onClick={() => this.props.renderCallback(View.Snake)}>Snake!</a></li>
                    <li><a href="#" onClick={() => this.props.renderCallback(View.Examples)}>Stuff I did</a></li>
                    <li><a href="#" onClick={() => this.props.renderCallback(View.Dev)}>Dev</a></li>
                    <li><a href="#" onClick={() => this.props.renderCallback(View.Reviews)}>Reviews</a></li>
                </ul>
            </nav>
        </header>
    }
}