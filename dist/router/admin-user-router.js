"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_user_controller_1 = require("../controller/admin-user-controller");
const adminUserRouter = (app) => {
    app.post('/admin-signin', admin_user_controller_1.adminSignin);
    app.post('/admin-signup', admin_user_controller_1.adminSignup);
};
exports.default = adminUserRouter;
