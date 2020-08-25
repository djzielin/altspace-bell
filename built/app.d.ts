/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import Users from './users';
export default class App {
    context: MRE.Context;
    baseUrl: string;
    baseDir: string;
    assets: MRE.AssetContainer;
    ourUsers: Users;
    boxMesh: MRE.Mesh;
    sphereMesh: MRE.Mesh;
    constructor(context: MRE.Context, baseUrl: string, baseDir: string);
    private stopped;
    private started;
    private spawnSound;
}
//# sourceMappingURL=app.d.ts.map