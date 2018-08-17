import { h, Component } from 'preact';
import BloggPost from './classes/blogg-post';

export interface IPostSummaryProps {
    post: BloggPost;
}

export default class PostSummary extends Component<IPostSummaryProps, any> {

    private renderParagraphSummary(paragraphs: string[]) {
        if (!paragraphs.length) return;
        
        let part = paragraphs[0].slice(0, 300);
        return <p> { part.length > 300 ? `${part}..` : part} </p>;
    }

    render() {
        return <div class="post">
            <img src={ this.props.post.thumbNail } />
            <div class="summary">
                <h3>{ this.props.post.title }</h3>
                { this.renderParagraphSummary(this.props.post.paragraphs) }
            </div>
        </div>;
    }

}