import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import config from '../../config/config'
import { User } from '../user'
import session from 'express'

AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})

const admin = new AdminJS({
    resources: [User],
})

export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
        authenticate(email, password) {
            console.log(email)
        },
        cookiePassword: config.cookie.password,
        cookieName: config.cookie.name,
        maxRetries: 5,
    },
    session
)

// Admin js

// const configureAdminJs = ()=>{

//     AdminJS.registerAdapter({
//         Resource: AdminJSMongoose.Resource,
//         Database: AdminJSMongoose.Database,
//       })

//     const adminJs: AdminJS  = new AdminJS({
//         resources : [User], // We don’t have any resources connected yet.
//         rootPath : '/admin', // Path to the AdminJS dashboard.
//     })

//     const adminRouter: express.Router = AdminJSExpress.buildRouter(adminJs)

//     return {adminJs,adminRouter}
// }

// export {configureAdminJs}
