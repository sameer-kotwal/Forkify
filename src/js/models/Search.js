import axios from 'axios';

class Search {

  constructor(id){
    this.id=id;
  }

  async getResults() {

    try {

        const res= await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.id}`);
          this.recipes = res.data.recipes;

    }
    catch(error) {
      alert(error);
    }
  }

}

export default Search;
