import { Injectable, Inject, isDevMode, Sanitizer, SecurityContext } from '@angular/core';
import { UssHttp } from './http.service';
import { Toast, ToastsManager, ToastOptions } from 'ng2-toastr';
import { Reflection } from '../utils/Reflection';
import { SystemService } from '../decorators/system-service.decorator';

export enum MessageType {
    Info = <any>"info",
    Error = <any>"danger",
    Success = <any>"success",
    Warning = <any>"warning",
    Log = <any>"log",
    RuntimeError = <any>"RuntimeError",
}


export var DefaultMessagesOptions: ToastOptions | any = {
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


export interface IUssMessagesService {
    /**
     * Выводит информационное сообщение в консоль и на панель информационных сообщений, если она доступна.
     * @param message Текст информационного сообщения
     * @param closeAfter Время, после которого окно с информационным сообщением будет закрыто
     */
    info(message: string, closeAfter?: number | boolean): void;

    /**
     * Выводит информационное сообщение в консоль и на панель сообщений об успешной операции, если она доступна.
     * @param message Текст информационного сообщения
     * @param closeAfter Время, после которого окно с информационным сообщением будет закрыто
     */
    success(message: string, closeAfter ?: number | boolean): void;

    /**
     * Выводит предупреждение в консоль и на панель сообщений, если она доступна.
     * @param message Текст предупреждения
     * @param closeAfter Время, после которого окно с предупреждением будет закрыто
     */
    warning(message: string, closeAfter ?: number | boolean): void;

    /**
     * Выводит ошибку в консоль и на панель ошибок/сообщений, если она доступна.
     * @param message Текст ошибки или объект ошибки из которого будет извлечён текст ошибки как значение св-ва obj.responseText или obj.status + ' ' + obj.statusText
     * @param closeAfter Время, после которого окно с ошибкой будет закрыто
     */
    error(message: string | Object, closeAfter ?: number | boolean): void;

    /**
     * Выводит ошибку выполнения программы консоль и на панель ошибок/сообщений, если она доступна.
     * Используйте этот тип ошибок именно для вывода ошибок времени выполнения приложения, а не прикладных ошибок.
     * Эти ошибки выводятся на экран только в режиме разработки.
     * @param message Текст ошибки или объект ошибки из которого будет извлечён текст ошибки как значение св-ва obj.responseText или obj.status + ' ' + obj.statusText
     * @param closeAfter Время, после которого окно с ошибкой будет закрыто
     */
    runtimeError(message: string | Object, closeAfter ?: number | boolean): void;

    /**
     * Выводит строку в консоль.
     * @param message Текст, выводимый в консоль
     */
    log(message: string): void;

    // ReSharper disable once InconsistentNaming
    /**
     * Выводит строку в консоль только в отладочном режиме (если значение переменной App.IsDebug == true).
     * @param message Текст, выводимый в консоль.
     */
    debug(message: string);

    /**
     * Принудительно убирает все сообщения указанного типа.
     * Если типы не указаны - убираются все сообщения.
     */
    clear(types ?: MessageType): void;
}

// ReSharper disable once InconsistentNaming
@Injectable()
@SystemService()
export class UssMessagesService implements IUssMessagesService {

    public static get Instance(): UssMessagesService { return Reflection.Injector.get(UssMessagesService); }

    public static error(err): void {
        if (isDevMode()) {
            let toastr = null;
            try { toastr = Reflection.Injector.get(ToastsManager); } catch (e) { }
            (new UssMessagesService(toastr)).runtimeError(err, 0);
        } else {
            console.log(err);
        }
    }

    /**
     * Признак режима отладки. 
     * В этом режиме в консоль будут выводится сообщения через debug() 
     * Если равно false - вызов метода debug() игнорируется.
     * По умолчанию устанавливается в значение ангуляровской функции isDevMode()
     */
    isDebug: boolean = isDevMode();

    /**
     * Окончание, добавляемое в конец всех сообщений перед записью в лог. Можно указать перевод строки.
     */
    logMessageStringSuffix: string = "";

    /**
     * Если равно true - все сообщения будут выведены в консоль через console.log()
     */
    useOnlyConsoleLog: boolean = false;

    private lastToast: Toast;

    constructor(public toastr?: ToastsManager, private sanitizer?: Sanitizer) { }

    rawErrorContainer: HTMLElement;

    logMessage(message: string | Object, type: MessageType = MessageType.Info, closeAfter?: number | boolean): void {

        let me = this;

        function errorHtml(logMessage: string, errorType?: string): string {
            errorType = errorType || 'negative';
            const message = `<div class="ui ${errorType} message">`
                + `<i class="close icon"></i>`
                + `${logMessage}`
                + `</div>`;
            return message;
        }
        function showError(messageContent: HTMLElement, logMessage: string) {
            let errorType = '';
            switch (type) {
                case MessageType.Error: case MessageType.RuntimeError: errorType = 'negative'; break;
                case MessageType.Info: errorType = 'info'; break;
                case MessageType.Warning: errorType = 'warning'; break;
                case MessageType.Success: errorType = 'success'; break;
            }
            const div = document.createElement('div');
            // Используем шаблон semantic-ui
            div.innerHTML = errorHtml(logMessage, errorType);
            const contentElement = div.children[0];
            const lastMsgElement = messageContent.children[messageContent.children.length - 1];
            if (lastMsgElement && lastMsgElement.classList.contains(`${errorType}`)) {
                const lastMsg = lastMsgElement.innerHTML;
                contentElement.innerHTML = `${lastMsg}<br/>${contentElement.innerHTML}`;
                messageContent.removeChild(lastMsgElement);
            }

            messageContent.appendChild(contentElement);
            $('.message .close').on('click', () => messageContent.innerHTML = '');


            if (closeAfter > 0) {
                setTimeout(() => {
                    contentElement.remove();
                }, closeAfter);
            }
        }

        function rawOutput(logMessage: string) {
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
            message = UssHttp.ExctractError(message);
        }
        if (typeof closeAfter === "boolean")
            closeAfter = closeAfter ? undefined : -1;
        else if (closeAfter === 0 || closeAfter === null)
            closeAfter = -1;

        var logMessage = message + (this.logMessageStringSuffix || "");

        if (this.sanitizer)
            logMessage = this.sanitizer.sanitize(SecurityContext.HTML, logMessage);

        if (type === MessageType.RuntimeError) {
            closeAfter = closeAfter || DefaultMessagesOptions.runtimeErrorCloseAfter;
            this.useOnlyConsoleLog ? console.log("***Runtime Error*** " + logMessage) : console.error(logMessage);
            if (!this.isDebug) return;
        } else if (type === MessageType.Error) {
            closeAfter = closeAfter || DefaultMessagesOptions.errorCloseAfter;
            this.useOnlyConsoleLog ? console.log("***Error*** " + logMessage) : console.error(logMessage);
        } else if (type === MessageType.Warning) {
            closeAfter = closeAfter || DefaultMessagesOptions.warningErrorCloseAfter;
            this.useOnlyConsoleLog ? console.log("***Warning*** " + logMessage) : console.warn(logMessage);
        } else if (type === MessageType.Success) {
            closeAfter = closeAfter || DefaultMessagesOptions.successErrorCloseAfter;
            this.useOnlyConsoleLog ? console.log("***Success*** " + logMessage) : console.info(logMessage);
        } else if (type === MessageType.Info) {
            closeAfter = closeAfter || DefaultMessagesOptions.infoErrorCloseAfter;
            this.useOnlyConsoleLog ? console.log(logMessage) : console.info(logMessage);
        } else
            console.log(logMessage);

        if (type !== MessageType.Log) {
            var messageContent = document['getElementById']("messages-content");
            if (messageContent) {
                showError(messageContent, logMessage);
            }
            else {
                if (this.toastr) {
                    let errorType: string = '';
                    switch (type) {
                        case MessageType.Error: case MessageType.RuntimeError: errorType = 'error'; break;
                        case MessageType.Info: errorType = 'info'; break;
                        case MessageType.Warning: errorType = 'warning'; break;
                        case MessageType.Success: errorType = 'success'; break;
                    }

                    if (this.toastr.container && this.toastr.container.instance && this.lastToast && this.lastToast['__msg_type'] === type && this.toastr.container.instance.toasts.contains(this.lastToast)) {
                        var passTime = (Date.now() - this.lastToast['__msg_time']);
                        if (passTime < 500) {
                            this.lastToast['__msg_time'] = Date.now();
                            this.lastToast.message = `${this.lastToast.message}<br/><br/>${logMessage}`;
                            if (this.lastToast.config.toastLife > 0) {
                                if (this.lastToast.timeoutId) clearTimeout(this.lastToast.timeoutId);
                                this.lastToast.timeoutId = this.toastr.createTimeout(this.lastToast);
                            }
                            return;
                        } else if (type === MessageType.RuntimeError) {
                            this.toastr.clearToast(this.lastToast);
                        }
                    }
                    const toast = new Toast(errorType, logMessage);
                    toast['__msg_type'] = type;
                    toast['__msg_time'] = Date.now();
                    try {
                        const options = new ToastOptions(DefaultMessagesOptions);
                        options.toastLife = <number>closeAfter;
                        this.toastr.show(toast, options).then((t: Toast) => {
                            if (t.config.toastLife > 0) {
                                if (t.timeoutId) clearTimeout(t.timeoutId);
                                t.timeoutId = this.toastr.createTimeout(t);
                            }
                        });
                    } catch (e) {
                        rawOutput(logMessage);
                    } 
                    this.lastToast = toast;
                } else {
                    rawOutput(logMessage);
                }
            }
        } 
    }

    /**
     * Выводит информационное сообщение в консоль и на панель информационных сообщений, если она доступна.
     * @param message Текст информационного сообщения
     * @param closeAfter Время, после которого окно с информационным сообщением будет закрыто
     */
    info(message: string, closeAfter?: number | boolean): void {
        this.logMessage(message, MessageType.Info, closeAfter);
    }

    /**
     * Выводит информационное сообщение в консоль и на панель сообщений об успешной операции, если она доступна.
     * @param message Текст информационного сообщения
     * @param closeAfter Время, после которого окно с информационным сообщением будет закрыто
     */
    success(message: string, closeAfter?: number | boolean): void {
        this.logMessage(message, MessageType.Success, closeAfter);
    }

    /**
     * Выводит предупреждение в консоль и на панель сообщений, если она доступна.
     * @param message Текст предупреждения
     * @param closeAfter Время, после которого окно с предупреждением будет закрыто
     */
    warning(message: string, closeAfter?: number | boolean): void {
        this.logMessage(message, MessageType.Warning, closeAfter);
    }
    
    /**
     * Выводит ошибку в консоль и на панель ошибок/сообщений, если она доступна.
     * @param message Текст ошибки или объект ошибки из которого будет извлечён текст ошибки как значение св-ва obj.responseText или obj.status + ' ' + obj.statusText
     * @param closeAfter Время, после которого окно с ошибкой будет закрыто
     */
    error(message: string | Object | any, closeAfter?: number | boolean): void {
        this.logMessage(message, MessageType.Error, closeAfter);
    }

    /**
     * Выводит ошибку выполнения программы консоль и на панель ошибок/сообщений, если она доступна.
     * Используйте этот тип ошибок именно для вывода ошибок времени выполнения приложения, а не прикладных ошибок.
     * Эти ошибки выводятся на экран только в режиме разработки.
     * @param message Текст ошибки или объект ошибки из которого будет извлечён текст ошибки как значение св-ва obj.responseText или obj.status + ' ' + obj.statusText
     * @param closeAfter Время, после которого окно с ошибкой будет закрыто
     */
    runtimeError(message: string | Object, closeAfter?: number | boolean): void {
        this.logMessage(message, MessageType.RuntimeError, closeAfter);
    }

    /**
     * Выводит строку в консоль.
     * @param message Текст, выводимый в консоль
     */
    log(message: string): void {
        this.logMessage(message, MessageType.Log);
    }

    // ReSharper disable once InconsistentNaming
    /**
     * Выводит строку в консоль только в отладочном режиме (если значение переменной App.IsDebug == true).
     * @param message Текст, выводимый в консоль.
     */
    debug(message: string) {
        if (this.isDebug)
            this.logMessage(message, MessageType.Log);
    }

    /**
     * Принудительно убирает все сообщения указанного типа.
     * Если типы не указаны - убираются все сообщения.
     */
    clear(types?: MessageType): void {
        if (!types)
            this.toastr.clearAllToasts();
        else if (this.toastr.container && this.toastr.container.instance && this.toastr.container.instance.toasts) {
            for (const toast of this.toastr.container.instance.toasts) {
                if (toast && toast['__msg_type'] && toast['__msg_type'] & types) {
                    this.toastr.clearToast(toast.id);                    
                }
            }
        }
    }
}

export var msg: IUssMessagesService =
{
    clear: () => UssMessagesService.Instance.clear(),
    error: (message, closeAfter) => UssMessagesService.Instance.error(message, closeAfter),
    info: (message, closeAfter) => UssMessagesService.Instance.info(message, closeAfter),
    log: (message) => UssMessagesService.Instance.log(message),
    warning: (message, closeAfter) => UssMessagesService.Instance.warning(message, closeAfter),
    runtimeError: (message, closeAfter) => UssMessagesService.Instance.runtimeError(message, closeAfter),
    success: (message, closeAfter) => UssMessagesService.Instance.success(message, closeAfter),
    debug: (message) => UssMessagesService.Instance.debug(message),
}

export function error(message: string, closeAfter?: number) { msg.error(message, closeAfter); }
export function info(message: string, closeAfter?: number) { msg.info(message, closeAfter); }
export function warning(message: string, closeAfter?: number) { msg.warning(message, closeAfter); }
export function runtimeError(message: string, closeAfter?: number) { msg.runtimeError(message, closeAfter); }
export function success(message: string, closeAfter?: number) { msg.success(message, closeAfter); }
export function log(message: string) { msg.log(message); }
export function debug(message: string) { msg.debug(message); }

