const express = require("express");

const Todo = require('../models/todo');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/* create a new todo on the list 
    CREATE NEW TODO
*/
router.post("", checkAuth, (req, res, next) => {
    console.log('POST: /api/todos');

    const newTodo = new Todo({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId,
        deadline: req.body.deadline
    });

    newTodo.save().then(createdTodo => {
        console.log("Saved TODO to db: ");
        console.log(createdTodo);
        res.status(201).json({
            message: 'Todo Added Successfully',
            postId: createdTodo._id
        });
    });

});

//.patch --> updates
//.put --> whole new
// UPDATE TODO 
router.put("/:id", checkAuth, (req, res, next) => {
    const todo = new Todo({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        deadline: req.body.deadline,
        creator: req.userData.userId
    })
    Todo.updateOne({ _id: req.params.id, creator: req.userData.userId}, todo).then(result => {
        console.log(result);
        if(result.n == 0) {
            console.log("no update occured!");
            return res.status(401).json({ message: "User not authorized to edit todo!"});
        } else {
            console.log('update todo successful');
            res.status(200).json({ message: "Update Successful!"});
        }
       
    })
})

router.get("", (req, res, next) => {
    console.log('/api/todos');
    
    Todo.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Todos fetched successfully',
                todos: documents
            });
        });
    
});

router.get("/:id", (req, res, next) => {
    Todo.findById(req.params.id).then(todo => {
        if(todo) {
            // todo with id exists in datagbase
            res.status(200).json(todo);
        } else {
            res.status(404).json({message: 'Todo Not Found'});
        }
    })
})

router.delete("/:id", checkAuth, (req, res, next) => {
    // only admin or employee can delete

    // console.log(req.params.id);
    console.log('\n /api/todos/delete/:id');
    console.log("trying to delete id: " + req.params.id);
    console.log("with user ID of: " + req.userData.userId )
    Todo.findOneAndDelete({ _id: req.params.id, creator: req.userData.userId})
        .then(result => {
            console.log("within delete post user check");
            console.log(result);
            if(!result) {
                console.log("find and delete failed");
                return res.status(401).json({message: 'user not owner of todo!'});
            } else {
                console.log("todo delete successful");
                res.status(200).json({message: 'user not owner of todo!'});
            }
        
    });    
});

module.exports = router;