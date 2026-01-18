import jwt from 'jsonwebtoken';

export const verifyServiceJwt = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Service authentication required.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.SERVICE_JWT_SECRET);

        // Verify this token is for Urban department
        if (decoded.department !== 'URBAN') {
            return res.status(403).json({
                success: false,
                message: 'Invalid service token for this department.'
            });
        }

        req.serviceAuth = decoded;
        next();
    } catch (error) {
        console.error('Service JWT verification error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired service token.'
        });
    }
};
