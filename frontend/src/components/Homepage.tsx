import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import Events from "./Events";

const Homepage = () => {
  
  const {user} = useSelector((store: any) => store.auth);
  const navigate = useNavigate();

  useEffect(() =>{
    if(!user){
      navigate("/login");
    }
  },[])

  return (
    <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 py-8">
      <Events />
    </main>
  </div>
  );
};

export default Homepage;
