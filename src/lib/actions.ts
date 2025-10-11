'use server';

import { customerSupportChatbot } from '@/ai/flows/customer-support-chatbot';
import { z } from 'zod';

const ChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type ChatbotState = {
  userMessage: string;
  botMessage: string;
  error: string | null;
}

export async function getChatbotResponse(prevState: ChatbotState, formData: FormData) {
  const validatedFields = ChatSchema.safeParse({
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      userMessage: '',
      botMessage: "I'm sorry, I didn't understand that. Please try rephrasing.",
      error: 'Invalid message format.',
    };
  }
  
  const userMessage = validatedFields.data.message;

  try {
    const response = await customerSupportChatbot({ question: userMessage });
    return {
      userMessage: userMessage,
      botMessage: response.answer,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      userMessage: userMessage,
      botMessage: "I'm sorry, something went wrong. Please try again later.",
      error: 'Failed to get a response from the AI.',
    };
  }
}
