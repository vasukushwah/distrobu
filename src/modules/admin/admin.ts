import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import config from '../../config/config'
import { User } from '../user'
import { authService } from '../auth'
import { logger } from '../logger'

// import session from 'express'

AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})

const admin = new AdminJS({
    branding: {
        companyName: "DistroBu",
        logo: "/images/shop-icon.png",
        withMadeWithLove: false,
    },
    resources: [{
        resource: User,
        options: {
            parent: {
                name: "User Content",
                icon: "User",
            },
            properties: {
                _id: {
                    isVisible: { list: false, filter: true, show: true, edit: false },
                },

            },
            actions: {
                new: {
                    icon: 'Add',
                    handler: (request: any, context: any) => {
                        const { record, currentAdmin } = context
                        console.log(request)
                        // console.log(response)

                        return {
                            record: record.toJSON(currentAdmin),
                            msg: 'Hello world',
                        }
                    },
                }
            }
        },
    }],
    locale: {
        language: 'en',
        translations: {
            labels: {
                loginWelcome: "Admin Panel Login",
            },
            messages: {
                loginWelcome:
                    "Please enter your credentials to log in and manage",
            },
        },
    },
})

export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
        authenticate: async (email, password) => {
            try {
                const user = await authService.loginUserWithEmailAndPassword(email, password)
                if (user.role !== 'admin')
                    return false
                return user
            } catch (error) {
                logger.error(error)
                return false
            }
        },
        cookiePassword: config.cookie.password,
        cookieName: config.cookie.name,
        maxRetries: 5,
    },

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
