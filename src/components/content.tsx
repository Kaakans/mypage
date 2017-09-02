import { h, Component } from 'preact';

export default class Content extends Component<any, any> {
    render() {
        return <div id="content" className="content-container">
            <div className="box content-box-1">JENS</div>
            <div className="box content-box-2">ADAM</div>
            <div className="box content-box-3">DAVE</div>
        </div>
    }
}