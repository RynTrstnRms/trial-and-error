<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::all();
        return response()->json($patients);
    }

    public function show($id)
    {
        $patient = Patient::findOrFail($id);
        return response()->json($patient);
    }

    public function showEmail($email)
    {
        try {
            $patient = Patient::where('email', $email)->firstOrFail();
            return response()->json($patient);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Doctor not found.'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:Male,Female,Other',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:patients,email',
            'emergency_contact' => 'nullable|string|max:20',
            'medical_history' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $patient = Patient::create($validator->validated());

        return response()->json(['message' => 'Patient added successfully', 'patient' => $patient], 201);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:Male,Female,Other',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:patients,email,' . $patient->id,
            'emergency_contact' => 'nullable|string|max:20',
            'medical_history' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $patient->update($validator->validated());

        return response()->json(['message' => 'Patient updated successfully', 'patient' => $patient]);
    }

    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();
        return response()->json(['message' => 'Patient removed successfully']);
    }
}
