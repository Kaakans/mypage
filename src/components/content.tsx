import { h, Component } from 'preact';
import Article from './article';

export default class Content extends Component<any, any> {
    render() {
        return <div className="article-container">
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
        </div>
    }
}