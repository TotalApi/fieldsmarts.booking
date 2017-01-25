"use strict";
exports.AppRoute = function (route) { return function (target) {
    route = route || {};
    route.component = route.component || target;
    route.path = route.path || route.component.name;
    AppRoutes.config.push(route);
    if (!AppRoutes.components.contains(route.component))
        AppRoutes.components.push(route.component);
}; };
var AppRoutes = (function () {
    function AppRoutes() {
    }
    return AppRoutes;
}());
AppRoutes.components = [];
AppRoutes.config = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
exports.AppRoutes = AppRoutes;
//# sourceMappingURL=app.routes.js.map