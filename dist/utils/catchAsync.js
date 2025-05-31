"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        if (err instanceof Error) {
            next(err);
        }
        else {
            next(new Error('An unknown error occurred'));
        }
    });
};
exports.default = catchAsync;
