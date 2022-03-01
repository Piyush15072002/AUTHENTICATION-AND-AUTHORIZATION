// here we will create a validator that checks if the user is logged in or not 
// if the user is logged in, we will authorize him that route
// but if he is not logged in, we will send him to the login page

const isLoggedIn = (req, res, next) => {

    // since we know that we get isAuthenticated() imported in REQ body by our passport so...

    if (req.isAuthenticated()) { // if logged in
        return next();
    }
    else {  // if not logged in then redirect to login page
        return res.redirect('/login');
    }
};

module.exports = isLoggedIn;