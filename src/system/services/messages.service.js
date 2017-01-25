"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_service_1 = require("./http.service");
var ng2_toastr_1 = require("ng2-toastr");
var Reflection_1 = require("../utils/Reflection");
var system_service_decorator_1 = require("../decorators/system-service.decorator");
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Info"] = "info"] = "Info";
    MessageType[MessageType["Error"] = "danger"] = "Error";
    MessageType[MessageType["Success"] = "success"] = "Success";
    MessageType[MessageType["Warning"] = "warning"] = "Warning";
    MessageType[MessageType["Log"] = "log"] = "Log";
    MessageType[MessageType["RuntimeError"] = "RuntimeError"] = "RuntimeError";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
exports.DefaultMessagesOptions = {
    // toastr default options
    positionClass: 'toast-bottom-right',
    maxShown: 10,
    newestOnTop: true,
    animate: 'flyRight',
    toastLife: null,
    enableHTML: true,
    dismiss: 'click',
    messageClass: 'app-message',
    titleClass: 'app-message-title',
    showCloseButton: true,
    // not toastr options
    runtimeErrorCloseAfter: 5000,
    errorCloseAfter: 5000,
    warningCloseAfter: 5000,
    successCloseAfter: 3000,
    infoCloseAfter: 3000
};
// ReSharper disable once InconsistentNaming
var UssMessagesService = UssMessagesService_1 = (function () {
    function UssMessagesService(toastr, sanitizer) {
        this.toastr = toastr;
        this.sanitizer = sanitizer;
        /**
         * Признак режима отладки.
         * В этом режиме в консоль будут выводится сообщения через debug()
         * Если равно false - вызов метода debug() игнорируется.
         * По умолчанию устанавливается в значение ангуляровской функции isDevMode()
         */
        this.isDebug = core_1.isDevMode();
        /**
         * Окончание, добавляемое в конец всех сообщений перед записью в лог. Можно указать перевод строки.
         */
        this.logMessageStringSuffix = "";
        /**
         * Если равно true - все сообщения будут выведены в консоль через console.log()
         */
        this.useOnlyConsoleLog = false;
    }
    Object.defineProperty(UssMessagesService, "Instance", {
        get: function () { return Reflection_1.Reflection.Injector.get(UssMessagesService_1); },
        enumerable: true,
        configurable: true
    });
    UssMessagesService.error = function (err) {
        if (core_1.isDevMode()) {
            var toastr = null;
            try {
                toastr = Reflection_1.Reflection.Injector.get(ng2_toastr_1.ToastsManager);
            }
            catch (e) { }
            (new UssMessagesService_1(toastr)).runtimeError(err, 0);
        }
        else {
            console.log(err);
        }
    };
    UssMessagesService.prototype.logMessage = function (message, type, closeAfter) {
        var _this = this;
        if (type === void 0) { type = MessageType.Info; }
        if (message === '' || message === undefined)
            return;
        var me = this;
        function errorHtml(logMessage, errorType) {
            errorType = errorType || 'negative';
            var message = "<div class=\"ui " + errorType + " message\">"
                + "<i class=\"close icon\"></i>"
                + ("" + logMessage)
                + "</div>";
            return message;
        }
        function showError(messageContent, logMessage) {
            var errorType = '';
            switch (type) {
                case MessageType.Error:
                case MessageType.RuntimeError:
                    errorType = 'negative';
                    break;
                case MessageType.Info:
                    errorType = 'info';
                    break;
                case MessageType.Warning:
                    errorType = 'warning';
                    break;
                case MessageType.Success:
                    errorType = 'success';
                    break;
            }
            var div = document.createElement('div');
            // Используем шаблон semantic-ui
            div.innerHTML = errorHtml(logMessage, errorType);
            var contentElement = div.children[0];
            var lastMsgElement = messageContent.children[messageContent.children.length - 1];
            if (lastMsgElement && lastMsgElement.classList.contains("" + errorType)) {
                var lastMsg = lastMsgElement.innerHTML;
                contentElement.innerHTML = lastMsg + "<br/>" + contentElement.innerHTML;
                messageContent.removeChild(lastMsgElement);
            }
            messageContent.appendChild(contentElement);
            $('.message .close').on('click', function () { return messageContent.innerHTML = ''; });
            if (closeAfter > 0) {
                setTimeout(function () {
                    contentElement.remove();
                }, closeAfter);
            }
        }
        function rawOutput(logMessage) {
            if (!me.rawErrorContainer) {
                me.rawErrorContainer = document.createElement('div');
                me.rawErrorContainer.style.position = 'absolute';
                me.rawErrorContainer.style.left = '2em';
                me.rawErrorContainer.style.right = '2em';
                me.rawErrorContainer.style.top = '1em';
                me.rawErrorContainer.style.zIndex = '99999';
                me.rawErrorContainer.style.color = 'red';
                document.body.appendChild(me.rawErrorContainer);
            }
            showError(me.rawErrorContainer, logMessage);
        }
        if ((type === MessageType.Error || type === MessageType.RuntimeError) && typeof message == "object") {
            // Проверка, если сюда передали ajax-ответ с ошибкой
            message = http_service_1.UssHttp.ExctractError(message);
        }
        if (typeof closeAfter === "boolean")
            closeAfter = closeAfter ? undefined : -1;
        else if (closeAfter === 0 || closeAfter === null)
            closeAfter = -1;
        var logMessage = message + (this.logMessageStringSuffix || "");
        if (this.sanitizer)
            logMessage = this.sanitizer.sanitize(core_1.SecurityContext.HTML, logMessage);
        if (type === MessageType.RuntimeError) {
            closeAfter = closeAfter || exports.DefaultMessagesOptions.runtimeErrorCloseAfter;
            this.useOnlyConsoleLog ? console.log("***Runtime Error*** " + logMessage) : console.error(logMessage);
            if (!this.isDebug)
                return;
        }
        else if (type === MessageType.Error) {
            closeAfter = closeAfter || exports.DefaultMessagesOptions.errorCloseAfter;
            this.useOnlyConsoleLog ? console.log("***Error*** " + logMessage) : console.error(logMessage);
        }
        else if (type === MessageType.Warning) {
            closeAfter = closeAfter || exports.DefaultMessagesOptions.warningErrorCloseAfter;
            this.useOnlyConsoleLog ? console.log("***Warning*** " + logMessage) : console.warn(logMessage);
        }
        else if (type === MessageType.Success) {
            closeAfter = closeAfter || exports.DefaultMessagesOptions.successErrorCloseAfter;
            this.useOnlyConsoleLog ? console.log("***Success*** " + logMessage) : console.info(logMessage);
        }
        else if (type === MessageType.Info) {
            closeAfter = closeAfter || exports.DefaultMessagesOptions.infoErrorCloseAfter;
            this.useOnlyConsoleLog ? console.log(logMessage) : console.info(logMessage);
        }
        else
            console.log(logMessage);
        if (type !== MessageType.Log) {
            var messageContent = document['getElementById']("messages-content");
            if (messageContent) {
                showError(messageContent, logMessage);
            }
            else {
                if (this.toastr) {
                    var errorType = '';
                    switch (type) {
                        case MessageType.Error:
                        case MessageType.RuntimeError:
                            errorType = 'error';
                            break;
                        case MessageType.Info:
                            errorType = 'info';
                            break;
                        case MessageType.Warning:
                            errorType = 'warning';
                            break;
                        case MessageType.Success:
                            errorType = 'success';
                            break;
                    }
                    if (this.toastr.container && this.toastr.container.instance && this.lastToast && this.lastToast['__msg_type'] === type && this.toastr.container.instance.toasts.contains(this.lastToast)) {
                        var passTime = (Date.now() - this.lastToast['__msg_time']);
                        if (passTime < 500) {
                            this.lastToast['__msg_time'] = Date.now();
                            this.lastToast.message = this.lastToast.message + "<br/><br/>" + logMessage;
                            if (this.lastToast.config.toastLife > 0) {
                                if (this.lastToast.timeoutId)
                                    clearTimeout(this.lastToast.timeoutId);
                                this.lastToast.timeoutId = this.toastr.createTimeout(this.lastToast);
                            }
                            return;
                        }
                        else if (type === MessageType.RuntimeError) {
                            this.toastr.clearToast(this.lastToast);
                        }
                    }
                    var toast = new ng2_toastr_1.Toast(errorType, logMessage);
                    toast['__msg_type'] = type;
                    toast['__msg_time'] = Date.now();
                    try {
                        var options = new ng2_toastr_1.ToastOptions(exports.DefaultMessagesOptions);
                        options.toastLife = closeAfter;
                        this.toastr.show(toast, options).then(function (t) {
                            if (t.config.toastLife > 0) {
                                if (t.timeoutId)
                                    clearTimeout(t.timeoutId);
                                t.timeoutId = _this.toastr.createTimeout(t);
                            }
                        });
                    }
                    catch (e) {
                        rawOutput(logMessage);
                    }
                    this.lastToast = toast;
                }
                else {
                    rawOutput(logMessage);
                }
            }
        }
    };
    /**
     * Выводит информационное сообщение в консоль и на панель информационных сообщений, если она доступна.
     * @param message Текст информационного сообщения
     * @param closeAfter Время, после которого окно с информационным сообщением будет закрыто
     */
    UssMessagesService.prototype.info = function (message, closeAfter) {
        this.logMessage(message, MessageType.Info, closeAfter);
    };
    /**
     * Выводит информационное сообщение в консоль и на панель сообщений об успешной операции, если она доступна.
     * @param message Текст информационного сообщения
     * @param closeAfter Время, после которого окно с информационным сообщением будет закрыто
     */
    UssMessagesService.prototype.success = function (message, closeAfter) {
        this.logMessage(message, MessageType.Success, closeAfter);
    };
    /**
     * Выводит предупреждение в консоль и на панель сообщений, если она доступна.
     * @param message Текст предупреждения
     * @param closeAfter Время, после которого окно с предупреждением будет закрыто
     */
    UssMessagesService.prototype.warning = function (message, closeAfter) {
        this.logMessage(message, MessageType.Warning, closeAfter);
    };
    /**
     * Выводит ошибку в консоль и на панель ошибок/сообщений, если она доступна.
     * @param message Текст ошибки или объект ошибки из которого будет извлечён текст ошибки как значение св-ва obj.responseText или obj.status + ' ' + obj.statusText
     * @param closeAfter Время, после которого окно с ошибкой будет закрыто
     */
    UssMessagesService.prototype.error = function (message, closeAfter) {
        this.logMessage(message, MessageType.Error, closeAfter);
    };
    /**
     * Выводит ошибку выполнения программы консоль и на панель ошибок/сообщений, если она доступна.
     * Используйте этот тип ошибок именно для вывода ошибок времени выполнения приложения, а не прикладных ошибок.
     * Эти ошибки выводятся на экран только в режиме разработки.
     * @param message Текст ошибки или объект ошибки из которого будет извлечён текст ошибки как значение св-ва obj.responseText или obj.status + ' ' + obj.statusText
     * @param closeAfter Время, после которого окно с ошибкой будет закрыто
     */
    UssMessagesService.prototype.runtimeError = function (message, closeAfter) {
        this.logMessage(message, MessageType.RuntimeError, closeAfter);
    };
    /**
     * Выводит строку в консоль.
     * @param message Текст, выводимый в консоль
     */
    UssMessagesService.prototype.log = function (message) {
        this.logMessage(message, MessageType.Log);
    };
    // ReSharper disable once InconsistentNaming
    /**
     * Выводит строку в консоль только в отладочном режиме (если значение переменной App.IsDebug == true).
     * @param message Текст, выводимый в консоль.
     */
    UssMessagesService.prototype.debug = function (message) {
        if (this.isDebug)
            this.logMessage(message, MessageType.Log);
    };
    /**
     * Принудительно убирает все сообщения указанного типа.
     * Если типы не указаны - убираются все сообщения.
     */
    UssMessagesService.prototype.clear = function (types) {
        if (!types)
            this.toastr.clearAllToasts();
        else if (this.toastr.container && this.toastr.container.instance && this.toastr.container.instance.toasts) {
            for (var _i = 0, _a = this.toastr.container.instance.toasts; _i < _a.length; _i++) {
                var toast = _a[_i];
                if (toast && toast['__msg_type'] && toast['__msg_type'] & types) {
                    this.toastr.clearToast(toast.id);
                }
            }
        }
    };
    return UssMessagesService;
}());
UssMessagesService = UssMessagesService_1 = __decorate([
    core_1.Injectable(),
    system_service_decorator_1.SystemService(),
    __metadata("design:paramtypes", [ng2_toastr_1.ToastsManager, core_1.Sanitizer])
], UssMessagesService);
exports.UssMessagesService = UssMessagesService;
exports.msg = {
    clear: function () { return UssMessagesService.Instance.clear(); },
    error: function (message, closeAfter) { return UssMessagesService.Instance.error(message, closeAfter); },
    info: function (message, closeAfter) { return UssMessagesService.Instance.info(message, closeAfter); },
    log: function (message) { return UssMessagesService.Instance.log(message); },
    warning: function (message, closeAfter) { return UssMessagesService.Instance.warning(message, closeAfter); },
    runtimeError: function (message, closeAfter) { return UssMessagesService.Instance.runtimeError(message, closeAfter); },
    success: function (message, closeAfter) { return UssMessagesService.Instance.success(message, closeAfter); },
    debug: function (message) { return UssMessagesService.Instance.debug(message); },
};
function error(message, closeAfter) { exports.msg.error(message, closeAfter); }
exports.error = error;
function info(message, closeAfter) { exports.msg.info(message, closeAfter); }
exports.info = info;
function warning(message, closeAfter) { exports.msg.warning(message, closeAfter); }
exports.warning = warning;
function runtimeError(message, closeAfter) { exports.msg.runtimeError(message, closeAfter); }
exports.runtimeError = runtimeError;
function success(message, closeAfter) { exports.msg.success(message, closeAfter); }
exports.success = success;
function log(message) { exports.msg.log(message); }
exports.log = log;
function debug(message) { exports.msg.debug(message); }
exports.debug = debug;
var UssMessagesService_1;
//# sourceMappingURL=messages.service.js.map