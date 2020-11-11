const express = require("express");

const News = require("../models/news");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/* +++++++++++++++++++++++++++++++++++++++++++++++++

  * POST @ /api/news
  Create a new news entry

+++++++++++++++++++++++++++++++++++++++++++++++++ */
router.post("", checkAuth, (req, res, next) => {
    console.log("\nPOST @ /api/news");

    const newNews = new News({
        title: req.body.title,
        content: req.body.content,
        postedDate: req.body.postedDate
    });

    newNews.save().then(createdNews => {
        console.log("Saved News Article to DB: ");
        console.log(createdNews);
        res.status(200).json({
            message: 'News article added successfully!',
            newsId: createdNews._id
        });
    });

});

/* ^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v

  `GET @ /api/department/
    RETURNS
        all the current news articles

^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v^v */
router.get("", (req,res, next) => {
    console.log('\nGET @ /api/news');

    News.find()
        .then(documents => {
            console.log(documents);

            // Convert the JS date object to a nice string representation
            documents = documents.map(elem => {
                let postDate;
                let updatedDate;

                if(elem.postedDate){
                    let HH = elem.postedDate.getHours();
                    let MM = elem.postedDate.getMinutes();
                    let dd = elem.postedDate.getDate();
                    let mm = elem.postedDate.getMonth()+1; //January is 0!
                    let yyyy = elem.postedDate.getFullYear();
                    
                    if(dd<10) {
                        dd = Number('0'+dd);
                    } 
                    
                    if(mm<10) {
                        mm = Number('0'+mm);
                    }
                    postDate = HH + ':' + MM + ' ' +mm + '/' + dd + '/' + yyyy;
                }

                console.log(postDate);

                if(elem.updatedDate){
                    let HH = elem.postedDate.getHours();
                    let MM = elem.postedDate.getMinutes();
                    let dd = elem.postedDate.getDate();
                    let mm = elem.postedDate.getMonth()+1; //January is 0!
                    let yyyy = elem.postedDate.getFullYear();
                    
                    if(dd<10) {
                            dd = Number('0'+dd);
                    } 
                    
                    if(mm<10) {
                            mm = Number('0'+mm);
                    }
                    updatedDate = HH + ':' + MM + ' ' +mm + '/' + dd + '/' + yyyy;
                }



                return {
                  id: elem._id,
                  title: elem.title,
                  content: elem.content,
                  postedDate: postDate,
                  updatedDate: updatedDate
                };
              });



            res.status(200).json({
                message: 'All News Articles fetched successfully',
                news: documents
            });
        });
});

/* =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    ?PUT @ /api/news/:id
        
    Updates a news article
=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+*/
router.put("/:id", checkAuth, (req, res, next) => {

    console.log('\nPUT @ /api/news/:id');
    console.log(req.params.id);
    console.log(req.body);
    // !!TODO make this keep the postedDate and updatedDate seperate



    const updateNews = new News({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        postedDate: req.body.postedDate
    })

    News.updateOne({ _id: req.params.id}, updateNews).then(result => {
        console.log(result);
        if(result.n == 0) {
            console.log("no UpDaTe occured!");
            return res.status(401).json({ message: "User not authorized to edit News!"});
        } else {
            console.log('update todo successful');
            return res.status(200).json({ message: "Update Successful!"});
        }
    })
});


/* --------------------------------------------
    !DELETE @ /api/news/:id
    Deletes the matching news article if found
    req.params.id
--------------------------------------------*/
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log('\nDELETE @ /api/news/:id');
    console.log(req.params.id);

    News.findOneAndDelete({ _id: req.params.id})
        .then(result => {
            console.log("within delete news ");
            console.log(result);
            if(!result) {
                console.log("find and delete failed");
                return res.status(401).json({message: 'user not owner of todo!'});
            } else {
                console.log("todo delete successful");
                return res.status(200).json({message: 'user not owner of todo!'});
            }
        
    });
})


module.exports = router;