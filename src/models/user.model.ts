import { Document, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
 email: string;
 password_hash: string;
 nome?: string;
 createdAt: Date;
 updatedAt: Date;
 comparePassword(candidatePassword: string) : Promise<boolean>   
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
    password_hash: {
        type: String,
        required: [true, 'A senha é obrigatória.'],
        minlength: [8, 'O hash da senha parece curto demais, isso não deveria acontecer.'], 
    },
    nome: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true,
});

userSchema.pre<IUser>("save", async function(next) {
    if (!this.isModified("password_hash")) return next();
})

userSchema.methods.comparePassword = async function(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
}

export default model<IUser>("User", userSchema);