import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {

  elements.searchInput.value='';

};

export const clearResults = () => {
  elements.searchResList.innerHTML='';
  elements.searchResPages.innerHTML='';
};

export const highlightSelected = (id) => {

   document.querySelector(`.results__link[href*='#${id}']`).classList.add('results__link--active');
}

export const removeHighlight = () => {

  const item =document.querySelector(`.results__link--active`);
  if(item) item.classList.remove('results__link--active');
}

export const limitRecipeTitle = (title,limit=17) => {
  if(title.length>=17){
    const newTitle=[];
    title.split(' ').reduce((acc,cur)=>{
      if(acc+cur.length<=17){
        newTitle.push(cur);
        return acc+cur.length;
      };
    }, 0);
    return newTitle.join(' ')+'...'
  }
  return title;
}
const renderRecipe = (recipe) => {

  const markup = `<li>
      <a class="results__link " href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.recipe_id}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>`

  elements.searchResList.insertAdjacentHTML('beforeEnd',markup);

}
//type prev or next

const createButton =(page, type) => `

<button class="btn-inline results__btn--${type}" data-goto= ${type==='prev'? page-1: page+1} >
<span>Page ${type==='prev'? page-1: page+1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type=='prev'?'left':'right'}"></use>
    </svg>

</button>
`;

 const renderButtons = (page,numResults,resPerPage) => {

  const pages= Math.ceil(numResults/resPerPage);
  let button;
  if(page===1 && pages>1){
    //button to go to next page
    button= createButton(page,'next');
  }
  else if(page>1 && page<pages){
    //button to go back and front
    button= `${createButton(page,'prev')}
    ${createButton(page,'next')}`;
  }
  else if(page===page && page>1){
    //button to go back
    button = createButton(page,'prev')
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin',button);

}



export const renderResults = (recipes,page = 1,resPerPage = 10) => {

  const start= (page-1)*resPerPage;
  const end= page*resPerPage;

  recipes.slice(start,end).forEach(renderRecipe);
  renderButtons(page,recipes.length,resPerPage=10);
}
