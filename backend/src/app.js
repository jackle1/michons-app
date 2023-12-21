"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dates_1 = __importDefault(require("./routes/dates"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default.connect('mongodb://localhost:27017/ourDayDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
// Routes
app.use('/dates', dates_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
