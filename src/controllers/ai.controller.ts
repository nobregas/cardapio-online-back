import { NextFunction, Request, Response } from "express";
import { ErrorMessage, ErrorCode, HttpStatus } from "../enums";
import { BadRequest } from "../exceptions/BadRequest";
import aiService from "../services/ai.service";
import { ChatHistory } from "../services/ai.service";

class AiController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, history } = req.body as {
        message: string;
        history?: ChatHistory[];
      };

      if (!message || typeof message !== "string") {
        throw new BadRequest(
          ErrorMessage.MESSAGE_IS_REQUIRED,
          ErrorCode.MESSAGE_IS_REQUIRED
        );
      }

      if (history && !Array.isArray(history)) {
        throw new BadRequest(
          ErrorMessage.INVALID_HISTORY_FORMAT,
          ErrorCode.INVALID_HISTORY_FORMAT
        );
      }

      const aiResponse = await aiService.startChat(message, history);

      res.status(HttpStatus.OK).json({ response: aiResponse });
    } catch (error) {
      next(error);
    }
  }
}

export default new AiController();
