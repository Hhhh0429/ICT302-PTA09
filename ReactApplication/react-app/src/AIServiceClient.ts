// src/AIServiceClient.ts

import axios from 'axios';

class AIServiceClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async generateResponse(input: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/messages`, { text: input });
      if (typeof response.data.text === 'string') {
        return response.data.text;
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('Error in AI service:', error);
      throw error;
    }
  }
}

export default AIServiceClient;