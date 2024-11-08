import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

// export const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   return res.status(401).send("Unauthorized");
// };

//chaneg isAuthenticated to use jwt to authenticate
export const isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated middleware triggered on route:", req.originalUrl);

  //if the req.originalUrl is /favicon.ico, skip the authentication
  if (req.originalUrl === "/favicon.ico") {
    return next();
  }

  //if the req.originalUrl is contain /uploads/[img], skip the authentication
  if (req.originalUrl.includes("public/uploads")) {
    return next();
  }

  if (req.originalUrl.includes("/robots.txt")) {
    return next();
  }

  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    req.user = user;
    console.log("Authenticated user" + user.user_id + " request to " + req.originalUrl);
    return next();
  });
};

//check role middleware
export const checkRole = (role) => (req, res, next) => {
  console.log("in check role");
  console.log(req.user);
  if (role.includes(req.user.role)) {
    return next();
  }
  return res.status(403).send("Not allowed");
};
