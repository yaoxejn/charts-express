import { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(500).json({
        result: false,
        message: err.message
    })
}