import { h, Component } from 'preact';
import BloggPost from './classes/blogg-post';
import PostSummary from './blogg-post-summary';

export default class Dev extends Component<any, any> {
    
    private posts: BloggPost[] = [
        new BloggPost(
            "Test Title 1", 
            [
                "This here is a little test post of sorts.",
                "This is paragraph two of this test post."
            ],
            "../src/images/heart.png"
        ),
        new BloggPost(
            "Test Title 2", 
            [
                "This here is a little test post of sorts.",
                "This is paragraph two of this test post."
            ],
            "../src/images/heart.png"
        )
    ];

    render() {
        return <div class="dev-blogg">
            { this.posts.map(post => <PostSummary post={post} />) }
        </div>;
    }
}