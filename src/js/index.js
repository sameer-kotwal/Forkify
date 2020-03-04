// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';

import {elements, renderLoader, clearLoader} from './views/base';

const state ={
  search:null,
  recipe:null
}

const controlSearch = async ()=>{
  //1. get the query

  const query= searchView.getInput();

  if(query){
    //2. get a new search object

    state.search= new Search(query);

    //3) prepare UI
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResult);
    //4) Search for Recipes
    try {
      await state.search.getResults()

      //5) render results on UI

      clearLoader();
      searchView.renderResults(state.search.recipes);

    } catch(error) {
      console.log(error);
      console.log('something wrong with search...:(');
    }
  }

}

elements.searchForm.addEventListener('submit', e=> {
  e.preventDefault();
  controlSearch();
})


elements.searchResPages.addEventListener('click', e => {
  const btn= e.target.closest('.btn-inline');
  if(btn){
      const goToPage= parseInt(btn.dataset.goto,10);
      searchView.clearResults();
      searchView.renderResults(state.search.recipes,goToPage)
  }

})


// Recipe

const controlRecipe = async () => {
  const hash= window.location.hash;
  const id= hash.substring(1,hash.length);


  if(id){

    //prepare Ui for changes
    //create new recipe object

    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    if(state.search) {
      searchView.removeHighlight();

      searchView.highlightSelected(id);
    }
    state.recipe = new Recipe(id);
    //get recipe data
    try {

      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //calculate servign and time;
      state.recipe.calcTime();
      state.recipe.calcServings();
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.like.isLike(id));
      //render the recipe
    } catch(error) {
      console.log(error);
      // clearLoader();
      alert('error procesing recipe')
    }

  }

};

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));


const controlList = () => {
   // create new list if there is none yet
   if(!state.list){
     state.list = new List();
   }
   // add each ingredient
   state.recipe.ingredients.forEach(el => {
     const item = state.list.addItem(el.count,el.unit,el.ingredient);
     listView.renderItem(item);
   })

   // handle delete and update list
 elements.shoppingList.addEventListener('click', e => {

 const id= e.target.closest('.shopping__item').dataset.itemid;

 if(e.target.matches('.shopping__delete, .shopping__delete *')) {
   state.list.deleteitem(id);
   listView.deleteItem(id);

 }
 if(e.target.matches('.shopping__count-value')) {
   const newVal= parseFloat(e.target.value,10);
   state.list.updateCount(id,newVal);

 }

 })
};



const controlLike= () => {
  if(!state.like){
    state.like= new Like();
  }

  const currentId = state.recipe.id;
  if(!state.like.isLike(currentId)){
    //unliked state initially
    const newLike = state.like.addLike(currentId, state.recipe.title, state.recipe.image, state.recipe.publisher);

    likeView.toggleLike(true);
    likeView.renderLike(newLike);
  }
  else {
    //like state initially
    state.like.deleteLike(currentId);
  
      likeView.toggleLike(false);
      likeView.deleteLike(currentId);
  }

  // toggle the like buttons
  // show it in the UI
  likeView.toggleLikeMenu(state.like.getNumLikes());

}

elements.recipe.addEventListener('click', e => {

if(e.target.matches('.btn-decrease, .btn-decrease *')){

      if(state.recipe.servings>0){
        state.recipe.updateServing('dec');
        recipeView.updateRecipeIngredients(state.recipe);
      }
}
else if (e.target.matches('.btn-increase, .btn-increase *')) {

    state.recipe.updateServing('inc');
    recipeView.updateRecipeIngredients(state.recipe);
}
else if ( e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
      controlList();
}
else if ( e.target.matches('.recipe__love, .recipe__love *')) {
  console.log('got clicked');
  controlLike();
}

});

window.addEventListener('load', ()=>{

  state.like= new Like();
  state.like.readStorage();
  likeView.toggleLikeMenu(state.like.getNumLikes());
  state.like.likes.forEach( like => {
    likeView.renderLike(like);
  })

})
