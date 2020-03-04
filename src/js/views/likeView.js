import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLike =  isLike => {
  if(isLike) document.querySelector('.recipe__love use').setAttribute('href',"img/icons.svg#icon-heart");
  else document.querySelector('.recipe__love use').setAttribute('href',"img/icons.svg#icon-heart-outlined");
};

export const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes>0 ? '': 'hidden';
};

export const renderLike = (like) => {

  const markup= `
  <li>
      <a class="likes__link" href="#${like.id}" >
          <figure class="likes__fig">
              <img src="${like.image}" alt="${like.title}">
          </figure>
          <div class="likes__data">
              <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
              <p class="likes__author">${like.publisher}</p>
          </div>
      </a>
  </li>`;

elements.likesList.insertAdjacentHTML('beforeend', markup);

}

export const deleteLike = id => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`);
  if(el) el.parentElement.removeChild(el);
}
