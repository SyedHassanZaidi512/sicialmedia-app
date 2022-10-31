const jwt = require("jsonwebtoken");


const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {  //this is middleware to verify user

      token = authorization.split(" ")[1];

      if (!token) {
        res
          .status(401)
          .send({ status: "failed", message: "Unauthorize User,No Token" });
      }

      //verify Token
      const { id } = jwt.verify(token, "ytrujm");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  } else {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorize User,No Token" });
  }
};

module.exports = checkUserAuth;
