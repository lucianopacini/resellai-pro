const supabase = require("../config/supabaseClient");


const authMiddleware = async (req, res, next) => {


    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Non sei autenticato",
        });
    }


    const [type, token] = authHeader.split(" ");

    if (!token || type !== "Bearer") {
        return res.status(401).json({
            error: "Non valido",
        });
    }


    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
        return res.status(401).json({
            error: "Token non valido o scaduto.",
        });
    }

    req.user = data.user;

    next();

};

module.exports = authMiddleware;

