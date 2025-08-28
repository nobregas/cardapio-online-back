import {
	type ChatSession,
	type Content,
	GoogleGenerativeAI,
	GoogleGenerativeAIResponseError,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";
import { ErrorCode, ErrorMessage } from "../enums";
import { InternalException } from "../exceptions/InternalException";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../secrets";

export interface ChatHistory {
	role: "user" | "model";
	parts: { text: string }[];
}

const SAFETY_SETTINGS = [
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	},
];

class AiService {
	private readonly genAI: GoogleGenerativeAI;
	private readonly model = GEMINI_MODEL;

	constructor() {
		const apiKey = GEMINI_API_KEY;
		if (!apiKey) {
			throw new InternalException(
				ErrorMessage.API_KEY_NOT_CONFIGURED,
				ErrorCode.API_KEY_NOT_CONFIGURED,
			);
		}
		this.genAI = new GoogleGenerativeAI(apiKey);
	}

	async startChat(userMessage: string, history: ChatHistory[] = []) {
		try {
			const systemPrompt = this.generateSystemPrompt();

			const generativeModel = this.genAI.getGenerativeModel({
				model: this.model,
				systemInstruction: systemPrompt,
				safetySettings: SAFETY_SETTINGS,
			});

			const chat: ChatSession = generativeModel.startChat({
				history: history as Content[],
			});

			const result = await chat.sendMessage(userMessage);
			const response = result.response;

			const text = response.text();
			if (!text) {
				console.error("----------API ERROR: Empty response----------", response);
				throw new InternalException(
					ErrorMessage.AI_RESPONSE_ERROR,
					ErrorCode.AI_RESPONSE_ERROR,
				);
			}
			return text.trim();
		} catch (error) {
			console.error("Erro ao interagir com o chat do Gemini:", error);
			if (error instanceof GoogleGenerativeAIResponseError) {
				console.error("----------API RESPONSE ERROR----------", error.response);
				throw new InternalException(
					ErrorMessage.AI_RESPONSE_ERROR,
					ErrorCode.AI_RESPONSE_ERROR,
				);
			}
			throw error;
		}
	}
	private generateSystemPrompt(): string {
		return `Você é um assistente virtual especializado em sistemas de gerenciamento de cardápio e gastronomia. Sua função é ajudar donos de restaurantes e estabelecimentos gastronômicos com:
- Organização e categorização de pratos e produtos.
- Estratégias de precificação e engenharia de cardápio.
- Otimização de cardápios para vendas e popularidade.
- Análise de custos, ingredientes e ficha técnica.
- Sugestões de marketing gastronômico e promoções.
- Informações sobre tendências culinárias e inovações do setor.

Responda de forma prática, profissional e útil. Suas respostas devem ser concisas, mas informativas, focadas em agregar valor ao negócio do usuário.`;
	}
}

export default new AiService();
