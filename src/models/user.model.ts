import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
 email: string;
 password: string;
 nome?: string;
 createdAt: Date;
 updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'O email é obrigatório.'],
        unique: true, 
        lowercase: true, 
        trim: true, 
        match: [/\S+@\S+\.\S+/, 'Por favor, insira um endereço de email válido.'],
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória.'],
        minlength: [8, 'A senha deve ter pelo menos 8 caracteres.'], 
    },
    nome: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true,
});

userSchema.pre<IUser>("save", async function(next) {
    if (!this.isModified("password")) return next();
})

export default model<IUser>("User", userSchema);