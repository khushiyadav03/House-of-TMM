declare module 'razorpay' {
  export interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  export interface OrderOptions {
    amount: number;
    currency: string;
    receipt?: string;
    notes?: Record<string, string>;
    payment_capture?: boolean;
  }

  export interface Order {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
  }

  export interface RazorpayOrdersAPI {
    create(options: OrderOptions): Promise<Order>;
    fetch(orderId: string): Promise<Order>;
    all(options?: { from?: number; to?: number; count?: number; skip?: number }): Promise<{ entity: string; count: number; items: Order[] }>;
  }

  export interface RazorpayInstance {
    orders: RazorpayOrdersAPI;
  }

  export default class Razorpay {
    constructor(options: RazorpayOptions);
    orders: RazorpayOrdersAPI;
  }
}

declare global {
  interface Window {
    Razorpay: any;
  }
}