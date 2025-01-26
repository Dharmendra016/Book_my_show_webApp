import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import axios from "axios"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router"
function Login() {

    const [input, setInput] = React.useState({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({
            ...input,
            [e.target.id]: e.target.value
        })
    }

    const navigate = useNavigate();

    const signupHandeler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            const res = await axios.post('http://localhost:3000/login', input, {
                headers: {
                    'Content-Type':'application/json'
                },
                withCredentials: true,
            })
            console.log('Response:', res.data);
            if (res.data.success) {
                toast.success(res.data.message);
                
                setInput({
                    email: "",
                    password: "",
                })
                navigate('/')
            }
            
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className=" flex justify-center items-center h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={signupHandeler}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" name="email" value={input.email}
                                    onChange={handleChange} id="email" placeholder="Email"  required/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" name="password" value={input.password}
                                    onChange={handleChange} id="password" placeholder="password" required />
                            </div>
                        <div className="flex flex-col gap-3 items-center justify-center">
                            <Button type="submit" className="w-full">Login</Button>
                        </div>
                        
                        <span className='text-center '>Create an account? <Link to="/signup" className='text-blue-400'>Singup</Link></span>
                        

                        </div>
       
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login