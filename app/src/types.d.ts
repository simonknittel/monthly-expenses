export interface Entry {
  type: "revenue" | "expense";
  category: string;
  transactionPartner: string;
  description: string;
  value: number;
}
