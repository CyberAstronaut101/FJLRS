/* 
    This is a middleware, that is, this executes between the initial API request and any 
    execution that the corresponding API function.

    This can be added to "guarded" API calls that require that a user is authenticated.
    If a user tries to call an API function and is not authenticated, then the call fails 
    and returns an error to the client.

    TODO we need to maybe implmenet something like this to protect "admin" routes..
    
    This only protects routes from people that are not authenticated. 
*/

// check if you have a token in your API requests

// validate token 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        
        // verify token
        const decodedToken = jwt.verify(token, "kitt kats make me walk like im listening to bass music bro");
        req.userData = { email: decodedToken.email , userId: decodedToken.userId};
        next(); // let the request continue    
    
    } catch (error) {
        // no token
        // not authenticated
        res.status(401).json(
            { message: "Auth Failed On Request"}
        );
    }
    

}