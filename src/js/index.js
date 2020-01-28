import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader , clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
// Global state of the App
/**-- Search Object 
 * -- Current recipe object
 * -- Shopping List object
 * --Liked recipes
*/

const state = {};

/**----------Search Controller-----------------------*/
const controlSearch = async () => {
    // 1) Get query frtom view 
    const query = searchView.getInput();


    if(query) {
        //2) New Search object and add to state 
        state.search = new Search(query);

        //3) prepare  UI for the search
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
                   // 4) Search for recipes
        await state.search.getResults();
        // 5) Render results on UI 
        clearLoader();
        searchView.renderResults(state.search.result);
        } catch(err){
            alert('Something wrong with the search');
            clearLoader();
        }
    }

}
elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
    console.log(goToPage);

});

/**---------Recipe Controller---------------- */
//47746

const r = new Recipe(47746);
r.getRecipe();
console.log(r);

const controlRecipe = async () => {
    //Get ID from URL
        const id = window.location.hash.replace('#', '');
        console.log(id);
    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item.
        if(state.search) searchView.highlightSelected(id);
        //Creating new Recipe object
        state.recipe = new Recipe(id);

        try {
            //Get recipe Data and parse ingredient
        await state.recipe.getRecipe();

        state.recipe.parseIngredients();
        //Calculate servinge and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        //Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        } catch(err) {
            alert('Error processing recipe');
        }
        
    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Handling recipe button clicks
elements.recipe.addEventListener('click', e=> {
        if(e.target.matches('.btn-decrease, .btn-decrease *')){
            //Decrease button is clicked
            if(state.recipe.servings > 1){
                state.recipe.updateServings('dec');
                recipeView.updateServingIngredients(state.recipe);
            }
            
        } else if(e.target.matches('.btn-increase, .btn-increase *')){
            //increase button is clicked
            state.recipe.updateServings('inc');
            recipeView.updateServingIngredients(state.recipe);
        }
        // console.log(state.recipe);
})
