"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Date_1 = __importDefault(require("../models/Date"));
const router = express_1.default.Router();
// Fetch all dates
router.get('/dates', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dates = yield Date_1.default.find();
        res.json({ dates });
    }
    catch (err) {
        res.status(500).json({ message: 'Unable to get dates' });
    }
}));
// Add a date
router.post('/dates/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.body;
    const newDate = new Date_1.default({ date });
    try {
        const savedDate = yield newDate.save();
        res.status(201).json(savedDate);
    }
    catch (err) {
        res.status(400).json({ message: 'Unable to add' });
    }
}));
// Delete a date
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedDate = yield Date_1.default.findByIdAndDelete(req.params.id);
        if (!deletedDate) {
            return res.status(404).json({ message: 'Date not found' });
        }
        res.json({ message: 'Date deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Unable to delete' });
    }
}));
exports.default = router;
