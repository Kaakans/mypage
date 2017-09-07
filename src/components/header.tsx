import { h, Component } from 'preact';

export default class Header extends Component<any, any> {
    render() {
        return <header className="top-header">
            <nav>
                <div></div>
                <input type="checkbox" id="menu-toggle" />
                <label for="menu-toggle" class="label-toggle"></label>
                <ul>
                    <li><a href="#">Lorem</a></li>
                    <li><a href="#">Ipsum</a></li>
                    <li><a href="#">Serum</a></li>
                </ul>
            </nav>
        </header>
    }
}