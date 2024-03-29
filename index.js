const mongo = require('mongodb');
const client = new mongo.MongoClient('mongodb://localhost:27017', {useNewUrlParser: true});
const colors = require('colors');

function deleteDoneTasks(dbCollection) {
    dbCollection.find({ 
        done: true }).toArray((err, task) => {
        if (err) {
            console.log('problem listą: ', err);
            client.close()
        } else if (task.length !== 1) {
            console.log('nie ma takiego zadaina');
            client.close()
        } else {
            console.log('jest takie zadanie');
            dbCollection.deleteMany(
                { done: true }, err => {
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

function showDoneTasks(dbCollection) {
    dbCollection.find({
        done: true
    }).toArray((err, doneTasks) => {
        if (err) {
            console.log('problem listą: ', err);
        } else {
            console.log(`Zadania zrobione:
            `);
            for (const doneTask of doneTasks) {
                console.log(`task: ${doneTask.title}`)
                console.log(`id: ${doneTask._id}\n`)
            }
        }
        client.close()
    })
}

function showTodoTasks(dbCollection){
    dbCollection.find({
        done: false
    }).toArray((err, doneTasks) => {
        if (err) {
            console.log('problem listą: ', err);
        } else {
            console.log(`Zadania do zrobienia:
            `);
            for (const doneTask of doneTasks) {
                console.log(`task: ${doneTask.title}`)
                console.log(`id: ${doneTask._id}\n`)    
            }
            
        }
        client.close()
    })
}

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
                { title }, err => {
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
           console.log('nie ma takiego zadania');
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
        `,`############\n`.rainbow);
            for(const task of tasks){
                console.log(`id: <`,`${task._id}`.red,`>
                title: ${task.title}
                done: ${task.done}
                ***************************
                `)
                
            }
            console.log('\n         $$$$$$$$$$$$'.rainbow)
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
        case 'todoTasks':
            showTodoTasks(todosCollection);
            break;
        case 'doneTasks':
            showDoneTasks(todosCollection);
            break;
        case 'deleteDoneTasks':
            deleteDoneTasks(todosCollection);
            break;
        default:
            console.log('wybierz jedną z komend: \n',
                '"add" + zadanie. '.green, 'dodaje nowe zadanie, \n',
            '"list"'.green, 'wyświetla wszystkie zadania, \n',
            '"done" + zadanie. '.green, 'zmienia status zadania na wykonane, \n',
            '"delete" + zadanie. '.green, 'kasuje wybrane zadanie, \n',
            '"todoTasks" '.green, 'wyświetla zadania do zrobienia, \n',
            '"doneTasks" '.green, 'wyświetla zrobione zadania, \n',
            '"deleteDoneTasks" '.green, 'usuwa zrobione zadania, \n')
            client.close();
            break
    }

  
}


client.connect(err =>{
    if(err){
        console.log('blad polaczenia', err);
    }else{
        console.log('polaczono poprawnie'.green);
        // console.log('\x1b[36m%s\x1b[0m', 'I am cyan')
        const db = client.db('test');
        const todosCollection = db.collection('todos');
       
        doTheToDo(todosCollection);
    }
});



//$$####################################################################



