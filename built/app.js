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
const users_1 = __importDefault(require("./users"));
class App {
    constructor(context, baseUrl, baseDir) {
        this.context = context;
        this.baseUrl = baseUrl;
        this.baseDir = baseDir;
        this.ourUsers = new users_1.default(this);
        this.assets = new MRE.AssetContainer(context);
        this.boxMesh = this.assets.createBoxMesh('boxMesh', 1.0, 1.0, 1.0);
        this.sphereMesh = this.assets.createSphereMesh('sphereMesh', 0.5, 10, 10);
        this.context.onUserLeft(user => this.ourUsers.userLeft(user));
        this.context.onUserJoined(user => this.ourUsers.userJoined(user));
        this.context.onStarted(() => this.started());
        this.context.onStopped(() => this.stopped());
    }
    stopped() {
        MRE.log.info("app", "stopped callback has been called");
    }
    started() {
        MRE.log.info("app", "started callback has begun");
        const URL = `${this.baseUrl}/` + "bell.wav";
        const ourSound = this.assets.createSound("bell_sound", {
            uri: URL
        });
        const bellCollider = MRE.Actor.Create(this.context, {
            actor: {
                name: 'bellCollider',
                transform: {
                    app: {
                        position: new MRE.Vector3(0, 0.1, 0)
                    }
                },
                appearance: {
                    meshId: this.sphereMesh.id,
                    enabled: false
                },
                collider: {
                    geometry: {
                        shape: MRE.ColliderType.Sphere
                    },
                    isTrigger: true
                }
            }
        });
        bellCollider.collider.onTrigger("trigger-enter", (otherActor) => {
            MRE.log.info("app", "trigger enter on piano note!");
            if (otherActor.name.includes('SpawnerUserHand')) {
                const guid = otherActor.name.substr(16);
                //this.ourApp.ourConsole.logMessage("  full user name is: " + otherActor.name);
                //this.ourApp.ourConsole.logMessage("  guid is: " + guid);
                this.spawnSound(ourSound);
            }
        });
        const buttonBehavior = bellCollider.setBehavior(MRE.ButtonBehavior);
        buttonBehavior.onButton("pressed", (user, buttonData) => {
            this.spawnSound(ourSound);
        });
    }
    spawnSound(ourSound) {
        const bellSound = MRE.Actor.Create(this.context, {
            actor: {
                name: 'bellSound',
                transform: {
                    app: {
                        position: new MRE.Vector3(0, 0, 0)
                    }
                }
            }
        });
        const mediaInstance = bellSound.startSound(ourSound.id, {
            doppler: 0,
            pitch: 0.0,
            looping: false,
            paused: false,
            volume: 0.5,
            rolloffStartDistance: 1.0
        });
        setTimeout(() => {
            bellSound.destroy();
        }, 4000);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map