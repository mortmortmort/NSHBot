'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var DebugLevel;
(function (DebugLevel) {
    DebugLevel["OFF"] = "OFF";
    DebugLevel["ERROR"] = "ERROR";
    DebugLevel["DEBUG"] = "DEBUG";
    DebugLevel["TRACE"] = "TRACE";
})(DebugLevel || (DebugLevel = {}));
var DebugData = /** @class */ (function () {
    function DebugData(debugGuildId, debugChannelId, debugLevel) {
        this.debugGuildId = debugGuildId;
        this.debugChannelId = debugChannelId;
        this.debugLevel = debugLevel;
    }
    DebugData.prototype.checkLevelForMessage = function (debugLevel) {
        switch (debugLevel) {
            case DebugLevel.OFF:
                return false;
            case DebugLevel.ERROR:
                switch (this.debugLevel) {
                    case DebugLevel.ERROR:
                    case DebugLevel.DEBUG:
                    case DebugLevel.TRACE:
                        return true;
                }
            case DebugLevel.DEBUG:
                switch (this.debugLevel) {
                    case DebugLevel.DEBUG:
                    case DebugLevel.TRACE:
                        return true;
                }
            case DebugLevel.TRACE:
                switch (this.debugLevel) {
                    case DebugLevel.TRACE:
                        return true;
                }
        }
        return false;
    };
    return DebugData;
}());
var DebugDataPersist = /** @class */ (function () {
    function DebugDataPersist() {
    }
    DebugDataPersist.readFromDisk = function () {
        return __awaiter(this, void 0, void 0, function () {
            var path;
            return __generator(this, function (_a) {
                path = this.DATA_PATH + this.FILENAME;
                return [2 /*return*/, fs_1.promises.readFile(path)
                        .then(function (buffer) {
                        return JSON.parse(buffer.toString());
                    })
                        .catch(function () {
                        return new DebugData("", "", DebugLevel.OFF);
                    })];
            });
        });
    };
    DebugDataPersist.writeToDisk = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var path, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.DATA_PATH + this.FILENAME;
                        buffer = JSON.stringify(data);
                        return [4 /*yield*/, fs_1.promises.writeFile(path, buffer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DebugDataPersist.DATA_PATH = "./data/";
    DebugDataPersist.FILENAME = "debug.json";
    return DebugDataPersist;
}());
var DebugProcessor = /** @class */ (function () {
    function DebugProcessor() {
    }
    DebugProcessor.messageDebugChannel = function (debugData, client, message, text) {
        return __awaiter(this, void 0, void 0, function () {
            var debugChannel;
            return __generator(this, function (_a) {
                debugChannel = client.channels.cache.get(debugData.debugChannelId);
                if (debugChannel === undefined)
                    return [2 /*return*/];
                if (debugChannel.guild.id !== debugData.debugGuildId)
                    return [2 /*return*/];
                debugChannel.send(text);
                return [2 /*return*/];
            });
        });
    };
    DebugProcessor.logMessage = function (client, message, text, debugLevel) {
        return __awaiter(this, void 0, void 0, function () {
            var debugData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DebugDataPersist.readFromDisk()];
                    case 1:
                        debugData = _a.sent();
                        if (debugData.checkLevelForMessage(DebugLevel.ERROR)) {
                            this.messageDebugChannel(debugData, client, message, text);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DebugProcessor.logMessageError = function (client, message, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                text = "ERROR: " + text;
                this.logMessage(client, message, text, DebugLevel.ERROR);
                console.log(text);
                return [2 /*return*/];
            });
        });
    };
    DebugProcessor.logMessageDebug = function (client, message, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                text = "DEBUG: " + text;
                this.logMessage(client, message, text, DebugLevel.DEBUG);
                console.log(text);
                return [2 /*return*/];
            });
        });
    };
    DebugProcessor.logMessageTrace = function (client, message, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                text = "TRACE: " + text;
                this.logMessage(client, message, text, DebugLevel.TRACE);
                console.log(text);
                return [2 /*return*/];
            });
        });
    };
    return DebugProcessor;
}());
exports.DebugProcessor = DebugProcessor;
var DebugCommandProcessor = /** @class */ (function () {
    function DebugCommandProcessor() {
    }
    DebugCommandProcessor.setDebugChannel = function (client, message) {
        return __awaiter(this, void 0, void 0, function () {
            var guildId, channelId, debugData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DebugProcessor.logMessageTrace(client, message, "setDebugChannel() invoked");
                        if (!message.guild || !message.channel)
                            return [2 /*return*/];
                        guildId = message.guild.id;
                        channelId = message.channel.id;
                        return [4 /*yield*/, DebugDataPersist.readFromDisk()];
                    case 1:
                        debugData = _a.sent();
                        debugData.debugGuildId = message.guild.id;
                        debugData.debugChannelId = message.channel.id;
                        return [4 /*yield*/, DebugDataPersist.writeToDisk(debugData)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    DebugCommandProcessor.setDebugLevel = function (client, message, level) {
        return __awaiter(this, void 0, void 0, function () {
            var debugLevel, debugData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DebugProcessor.logMessageTrace(client, message, "setDebugLevel() invoked, level = " + level);
                        switch (level.toUpperCase()) {
                            case DebugLevel.OFF:
                                debugLevel = DebugLevel.OFF;
                                break;
                            case DebugLevel.ERROR:
                                debugLevel = DebugLevel.ERROR;
                                break;
                            case DebugLevel.DEBUG:
                                debugLevel = DebugLevel.DEBUG;
                                break;
                            case DebugLevel.TRACE:
                                debugLevel = DebugLevel.TRACE;
                                break;
                            default:
                                return [2 /*return*/];
                        }
                        return [4 /*yield*/, DebugDataPersist.readFromDisk()];
                    case 1:
                        debugData = _a.sent();
                        debugData.debugLevel = debugLevel;
                        return [4 /*yield*/, DebugDataPersist.writeToDisk(debugData)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DebugCommandProcessor;
}());
exports.DebugCommandProcessor = DebugCommandProcessor;
