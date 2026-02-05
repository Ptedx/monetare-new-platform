import { buildApp } from "../server/app";

let app: any;

export default async function handler(req: any, res: any) {
    if (!app) {
        app = await buildApp();
    }

    return app(req, res);
}
