export interface ChatStrategy {
  sendMessage(input: string): Promise<string>;
}
