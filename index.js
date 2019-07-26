const mongo = require('mongodb');
const client = new mongo.MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});

function markAsDone(collect, id){

    // console.log('MARKaSdONE', collect);
    collect.updateOne({ _id: mongo.ObjectID(id) },{ $set: { done: true } }
    , err =>{
        if(err){
            console.log('blad z aktualizacją wynonanego zadania')
        }else{
            console.log('udalo się zrobić zadanie')
        }
        client.close();
    })
}

function showList(collect){
    collect.find({}).toArray((err, todos) => {
        if(err){
            console.log('nie mogę pokazać listy', err);
        } else{
                const todosDone = todos.filter( todo => todo.done);
                const todosToDo = todos.filter( todo => !todo.done);

                console.log(`zadania zrobione w ilości: ${todosDone.length}`);
            for( const todo of todosDone){
                console.log(`   id: < ${todo._id} >  ${todo.title}`);
            }
            console.log(`zadania do zrobienia w ilości: ${todosToDo.length}`);
            for (const todo of todosToDo) {
                console.log(`   id: < ${todo._id} >  ${todo.title}`);
            }
        }
    })
    client.close();
}

function addNewTodo(todosCollection, title) {
  console.log('hello from addNewTodo func: ', title);
  todosCollection.insertOne({
      title,
      done: false,
  }, err => {
      if(err){
          console.log('nie dodało się')
      }else{
          console.log('dodalo sie')
      }
      client.close();
  })
}

function doTheToDo(todosCollection){
    const [commmand, ...args] = process.argv.splice(2);
    console.log('command: ', commmand,'args:', args);

    switch(commmand){
        default:
            console.log('give me a correct command!!!');
            break;
        case 'add':
            addNewTodo(todosCollection, args[0]);
            break;
        case 'list':
            showList(todosCollection);
            break;
        case 'done':
            markAsDone(todosCollection, args[0]);
            break;
    }

    client.close()
}
client.connect(err =>{
    if(err){
        console.log('blad polaczenia', err)
    }else{
        console.log('polaczono poprawnie')
        const db = client.db('test');
        const todosCollection = db.collection('todos');
       
        doTheToDo(todosCollection);
        
    }
});
