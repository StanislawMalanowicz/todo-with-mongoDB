const mongo = require('mongodb');
const client = new mongo.MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});

function deleteTask(dbCollection, title) {
    dbCollection.find({ title }).toArray((err, task) => {
        if (err) {
            console.log('problem listą: ', err);
            client.close()
        } else if (task.length !== 1) {
            console.log('nie ma takiego zadaina');
            client.close()
        } else {
            console.log('jest takie zadanie');
            dbCollection.deleteOne(
                { title },
                { $set: { done: true } }, err => {
                    if (err) {
                        console.log('problem z usunięciem zadania: ', err)
                    } else {
                        console.log('zadanie zostało usunięte prawidłowo')
                    }
                    client.close()
                })
        }
    })
}

function makeTaskDone(dbCollection, title){
    dbCollection.find({title}).toArray((err, task) => {
        if (err) {
            console.log('problem listą: ', err);
            client.close()
        } else if (task.length !== 1) {
           console.log('nie ma takiego zadaina');
            client.close()
        } else if (task[0].done){
            console.log('to zadanie zostało już wcześniej zrobione');
            client.close()
        } 
        else{
            console.log('jest takie zadanie');
            dbCollection.updateOne(
                { title },
                { $set: { done: true } }, err => {
                    if (err) {
                        console.log('problem z aktualizacją zadania: ', err)
                    } else {
                        console.log('zadanie zostało zaktualizowane prawidłowo')
                    }
                    client.close()
                })
        }
    })
}

function addNewTask(dbCollection, title){
    dbCollection.insertOne({
        title,
        done: false
    }, err => {
        if(err){
            console.log('problem z dodaniem zadania: ', err)
        } else {
            console.log('zadanie zostało dodane prawidłowo')
        }
        client.close()
    })
   
}

function showAllList(dbCollection){
    dbCollection.find({}).toArray((err, tasks) => {
        if (err) {
            console.log('problem listą: ', err);
        } else {
            console.log(`Patrz i podziwiaj:
        ############\n`);
            for(const task of tasks){
                console.log(`id: < ${task._id} >
                title: ${task.title}
                done: ${task.done}
                ***************************
                `)
            }
            console.log('\n         $$$$$$$$$$$$')
        }
        client.close()
    })
}

function doTheToDo(todosCollection){
    const [command, ...args] = process.argv.splice(2);
    console.log('polecenie: ', command, 'argument: ', args[0]);
    switch(command) {
        case 'add':
            addNewTask(todosCollection, args[0]);
            break;
        case 'list':
            showAllList(todosCollection);
            break;
        case 'done':
            makeTaskDone(todosCollection, args[0]);
            break;
        case 'delete':
            deleteTask(todosCollection, args[0]);
            break;
    }

  
}


client.connect(err =>{
    if(err){
        console.log('blad polaczenia', err);
    }else{
        console.log('polaczono poprawnie');
        const db = client.db('test');
        const todosCollection = db.collection('todos');
       
        doTheToDo(todosCollection);
        
        
    }
});



//$$####################################################################



