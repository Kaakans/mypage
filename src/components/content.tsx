import { h, Component } from 'preact';
import Article from './article';

export default class Content extends Component<any, any> {
    render() {
        return <div className="article-container">
            <Article data={"55"} />
            {this.renderGithubs()}
        </div>
    }

    private renderGithubs = () => {
        var articles = ["Kaakans", "Pracha", "Erik", "Johnny", "Anders"];
        return articles.map(x => <Article data={x} />);
    }
}