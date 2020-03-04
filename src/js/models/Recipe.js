import axios from 'axios';

class Recipe {
  constructor(id){
    this.id=id;
  }

  async getRecipe() {

    try {

      const res= await axios.get(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

        this.title = res.data.recipe.title;
        this.image= res.data.recipe.image_url;
        this.publisher= res.data.recipe.publisher;
        this.ingredients = res.data.recipe.ingredients;
        this.source=res.data.recipe.source_url;
    }

    catch(error) {
      console.log(error);
      alert('something went wrong :(')
    }

  }

  calcTime() {
    const numIng= this.ingredients.length;
    const periods= numIng/3;
    this.time= periods*15;
  }
  calcServings(){
    this.servings=4;
  }

  parseIngredients() {

    const unitsLong = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce','cups','pounds'];
    const unitsShort = ['tbsp','tbsp','tsp','tsp','oz','oz','cup','pound'];
    const units= [...unitsShort,'kg','g'];

    // 1. uniform units
    const newIngredients= this.ingredients.map(ing => {

      let ingredient = ing.toLowerCase();
      unitsLong.forEach((cur,i) => {
        ingredient=ingredient.replace(cur,unitsShort[i])
      });

    ingredient= ingredient.replace(/ *\([^)]*\) */g, ' ');
    // 2. parse ingredients into count, unit and ingredients
    const arrIng= ingredient.split(' ');
    let objIng;
    const unitIndex = arrIng.findIndex(element=>units.includes(element));

    if(unitIndex> -1){
     // there is unit
     const arrCount = arrIng.slice(0,unitIndex);
     let count;
     if(arrCount.length===1){
     count = eval(arrIng[0].replace('-','+'));
     } else {
     count= eval(arrIng.slice(0,unitIndex).join('+'));
     }
     objIng = {
       count: count,
       unit: arrIng[unitIndex],
       ingredient: arrIng.slice(unitIndex+1).join(' ')
     }

   }
   else if(parseInt(arrIng[0],10)) {
     // no unit but number in first position
     objIng={
       count: parseInt(arrIng[0],10),
       unit:'',
       ingredient: arrIng.slice(1).join(' ')
     }
   }
    else if(unitIndex===-1){
      // no unit and no number in first position
      objIng= {
        count:1,
        unit:'',
        ingredient:ingredient
      }
    }

      return objIng;
    })

    this.ingredients = newIngredients;
    //
  }

  updateServing(type){

    const newServing = type=='dec'? (this.servings-1) : (this.servings+1);
    this.ingredients.forEach(ing => {
      ing.count*=newServing/ this.servings;
    });
    this.servings= newServing;
  }

}

export default Recipe;
