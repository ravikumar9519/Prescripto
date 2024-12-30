import { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';

const DoctorAppointments = () => {
	const {
		dToken,
		appointments,
		getAppointments,
		completeAppointment,
		cancelAppointment,
	} = useContext(DoctorContext);
	const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

	// Fetch appointments whenever dToken changes
	useEffect(() => {
		if (dToken) getAppointments();
	}, [dToken, getAppointments]);

	return (
		<div className='w-full max-w-6xl m-5 rounded-lg'>
			<h2 className='mb-5 text-2xl font-semibold text-center text-primary'>
				All Appointments
			</h2>
			<div className='bg-white border border-gray-200 rounded-lg text-sm shadow-md max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
				{/* Header Row */}
				<div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] border-b border-gray-300 gap-4 py-4 px-6 bg-gray-200 text-gray-700 font-medium'>
					<p>#</p>
					<p>Patient</p>
					<p>Payment</p>
					<p>Age</p>
					<p>Date & Time</p>
					<p>Fees</p>
					<p className='pl-7'>Action</p>
				</div>

				{/* Appointment Rows */}
				{appointments.reverse().map((item, index) => (
					<div
						key={index}
						className='flex flex-wrap justify-between items-center gap-4 text-gray-600 py-4 px-6 border-b sm:grid grid-cols-[0.5fr_1.8fr_1fr_1fr_3fr_1fr_1fr] max-sm:text-base max-sm:gap-6 hover:bg-primary hover:text-white transition-all duration-200 ease-in-out'>
						<p className='hidden sm:block'>{index + 1}</p>
						<div className='flex items-center gap-3'>
							<img
								src={item.userData.image}
								alt='Patient'
								className='w-8 rounded-full shadow-sm '
							/>
							<p className='font-medium'>{item.userData.name}</p>
						</div>
						<p className='inline-block px-3 py-1 text-xs font-medium text-center text-blue-600 bg-blue-100 rounded-full'>
							{item.payment ? 'Online' : 'Cash'}
						</p>
						<p className='pl-5 max-sm:hidden'>
							{calculateAge(item.userData.dob)}
						</p>
						<p>
							{slotDateFormat(item.slotDate)}, {item.slotTime}
						</p>
						<p className='font-semibold'>
							{currency}
							{item.amount}
						</p>
						{item.cancelled ? (
							<p className='text-xs font-medium text-red-400'>Cancelled</p>
						) : item.isCompleted ? (
							<p className='text-xs font-medium text-green-500'>Completed</p>
						) : (
							<div className='flex items-center gap-2'>
								<img
									onClick={() => cancelAppointment(item._id)}
									src={assets.cancel_icon}
									alt='Cancel'
									className='w-10 transition-transform transform cursor-pointer hover:scale-110'
								/>
								<img
									onClick={() => completeAppointment(item._id)}
									src={assets.tick_icon}
									alt='Confirm'
									className='w-10 cursor-pointer hover:scale-110'
								/>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default DoctorAppointments;
