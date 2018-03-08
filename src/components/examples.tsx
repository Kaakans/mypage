import { h, Component } from 'preact';
import Example from './example';
import SnakeExample from './snakeExample';
import Snake from './snake';
import { ViewExample } from './enums/viewExample';

export interface IExamplesState {
    displayView: ViewExample;
}

export default class Examples extends Component<any, IExamplesState> {

    private toggleShowExample(displayView: ViewExample) {
        this.setState({ displayView: displayView });
    }

    render() {
        return <div className="examples">
            {this.renderExampleView()}

            <div className="example-row">
                <SnakeExample displayExampleCallback={this.toggleShowExample} />
                <Example />
            </div>
            
            <div className="example-row">
                <Example />
                <Example />
            </div>
        </div>
    }

    private renderExampleView() {
        if (this.state.displayView === ViewExample.Snake)
            return <div className="display-example">
                <Snake />
            </div>;
    }
}