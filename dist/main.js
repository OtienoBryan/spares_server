"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            const allowed = [
                'http://localhost:3000',
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'http://localhost:8080',
                'https://www.drinksavenue.co.ke',
                'https://drinksavenue.co.ke',
            ];
            const isAllowed = !origin ||
                allowed.includes(origin) ||
                /https?:\/\/.*\.vercel\.app$/.test(origin) ||
                /^https?:\/\/(www\.)?drinksavenue\.co\.ke$/.test(origin) ||
                /^https?:\/\/143\.110\.191\.116(?::\d+)?$/.test(origin);
            callback(null, isAllowed);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'user-id'],
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3001);
    console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
//# sourceMappingURL=main.js.map