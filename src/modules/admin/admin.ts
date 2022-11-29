import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import config from '../../config/config'
import { User, userService } from '../user'
import { authService } from '../auth'
import { logger } from '../logger'
import { userBody } from '../validate/custom.validation'

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
                    handler: async (request: any, _response: any, context: any) => {

                        const { resource, h, currentAdmin } = context


                        if (request.method === 'post') {
                            //eslint-disable-next-line no-param-reassign
                            const valid = userBody(request.payload ?? {}, request)
                            let record
                            if (valid === "success") {
                                record = await userService.createUser(request.payload)
                                context.record = record
                                return {
                                    redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                                    notice: {
                                        message: 'successfullyCreated',
                                        type: 'success',
                                    },
                                    record: record.toJSON(currentAdmin),
                                }

                            }
                            throw new Error(valid)
                            // TODO: add wrong implementation error
                        }
                        throw new Error('new action can be invoked only via `post` http method')


                    },
                },
                delete: {
                    isVisible: true,
                    actionType: 'record',
                    icon: 'TrashCan',
                    guard: 'confirmDelete',
                    component: false,
                    variant: 'danger',
                },
                edit: {
                    isVisible: true,
                    actionType: 'record',
                    icon: 'Edit',
                    showInDrawer: true,
                }

            },
        }
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
