import { Request, Response, NextFunction } from "express"
import authkeys from "../data/keys.json"


export const authentication = (req: Request, res: Response, next: NextFunction) => {

    //if(req.method == 'OPTIONS') next()
    //allow root api passto without authentication
    // const urls = req.url.substring(1).split('/')
    // if (urls.length == 2 && urls[0] == 'api') {
    //     next()
    // }
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({ error: "Forbidden" }) //Forbidden
        return
    }

    try {
        const token = authHeader.split(' ')[1]
        if (!authkeys.keys.includes(token)) {
            res.status(401).json({ error: "Unauthorized" }) //Unauthorized
            return
        }
        next()
    } catch {
        res.status(500).json({ error: "Internal Server Error" }) //Internal Server Error
    }
}