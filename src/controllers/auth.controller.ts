import { CreateUserDTO, LoginUserDto, UpdateUserDto } from "../dtos/user.dtos";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";

let userService = new UserService();
export class AuthController{
    async register(req: Request, res: Response) {
        try {
            const parsedData = CreateUserDTO.safeParse(req.body);
            if( !parsedData.success) {
                return res.status(400).json(
                    ( {success: false, message: "Validation Error", errors: parsedData.error.flatten().fieldErrors} )
                );
            }
            const newUser = await userService.registerUser(parsedData.data);
            return res.status(201).json(
                    ( {success: true, data: newUser, message: (" Register success") } )
                );
            
        } catch (error: Error | any ) {
            return res.status(error.statusCode || 500).json(
                    ( {success: false, message: error.message || " Internal Server Error" } )
            );
        }
    }
    async login(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDto.safeParse(req.body);
            if(!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: "Validation Error", errors: parsedData.error.flatten().fieldErrors }
                );
            }
                const { token, existingUser } = await userService.loginUser(parsedData.data);
                return res.status(200).json(
                    { success: true, data: existingUser, token, message:" Login success"}
                );
            } catch (error: Error | any) {
                return res.status(error.statusCode || 500).json(
                    {success: false, message:error.message || "Internet Server Error"}
                );
        }
    }

    
    updateProfile = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User Id Not found"
                });
            }

            const parsedData = UpdateUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: parsedData.error.flatten().fieldErrors
                });
            }
            const updatedUser = await userService.updateUser(userId, parsedData.data);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found or update failed"
                });
            }

            return res.status(200).json({
                success: true,
                data: updatedUser,
                filename: (req as any).file ? (req as any).file.filename : 
                        ((req as any).files && Array.isArray((req as any).files) && (req as any).files.length > 0) ? (req as any).files[0].filename : 
                        updatedUser.profilePicture,
                message: "User profile updated successfully"
            });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
    async sendResetPasswordEmail(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const user = await userService.sendResetPasswordEmail(email);
            return res.status(200).json(
                {
                    success: true,
                    data: user,
                    message: "If the email is registered, a reset link has been sent."
                }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {

            const token = req.params.token as string;
            const { newPassword } = req.body;
            await userService.resetPassword(token, newPassword);
            return res.status(200).json(
                { success: true, message: "Password has been reset successfully." }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
}
