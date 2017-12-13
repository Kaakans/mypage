import { h, Component } from 'preact';
import Example from './example';

export default class Examples extends Component<any, any> {
    render() {
        return <div className="examples">
            <Example />
            <Example />
            <Example />
            <Example />
        </div>
    }
}