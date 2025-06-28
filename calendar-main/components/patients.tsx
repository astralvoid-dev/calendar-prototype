'use client'

import { useEffect, useState } from "react";
import { supabase } from "../lib/init-supabase"

export default function Patients(){
    const [patients, setPatients] = useState<any[]>([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const { data: patientsData, error } = await supabase.from('patients').select('*');
        if (error) {
            console.error('Error fetching patients:', error);
            return;
        }
        setPatients(patientsData || []);
    };
    
    return (
        <div>
            <h1>Patient</h1>
            <ul>
                {patients.map((patient, idx) => (
                    <li key={idx}>{JSON.stringify(patient)}</li>
                ))}
            </ul>
        </div>
    );
}
