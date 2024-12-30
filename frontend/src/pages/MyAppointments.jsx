/* eslint-disable react-hooks/exhaustive-deps */


import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const navigate = useNavigate()
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const getUserAppointments = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const cancelAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Online Appointment Payment',
      order_id: order.id, 
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } });
          if (data.success) {
            getUserAppointments();
            navigate('/my-appointments');
            toast.success(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }
  const appointmentRazorpay = async (appointmentId) => {
      try{
        const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } });
        if(data.success){
          //console.log(data.order);
          
          initPay(data.order);
        }
      }
      catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium border-b text-zinc-700'>My appointments</p>

      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='font-semibold text-neutral-800'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='mt-1 font-medium text-zinc-700'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='mt-1 text-sm'><span className='text-sm font-medium text-neutral-700'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
            </div>

            <div></div>

            <div className='flex flex-col justify-end gap-2'>
              {!item.cancelled && item.payment && <button className='py-2 text-sm text-green-500 transition-all duration-300 border border-green-500 rounded sm:min-w-48'>Paid</button>}
              {!item.cancelled && !item.payment && <button onClick={()=>appointmentRazorpay(item._id)} className='py-2 text-sm transition-all duration-300 border rounded text-stone-500 sm:min-w-48 hover:bg-primary hover:text-white'>Pay Online</button>}
              {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='py-2 text-sm transition-all duration-300 border rounded text-stone-500 sm:min-w-48 hover:bg-red-600 hover:text-white'>Cancel Appointment</button>}
              {item.cancelled && <button className='py-2 text-red-500 border border-red-500 rounded sm:min-w-48'>Appointment Cancelled</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments