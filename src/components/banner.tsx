import { h, Component } from 'preact';

export default class Banner extends Component<any, any> {


    render() {
        return <div class="banner">
            {this.renderGrid()}
        </div>
    }

    renderTextOverlay() {
        return <div class="overlay">
            <h3>Jonathan Boellke</h3>
            <h4>Software developer</h4>
        </div>;
    }

    renderGrid() {
        return <div class="grid">
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>

            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item item-long">Jonathan Boellke</div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>

            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>

            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>

            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
            <div class="item"><div class="center"></div></div>
        </div>;
    }
}