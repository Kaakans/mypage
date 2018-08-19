import { h, Component } from 'preact';
import Header from './header';
import Content from './content';
import Examples from './examples';
import Reviews from './reviews';
import Footer from './footer';
import Snake from './snake';
import Dev from './dev-blogg';
import Banner from './banner';
import { View } from './enums/view';

export interface IComponentState {
    currentView: View;
}

export default class App extends Component<any, IComponentState> {

    private renderCallback = (view: View) => {
        this.setState({ currentView: view });
    }

    private renderStart = () => {
        return <Content />;
    }

    private renderExamples = () => {
        return <Examples />;
    }

    private renderReviews = () => {
        return <Reviews />;
    }

    private renderSnake = () => {
        return <Snake />;
    }

    private renderDev = () => {
        return <Dev />;
    }

    private renderContent = () => {
        var html = this.renderStart();

        if (this.state.currentView === View.Examples)
            html = this.renderExamples();
            
        if (this.state.currentView === View.Reviews)
            html = this.renderReviews();

        if (this.state.currentView === View.Snake)
            html = this.renderSnake();

        if (this.state.currentView === View.Dev)
            html = this.renderDev(); 

        return <div className="content-container">{html}</div>;
    }

    render() {
        return <div>
            <Banner />
            <Header renderCallback={this.renderCallback} />
            {this.renderContent()}
            <Footer />
        </div>;
    }
}