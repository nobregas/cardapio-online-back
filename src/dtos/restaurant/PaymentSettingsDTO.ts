export interface PaymentSettingsDTO {
  online: {
    active: boolean;
    methods: {
      creditCard: boolean;
      debitCard: boolean;
      pix: boolean;
    };
  };
  onDelivery: {
    active: boolean;
    methods: {
      cash: boolean;
      creditCard: boolean;
      debitCard: boolean;
      pix: boolean;
    };
    needsChange: boolean;
  };
  pixDetails: {
    key: string;
    keyHolderName: string;
  };
  additionalInstructions?: string;
}

export type UpdatePaymentSettingsDTO = PaymentSettingsDTO;
