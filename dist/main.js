"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const app = new koa_1.default();
app.use(async (ctx) => {
    ctx.body = 'Hello, TypeScript with Koa!';
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
//# sourceMappingURL=main.js.map