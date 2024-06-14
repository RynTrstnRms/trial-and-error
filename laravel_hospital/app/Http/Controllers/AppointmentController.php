<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointment = Appointment::all();
        return response()->json($appointment);
    }

    public function show($id)
    {
        $appointment = Appointment::findOrFail($id);
        return response()->json($appointment);
    }

    public function showDoctor($doctorId)
    {
        $appointments = Appointment::where('doctor_id', $doctorId)->get();
        return response()->json($appointments);
    }

    public function showPatients($patientId)
    {
        $appointments = Appointment::where('patient_id', $patientId)->get();
        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        Appointment::create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'appointment_date' => $request->appointment_date,
            'status' => $request->status,
            'reason' => $request->reason,

        ]);

        return response()->json(['message' => 'Appointment added successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->appointment_date = $request->input('appointment_date');
        $appointment->status = $request->input('status');
        $appointment->reason = $request->input('reason');
        $appointment->save();

        return response()->json(['message' => 'Appointment updated successfully', 'appointment' => $appointment]);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();
        return response()->json(['message' => 'Appointment removed successfully']);
    }
}
