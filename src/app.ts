/*!
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import Users from './users';
import { ENAMETOOLONG } from 'constants';

export default class App {
	public assets: MRE.AssetContainer;	
	public ourUsers: Users;
	public boxMesh: MRE.Mesh;
	public sphereMesh: MRE.Mesh;

	constructor(public context: MRE.Context, public baseUrl: string, public baseDir: string) {

		this.ourUsers = new Users(this);

		this.assets = new MRE.AssetContainer(context);
		this.boxMesh = this.assets.createBoxMesh('boxMesh', 1.0, 1.0, 1.0);
		this.sphereMesh= this.assets.createSphereMesh('sphereMesh',0.5,10,10);


		this.context.onUserLeft(user => this.ourUsers.userLeft(user));
		this.context.onUserJoined(user => this.ourUsers.userJoined(user));

		this.context.onStarted(() => this.started());
		this.context.onStopped(() => this.stopped());
	}

	private stopped() {
		MRE.log.info("app", "stopped callback has been called");
	}

	private started() {
		MRE.log.info("app","started callback has begun");	

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

		bellCollider.collider.onTrigger("trigger-enter", (otherActor: MRE.Actor) => {
			MRE.log.info("app", "trigger enter on piano note!");

			if (otherActor.name.includes('SpawnerUserHand')) {
				const guid = otherActor.name.substr(16);
				//this.ourApp.ourConsole.logMessage("  full user name is: " + otherActor.name);
				//this.ourApp.ourConsole.logMessage("  guid is: " + guid);

				this.spawnSound(ourSound);
			} 
		});

		
		const buttonBehavior = bellCollider.setBehavior(MRE.ButtonBehavior);
		buttonBehavior.onButton("pressed", (user: MRE.User, buttonData: MRE.ButtonEventData) => {
			this.spawnSound(ourSound);
		});
	}

	private spawnSound(ourSound: MRE.Sound){
		const bellSound = MRE.Actor.Create(this.context, {
			actor: {
				name: 'bellSound',
				transform: {
					app: {
						position: new MRE.Vector3(0,0,0)
					}
				}
			}
		});

		const mediaInstance=bellSound.startSound(ourSound.id, {
			doppler: 0,
			pitch: 0.0,
			looping: false,
			paused: false,
			volume: 0.5,
			rolloffStartDistance: 1.0 
		});	

		setTimeout(()=>{
			bellSound.destroy();
		},4000);
	}
}
