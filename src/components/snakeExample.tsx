import { h, Component } from 'preact';
import { ViewExample } from './enums/viewExample';

export interface ISnakeExampleProps {
    displayExampleCallback: (view: ViewExample) => void;
}

export default class SnakeExample extends Component<ISnakeExampleProps, any> {

    private callback() {
        this.props.displayExampleCallback(ViewExample.Snake);
    }

    render() {
        let self = this;

        return <div className="example">
            <div className="box">
                <img className="snake" />
                <div className="info">
                    <div className="title">Snake</div>
                    <button onClick={self.callback}>Try it!</button>
                    <div className="text">
                        Classic snake game built with html5 canvas and Typescript.
                    </div>
                </div>
            </div>
        </div>
    }
}