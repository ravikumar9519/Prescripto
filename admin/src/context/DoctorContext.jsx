
/* eslint-disable react/prop-types */
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
export const DoctorContext = createContext()
import { toast } from "react-toastify";
const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);


   const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: {dToken}});
      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
        
      }
      else{
       // console.log(data.message);
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  const completeAppointment = async (appointmentId) => {
     try {
        const {data} = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, {appointmentId}, {
           headers: {dToken}
        })
        if(data.success){
           toast.success(data.message);
           getAppointments();
        }
        else{
           toast.error(data.message);
        }
     } catch (error) {
      console.log(error);
      toast.error(error.message);
     }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
       const {data} = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, {appointmentId}, {
          headers: {dToken}
       })
       if(data.success){
          toast.success(data.message);
          getAppointments();
       }
       else{
          toast.error(data.message);
       }
    } catch (error) {
     console.log(error);
     toast.error(error.message);
    }
 }
  const getDashData = async () => {
     try {
        console.log("1111111111111");
        const {data} = await axios.get(backendUrl+"/api/doctor/dashboard", {headers: {dToken}});
        console.log("5555555555555555",data);  
        if(data.success){
           setDashData(data.dashData);
           console.log(data.dashData);   
        }
        else{
           toast.error(data.message);
        }
     } catch (error) {
      console.log("22222222222222222");
      console.log(error);
      toast.error(error.message);
      
     }
  }


  const value = {
     dToken,setDToken,backendUrl,appointments,setAppointments,getAppointments,completeAppointment,cancelAppointment,dashData,setDashData,getDashData
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider