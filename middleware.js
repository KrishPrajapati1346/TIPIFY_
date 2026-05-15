
const Hotel = require("./models/hotel");
const Location = require("./models/location");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;   // to give the old path after being login
        req.flash("error" ,"please Login first to perform action!");
        return res.redirect("/login");
      }
      next();
};


module.exports.isLoggedInEmployee = (req,res,next) => {
  if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;   // to give the old path after being login
      req.flash("error" ,"please Login first to perform action!");
      return res.redirect("/employeeAccount/login");
    }
    next();
}; 

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next(); 
  };


// Authorization: ensure the logged-in manager owns the hotel
module.exports.isOwner = async (req, res, next) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            req.flash("error", "Hotel not found");
            return res.redirect('/hotel');
        }
        if (!hotel.managerID.equals(req.user._id)) {
            req.flash("error", "You do not have permission to perform this action");
            return res.redirect('/hotel');
        }

        next();
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect('/hotel');
    }
};

