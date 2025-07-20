import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Auth middleware: validates Bearer token & attaches req.user
 */
const middleware = async (req, res, next) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = auth.split(' ')[1];
  try {
    // Use same secret as auth route
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkeyofnoteapp123@#');
    const user = await User.findById(decoded.id).select('_id name email');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default middleware;
