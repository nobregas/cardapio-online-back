import { Document, model, Schema } from "mongoose";

export interface IPaymentSettings {
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

export interface IRestaurant extends Document {
  name: string;
  cnpj?: string;
  logo?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  description: string;
  phone: string;
  ownerId: Schema.Types.ObjectId;
  paymentSettings: IPaymentSettings;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "O nome do restaurante é obrigatório."],
    },
    cnpj: {
      type: String,
      trim: true,
      required: [true, "O CNPJ do restaurante é obrigatório."],
    },
    logo: {
      type: String,
      trim: true,
      required: [true, "O logo do restaurante é obrigatório."],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "O email do restaurante é obrigatório."],
    },
    address: {
      street: {
        type: String,
        trim: true,
        required: [true, "A rua do restaurante é obrigatória."],
      },
      city: {
        type: String,
        trim: true,
        required: [true, "A cidade do restaurante é obrigatória."],
      },
      state: {
        type: String,
        trim: true,
        required: [true, "O estado do restaurante é obrigatório."],
      },
      zipCode: {
        type: String,
        trim: true,
        required: [true, "O CEP do restaurante é obrigatório."],
      },
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "O telefone do restaurante é obrigatório."],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "O proprietário do restaurante é obrigatório."],
    },
    paymentSettings: {
      online: {
        active: { type: Boolean, default: false },
        methods: {
          creditCard: { type: Boolean, default: false },
          debitCard: { type: Boolean, default: false },
          pix: { type: Boolean, default: false },
        },
      },
      onDelivery: {
        active: { type: Boolean, default: false },
        methods: {
          cash: { type: Boolean, default: false },
          creditCard: { type: Boolean, default: false },
          debitCard: { type: Boolean, default: false },
          pix: { type: Boolean, default: false },
        },
        needsChange: { type: Boolean, default: false },
      },
      pixDetails: {
        key: {
          type: String,
          trim: true,
          required: [
            function (this: IRestaurant) {
              const settings = this.paymentSettings;
              if (!settings) return false;

              const onlinePix = settings.online?.methods?.pix;
              const deliveryPix = settings.onDelivery?.methods?.pix;

              return onlinePix || deliveryPix;
            },
            "A Chave Pix é obrigatória se o pagamento via Pix estiver habilitado.",
          ],
        },
        keyHolderName: {
          type: String,
          trim: true,
          required: [
            function (this: IRestaurant) {
              const settings = this.paymentSettings;
              if (!settings) return false;

              const onlinePix = settings.online?.methods?.pix;
              const deliveryPix = settings.onDelivery?.methods?.pix;

              return onlinePix || deliveryPix;
            },
            "O nome do favorecido é obrigatório se o pagamento via Pix estiver habilitado.",
          ],
        },
      },
      additionalInstructions: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

export default model<IRestaurant>("Restaurant", restaurantSchema);
