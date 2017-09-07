import { h, Component } from 'preact';

export default class Article extends Component<any, any> {
    render() {
        return <article>
            <header>
                <p style="text-align: center;">
                    <picture>
                        <source media="(max-width: 960px)" srcset="./src/images/watch_256w.jpg" />
                        <source media="(min-width: 961px)" srcset="./src/images/watch_525w.jpg" />
                        <img src="./src/images/watch_525w.jpg" alt="A nice watch" />
                    </picture>
                    <h2>Lorem ipsum</h2>
                </p>
            </header>
            <section>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed porta tristique pellentesque. 
                    In rutrum pellentesque pharetra. 
                    Nulla a libero nunc. 
                    Nullam quis venenatis arcu, et elementum tellus. 
                    Aenean commodo, leo vel sollicitudin dignissim, 
                    nisl justo molestie eros, eu gravida dui dui sit amet urna. 
                    Vivamus pulvinar volutpat orci et iaculis. 
                    Fusce ut risus tincidunt, posuere nulla in, interdum magna. 
                    Duis fermentum, lectus nec feugiat vulputate, 
                    lacus ipsum convallis lacus, sed vestibulum tellus ex eget libero. 
                    Maecenas rhoncus ex sit amet consequat ultricies. 
                    Quisque maximus nulla ut imperdiet vestibulum. 
                    Aliquam fermentum felis in ligula egestas aliquam. 
                    Donec quis orci mauris.
                </p>

                {/* <p>
                    Nunc elementum metus vel libero dignissim tincidunt. 
                    Vivamus at augue ut massa varius cursus. 
                    Nam cursus, felis sit amet semper rhoncus, 
                    diam ipsum facilisis dolor, sit amet accumsan lorem neque at ex. 
                    Fusce id mattis lectus, sed luctus quam. 
                    Pellentesque eleifend in dui ac congue. 
                    Ut scelerisque massa nec lacinia consectetur. 
                    Suspendisse felis tellus, blandit ac volutpat volutpat, 
                    viverra at lacus.
                </p>

                <p>
                    Praesent consectetur, sem vel eleifend rhoncus, 
                    turpis ex vestibulum metus, in molestie nisl risus at diam. 
                    Etiam in tortor augue. 
                    Aenean nec diam non sapien egestas congue vitae vitae urna. 
                    Mauris non justo in arcu elementum dignissim. 
                    Praesent faucibus leo nec diam lacinia rutrum. 
                    Mauris varius mollis nibh, quis tempus dui rhoncus at. 
                    Ut ut egestas sapien. Maecenas in mauris ut nisl efficitur accumsan. 
                    Morbi ut sollicitudin nulla.
                </p> */}
            </section>
        </article>
    }
}