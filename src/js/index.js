import Search from './models/Search';
import { elements } from './views/base';
import * as searchView from './views/searchView';
// Global state of the App
/**-- Search Object 
 * -- Current recipe object
 * -- Shopping List object
 * --Liked recipes
*/

const state = {};

const controlSearch = async () => {
    // 1) Get query frtom view 
    const query = searchView.getInput();
    // console.log(query);

    if(query) {
        //2) New Search object and add to state 
        state.search = new Search(query);

        //3) prepare  UI for the search
        searchView.clearInput();
        searchView.clearResults();
        
        // 4) Search for recipes
        await state.search.getResults();
        // 5) Render results on UI 
        searchView.renderResults(state.search.result);
        
    
    }

}
elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();

} );


