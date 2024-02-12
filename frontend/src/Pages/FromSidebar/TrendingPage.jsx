import React, { useEffect } from 'react'
import { ShowVideos } from '../../Components/ShowVideos'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const TrendingPage = () => {
  const {data}=useSelector((state)=>state.user)
  const navigate=useNavigate();

   useEffect(() => {
     window.scrollTo(0, 0);
   }, []);
  useEffect(() => {
    
    if(!data){
      navigate("/")
    }
  
      }, [data])
  
  return (
    <div className="pt-5">
      <ShowVideos type={"trend"} />
    </div>
  );
}

export default TrendingPage