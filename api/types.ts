export interface InquiryRequest {
  client_number: string;
  product_code: string;
  downline_id?: string;
  amount?: number;
  fields?: Array<OrderFields>;
}

export interface CheckoutRequest {
  request_id: string;
  product_code: string;
  client_number: string;
  amount?: number;
  fields?: Array<OrderFields>;
}

interface OrderFields {
  name: string;
  value: string;
}
