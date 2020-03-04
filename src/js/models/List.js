import uniqid from 'uniqid'
class List {
  constructor(){
    this.items=[];
  }
  addItem(count,unit,ingredient) {

    const item = {
      count,
      unit,
      ingredient,
      id:uniqid()
    };

    this.items.push(item);
    return item;
  }

  deleteitem(id) {
    const index = this.items.findIndex(el => el.id===id );
    this.items.splice(index,1);
  }
  updateCount(id, newCount){
    const item= this.items.find(el => el.id===id);
    item.count = newCount;
  }
}

export default List;
