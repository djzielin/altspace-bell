/*!
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import Users from './users';

export default class App {
	public assets: MRE.AssetContainer;	
	public ourUsers: Users;
	public boxMesh: MRE.Mesh;
	public sphereMesh: MRE.Mesh;
	public ringHistory: Map<MRE.Guid, number>=new Map(); //number of rings in last 15 seconds
	public bellCollider: MRE.Actor=null;
	public ourSound: MRE.Sound;

	constructor(public context: MRE.Context, public baseUrl: string, public baseDir: string) {

		this.ourUsers = new Users(this);

		this.assets = new MRE.AssetContainer(context);
		this.boxMesh = this.assets.createBoxMesh('boxMesh', 1.0, 1.0, 1.0);
		this.sphereMesh= this.assets.createSphereMesh('sphereMesh',0.5,10,10);

		this.context.onUserLeft(user => {
			this.ourUsers.userLeft(user);
			if(this.ringHistory.has(user.id)){
				this.ringHistory.delete(user.id);
			}
		});

		this.context.onUserJoined(user => {
			this.activateBellCollider();
			this.ourUsers.userJoined(user);
		});

		this.context.onStarted(() => this.started());
		this.context.onStopped(() => this.stopped());
	}

	private stopped() {
		MRE.log.info("app", "stopped callback has been called");
	}

	private started() {
		MRE.log.info("app","started callback has begun");	

		const URL = `${this.baseUrl}/` + "bell.wav";

		this.ourSound = this.assets.createSound("bell_sound", {
			uri: URL
		});		

		this.activateBellCollider();
	}

	private activateBellCollider(){
		if(this.bellCollider){
			this.bellCollider.destroy();
		}

		this.bellCollider = MRE.Actor.Create(this.context, {
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

		this.bellCollider.collider.onTrigger("trigger-enter", (otherActor: MRE.Actor) => {
			if (otherActor.name.includes('SpawnerUserHand')) {
				MRE.log.info("app", "user hand trigger enter on bell!");

				const guid = otherActor.name.substr(16);	
				this.spawnSound(this.ourSound,MRE.parseGuid(guid));
			} 
		});
		
		const buttonBehavior = this.bellCollider.setBehavior(MRE.ButtonBehavior);
		buttonBehavior.onButton("pressed", (user: MRE.User, buttonData: MRE.ButtonEventData) => {
			MRE.log.info("app", "uesr clicked on bell!");
			this.spawnSound(this.ourSound,user.id);
		});
	}

	private spawnSound(ourSound: MRE.Sound, user: MRE.Guid){
		let numRings=0;
		if(this.ringHistory.has(user)){
			numRings=this.ringHistory.get(user)
			if(numRings>2){
				MRE.log.info("app", "user has been hitting the bell to much! rejected sound spawn");
				return;
			}
		}

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

		bellSound.startSound(ourSound.id, {
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

		numRings++;
		this.ringHistory.set(user,numRings);

		setTimeout(()=>{ //remove from ring history after 15 seconds
			const rings=this.ringHistory.get(user);
			this.ringHistory.set(user,rings-1);
		},15000);
	}
}
