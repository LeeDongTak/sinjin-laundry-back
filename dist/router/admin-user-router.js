"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_user_controller_1 = require("../controller/admin-user-controller");
const sessionMiddleWare_1 = require("../controller/sessionMiddleWare");
const adminUserRouter = (app) => {
    app.post('/admin-signup', admin_user_controller_1.adminSignup);
    app.post('/admin-signin', admin_user_controller_1.adminSignin);
    app.post('/admin-signout', admin_user_controller_1.adminSignout);
    app.delete('/question/:questionId', sessionMiddleWare_1.sessionMiddleWare, admin_user_controller_1.deleteQuestion);
    app.get('/session', (req, res) => {
        const name = req.session.name;
        if (name) {
            res.json({ authenticated: true, user: name });
        }
        else {
            res.json({ authenticated: false });
        }
    });
};
exports.default = adminUserRouter;
