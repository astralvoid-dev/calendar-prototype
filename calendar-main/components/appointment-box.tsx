"use as client"

import { supabase } from "@/lib/init-supabase";
import { useEffect, useState } from "react";
import { ClockIcon, MapPinIcon, NotebookPenIcon } from "lucide-react";

export default function AppointmentBox(){
    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const { data: appointmentsData } = await supabase.from('appointments').select('*');
        setAppointments(appointmentsData || []);
    }
    
    return(
        <div>
            {appointments.map((appointment, idx) => (
                <div key={idx} className="border border-slate-700 bg-white hover:bg-gray-400">
                    <p>{appointment.title}</p>
                    <div className="flex gap-2 items-end">
                        <ClockIcon/>
                        <p>
                            {appointment.start_time} bis {appointment.end_time}
                        </p>
                    </div>
                    <div className="flex gap-2 items-end">
                        <MapPinIcon/>
                        <p>{appointment.location}</p>
                    </div>
                    <div className="flex gap-2 items-end">
                        <NotebookPenIcon/>
                        <p>{appointment.notes}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}