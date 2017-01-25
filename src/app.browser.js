"use strict";
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var core_1 = require("@angular/core");
var system = require("./system");
var app_module_1 = require("./app/app.module");
if (NODE_ENV === 'production') {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic()
    .bootstrapModule(app_module_1.AppModule)
    .catch(function (err) { return system.UssMessagesService.error(err); });
//# sourceMappingURL=app.browser.js.map