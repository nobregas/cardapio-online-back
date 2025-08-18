import rateLimit from "express-rate-limit";
import RateLimitExceededException from "../exceptions/RateLimitExceededException";

export default function ratelimiter(attempts: number, blockTime: number) {
	return rateLimit({
		windowMs: blockTime,
		max: attempts,
		message: new RateLimitExceededException(),
		standardHeaders: true,
		legacyHeaders: false,
	});
}
