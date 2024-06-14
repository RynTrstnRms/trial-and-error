<?php

namespace App\Http\Controllers;

use App\Models\Medical_Record;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function index()
    {
        $medicalRecords = Medical_Record::all();
        return response()->json($medicalRecords);
    }

    public function show($id)
    {
        $medicalRecord = Medical_Record::findOrFail($id);
        return response()->json($medicalRecord);
    }

    public function showDoctor($doctorId)
    {
        $medicalRecord = Medical_Record::where('doctor_id', $doctorId)->get();
        return response()->json($medicalRecord);
    }

    public function showPatients($doctorId)
    {
        $medicalRecord = Medical_Record::where('patient_id', $doctorId)->get();
        return response()->json($medicalRecord);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required',
            'doctor_id' => 'required',
            'visit_date' => 'required|date',
            'diagnosis' => 'required',
            'treatment' => 'required',
            'notes' => 'nullable',
        ]);

        $medicalRecord = Medical_Record::create($validatedData);

        return response()->json(['message' => 'Medical Record added successfully', 'medical_record' => $medicalRecord], 201);
    }

    public function update(Request $request, $id)
    {
        $medicalRecord = Medical_Record::findOrFail($id);

        $validatedData = $request->validate([
            'visit_date' => 'required|date',
            'diagnosis' => 'required',
            'treatment' => 'required',
            'notes' => 'nullable',
        ]);

        $medicalRecord->update($validatedData);

        return response()->json(['message' => 'Medical Record updated successfully', 'medical_record' => $medicalRecord]);
    }

    public function destroy($id)
    {
        $medicalRecord = Medical_Record::findOrFail($id);
        $medicalRecord->delete();
        return response()->json(['message' => 'Medical Record removed successfully']);
    }
}
