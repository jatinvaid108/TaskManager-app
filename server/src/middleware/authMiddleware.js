// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect= async(req,res,next)=>{
//     try{
//         // Step 1: Read token from either cookie or Authorization header
//         const token= req.cookies?.token || (req.headers.authorization?.startsWith("Bearer")? req.headers.authorization.split(" ")[1]: null);

//         // Step 2: If no token → reject request
//         if(!token) return res.status(401).json({message: "Unauthorized"});
//          // Step 3: Verify token using secret key
//         const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
//          // Step 4: Find the user from DB using the ID stored in the token
//         const user= await User.findById(decoded.id).select("-password");
//         if(!user) return res.status(401).json({message: "Unauthorized"});

//         // Step 5: Attach user info to req (so next route handler can use it)
//         req.user=user;
//         next();         // Step 6: Continue to the next middleware/route
//     }
//     catch(err){
//         res.status(401).json({message: "Invalid token"});
//     }
// };

// // restrict routes to admin users
// export const adminOnly=(req,res,next)=>{
//     if(req.user.role!=="admin")
//         return res.status(403).json({message: "Admin access required "});
//     next();
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Read only from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
