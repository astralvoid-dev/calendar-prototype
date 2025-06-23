'use client'

import { useEffect, useState } from "react";
// import { supabase } from "../lib/init-supabase.js"
import { createClient } from '@supabase/supabase-js';

export default function Patients(){
    const [patients, setPatients] = useState([]);
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const { data: patients, error } = await supabase.from('patients').select('*');
        if (error) {
            console.error('Error fetching patients:', error);
            return;
        }
        setPatients(patients);
    };
    
    return (
        <ul>
            <li>Patient</li>
        </ul>
    );
}
