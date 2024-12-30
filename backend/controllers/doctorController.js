import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import doctorModel from "../models/doctorModel.js";


const changeAvailablity = async (req, res) => {

  try {

    const { docId } = req.body
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Availablity Changed' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

const doctorList = async (req, res) => {

  try {

    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.json({ success: true, doctors })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

//Api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // Validate request payload
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Api to get doctor appointments
const appointmentsDoctor = async (req, res) => {

  try {

    const { docId } = req.body
    const appointments = await appointmentModel.find({ docId })
    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}
//mark appointment completed 
const markCompleted = async (req, res) => {

  try {

    const { docId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    
    if(appointmentData && appointmentData.docId===docId){
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: 'true' });
      return res.json({ success: true, message: 'Appointment Completed' })
    }
    return res.json({ success: false, message: 'Appointment Failed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
}
}
//cancel appointment at doctor panel
const markCancelled = async (req, res) => {

  try {

    const { docId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    
    if(appointmentData && appointmentData.docId===docId){
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: 'true' });
      return res.json({ success: true, message: 'Appointment Cancelled' })
    }
    return res.json({ success: false, message: 'Cancellation Failed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//api to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    console.log(docId);
    
    const appointments = await appointmentModel.find({ docId });
    let earnings = 0;
    appointments.map((appointment) => {
        if (appointment.isCompleted || appointment.payment){
          earnings += appointment.amount;
        }
    });

     let patients = [];
     appointments.map((appointment) => { 
        if (!patients.includes(appointment.userId)){
          patients.push(appointment.userId);
        }
    });
    
    const dashData ={
       earnings,
       appointments:appointments.length,
       patients: patients.length,
       latestAppointments: appointments.reverse().slice(0,5)
    }
    console.log("data send successfully");
    
    res.json({ success: true, dashData });

  } catch (error) {
    console.log("hi i am ravi ",error)
    res.json({ success: false, message: error.message })
  }
}

export { changeAvailablity, doctorList , loginDoctor, appointmentsDoctor, markCompleted,markCancelled, doctorDashboard }  //exporting the functions to be used in other files.  //exporting