import { h, Component } from 'preact';
import Example from './example';

export default class Examples extends Component<any, any> {
    render() {
        return <div className="examples">
            <div className="example-row">
                <Example />
                <Example />
            </div>
            <div className="example-row">
                <Example />
                <Example />
            </div>
        </div>
    }
}