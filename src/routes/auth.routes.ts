import { Router } from "express";

const authRoutes = Router();

const ATTEMPTS = 5;
const BLOCK_TIME = 10 * 60 * 1000;


export default authRoutes;