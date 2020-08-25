"use strict";
/*!
 * Licensed under the MIT License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
//import * as MRE from '../../mixed-reality-extension-sdk/packages/sdk/src';
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const app_1 = __importDefault(require("./app"));
/* eslint-disable no-console */
process.on('uncaughtException', err => console.log('uncaughtException', err));
process.on('unhandledRejection', reason => console.log('unhandledRejection', reason));
/* eslint-enable no-console */
// Read .env if file exists
dotenv_1.default.config();
//command line args
let port = process.env.PORT;
if (process.argv.length > 2) {
    port = process.argv[2];
    MRE.log.info("app", "setting port to: " + port);
}
// Start listening for connections, and serve static files
const server = new MRE.WebHost({
    //baseUrl: 'http://altspace-theremin.ngrok.io',
    //baseUrl: 'http://altspace-music-modules.azurewebsites.net',
    //baseUrl: 'http://45.55.43.77',
    baseUrl: 'http://199.19.73.131:' + port.toString(),
    port: port,
    baseDir: path_1.resolve(__dirname, '../public'),
    permissions: [MRE.Permissions.UserInteraction]
});
// Handle new application sessions
server.adapter.onConnection(context => {
    MRE.log.info("app", "about the create new App in server.ts");
    MRE.log.info("app", "arguements passed in: " + process.argv);
    return new app_1.default(context, server.baseUrl, server.baseDir);
});
//# sourceMappingURL=server.js.map