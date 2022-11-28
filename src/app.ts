import express, { Express } from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'
import httpStatus from 'http-status'
import config from './config/config'
import { logger, morgan } from './modules/logger'
import { jwtStrategy } from './modules/auth'
import { authLimiter } from './modules/utils'
import { User } from './modules/user'
import { ApiError, errorConverter, errorHandler } from './modules/errors'
import routes from './routes/v1'

const startApp = () => {
    const app: Express = express()

    if (config.env !== 'test') {
        app.use(morgan.successHandler)
        app.use(morgan.errorHandler)
    }

    // set security HTTP headers
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
                    baseUri: ["'self'"],
                    fontSrc: ["'self'", 'https:', 'data:'],
                },
            },
        })
    )

    // enable cors
    app.use(cors())
    app.options('*', cors())

    // parse json request body
    app.use(express.json())

    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true }))

    // sanitize request data
    app.use(xss())
    app.use(ExpressMongoSanitize())

    // gzip compression
    app.use(compression())

    // jwt authentication
    app.use(passport.initialize())
    passport.use('jwt', jwtStrategy)

    // limit repeated failed requests to auth endpoints
    if (config.env === 'production') {
        app.use('/v1/auth', authLimiter)
    }

    // v1 api routes
    app.use('/v1', routes)

    // send back a 404 error for any unknown api request
    app.use(admin.options.rootPath, adminRouter)

    app.use((_req, _res, next) => {
        next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
    })

    // convert error to ApiError, if needed
    app.use(errorConverter)

    // handle error
    app.use(errorHandler)

    return app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`)
    })
}

export default startApp
