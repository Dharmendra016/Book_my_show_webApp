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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import axios from "axios"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router"
function Signup() {

    const [input, setInput] = React.useState({
        name: "",
        email: "",
        password: "",
        phoneno: "",
        role: ""
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
            console.log(input);

            const res = await axios.post('https://book-my-show-webapp-1.onrender.com/signup', input, {
                headers: {
                    'Content-Type':'application/json'
                },
                withCredentials: true,
            })
            console.log('Response:', res.data);
            if (res.data.success) {
                toast.success(res.data.message);
                setInput({
                    name: "",
                    email: "",
                    password: "",
                    phoneno: "",
                    role: ""
                })
                navigate('/login');
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
                    <CardTitle>Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={signupHandeler}>
                        <div className="grid w-full items-center gap-2">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input type="text" name="name" value={input.name}
                                    onChange={handleChange} id="name" placeholder="Name" required />
                            </div>
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
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="phoneno">phoneno</Label>
                                <Input type="tel" name="phoneno" value={input.phoneno}
                                    onChange={handleChange} id="phoneno" placeholder="phoneno" required  />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="framework">Role</Label>
                                <Select required name="role" value={input.role} onValueChange={(value) =>
                                setInput((prevInput) => ({ ...prevInput, role: value }))
                            }>
                                    <SelectTrigger id="framework">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" >
                                        <SelectItem value="user">user</SelectItem>
                                        <SelectItem value="admin">admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <Button type="submit" className="w-full">Create</Button>
                            </div>
                            
                             <span className='text-cente'>Already have an account? <Link to="/login" className='text-blue-400'>Login</Link></span>
                        </div>
                    </form>
                </CardContent>
                
            </Card>
        </div>
    )
}

export default Signup